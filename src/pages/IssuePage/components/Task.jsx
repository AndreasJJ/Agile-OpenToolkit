import React, {useState, useEffect, useContext, useRef} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { FirebaseContext, GetDocument, UpdateDocument } from './../../../sharedComponents/Firebase';
import Select from './../../../sharedComponents/Select';

import Checkbox from './Checkbox'

import styled from 'styled-components';

const TaskWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
  align-items: center;
`

const TaskInfo = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
`

const TaskHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 5px;
`

const TaskTitle = styled.h3`
  font-size: 1.17em;
  margin-block-start: 0em;
  margin-block-end: 0em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
`

const TaskAssignation = styled.div`
  display: flex;
  align-items: center;
`

const CheckBoxLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`

const Task = (props) => {
  // Previous props
  const prevProps = useRef(props)

  // Firebase
  const firebase = useContext(FirebaseContext)

  // Redux state
  const uid = useSelector(state => state.authentication.user.uid)
  const firstname = useSelector(state => state.authentication.user.firstname)
  const lastname = useSelector(state => state.authentication.user.lastname)
  const products = useSelector(state => state.product.products)
  const selectedProduct = useSelector(state => state.product.selectedProduct)

  // State
  const [checked, setChecked] = useState(props.status.toLowerCase() == "open" ? false : true)
  const [members, setMembers] = useState([])
  const [assigneeIndex, setAssigneeIndex] = useState(0)

  // Constructor
  useEffect(() => {
    const init = async () => {
      // Get members and set the assignee index
      await getMembers()
      await setNewAssigneeIndex()
    }
    init()
  }, [])

  // If the assignee changed then update the assignee index
  useEffect(() => {
    if(props.assignee !== prevProps.current.assignee) {
       setNewAssigneeIndex()
    }
  })

  // If members change then update the assignee index
  useEffect(() => {
    setNewAssigneeIndex()
  }, [members])

  // Get members from the database
  const getMembers = async () => {
    // Get the members list
    let membersDoc = await GetDocument(firebase, "products/" + products[selectedProduct].id + "/members/members")

    // Map the members into the correct format (object)
    let _members = membersDoc.list.map((member) => {
      return {uid: Object.keys(member)[0], 
              firstname: Object.values(member)[0].firstname, 
              lastname: Object.values(member)[0].lastname,
              profilePicture: Object.values(member)[0].profilePicture ,
              name: Object.values(member)[0].firstname + " " + Object.values(member)[0].lastname
             }
    })

    // Update state
    await setMembers(_members)
  }

  // Update the assignee index
  const setNewAssigneeIndex = async () => {
    // Initial index is 0
    let index = 0
    // Loop over all members and check if the assignee id is equal to the member it
    // Set index equal i+1 (as the select isnt 0-indexed)
    for (var i = 0; i < members.length; i++) {
      if(props.assignee && (members[i].uid == props.assignee.uid)) {
        index = i+1
      }
    }
    // Update state
    await setAssigneeIndex(index)
  }

  // Update the task status in the database
  const updateTaskStatus = () => {
    const data = {
      status: !checked ? "CLOSED" : "OPEN",
      lastUpdateTimestamp: firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
      lastEditer: {
        firstname: firstname,
        lastname: lastname,
        uid: uid,

      }
    }

    return UpdateDocument(firebase, "products/" + products[selectedProduct].id + "/stories/" + props.issueId + "/tasks/" + props.taskId, data)
  }

  const handleCheckboxChange = async (e) => {
    setChecked(!checked)

    this.updateTaskStatus().catch((err) => {
      setChecked(!checked)
    })
  }

  const handleSelectChange = (e) => {
     // if the target is 0, then it's the palceholder so set the assignee to null
     if(e.target.value == 0) {
       updateTaskAssignee(null)
     // else get the members info from the members list and update the state
     } else {
      updateTaskAssignee({
        firstname: members[e.target.value-1].firstname,
        lastname: members[e.target.value-1].lastname,
        uid: members[e.target.value-1].uid,
        profilePicture: members[e.target.value-1].profilePicture ? members[e.target.value-1].profilePicture : null
      })
     }
  }

  // Update assignee in the database
  const updateTaskAssignee = (assignee) => {
    return UpdateDocument(firebase, "products/" + products[selectedProduct].id + "/stories/" + props.issueId + "/tasks/" + props.taskId, {assignee: assignee})
  }

  return(
    <TaskWrapper>
      {
        props.issueStatus.toLowerCase() === "open"
        ?
          <CheckBoxLabel><Checkbox checked={checked} onChange={handleCheckboxChange} /></CheckBoxLabel>
        :
          null
      }
      <TaskInfo>
        <TaskHeader>
          <TaskTitle>
            {props.title}
          </TaskTitle>
          <div>
            {props.description}
          </div>
        </TaskHeader>
        <TaskAssignation>
          <Select list={members} value={assigneeIndex} onChange={handleSelectChange} keyName={"uid"} textName={"name"} />
        </TaskAssignation>
      </TaskInfo>
    </TaskWrapper>
  )
}

Task.propTypes = {
  issueStatus: PropTypes.string.isRequired,
  issueId: PropTypes.string.isRequired,
  taskId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  status: PropTypes.string.isRequired,
  assignee: PropTypes.object.isRequired,
}

export { Task }; 