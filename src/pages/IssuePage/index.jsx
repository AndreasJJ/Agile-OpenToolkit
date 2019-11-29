import React, {useState, useEffect, useContext, useRef} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { FirebaseContext, ListenToDocuments, ListenToDocument, GetDocument, GetDocuments, UpdateDocument } from '../../sharedComponents/Firebase';

import SideBar from './components/Sidebar';
import { Body } from './components/Body';

import { getPrettyCreationDate, FsTsToDate } from '../../sharedComponents/Utility';
import Modal from '../../sharedComponents/Modal';
import { CreateIssue } from '../../sharedComponents/CreateIssue';
import { CreateTask } from './components/CreateTask';

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: calc(100% - 200px) 200px;
  grid-template-rows: 100%;

  @media only screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
`;


const IssuePage = (props) => {
  const firebase = useContext(FirebaseContext)

  const {id} = useParams()
  const history = useHistory()

  const prevId = useRef(id)

  const uid = useSelector(state => state.authentication.user.uid)
  const firstname = useSelector(state => state.authentication.user.firstname)
  const lastname = useSelector(state => state.authentication.user.lastname)
  const products = useSelector(state => state.product.products)
  const selectedProduct = useSelector(state => state.product.selectedProduct)

  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [status, setStatus] = useState("OPEN")
  const [creationTimestamp, setCreationTimestamp] = useState(new Date())
  const [editedTimestamp, setEditedTimestamp] = useState(new Date())
  const [creator, setCreator] = useState("")
  const [lastEditer, setLastEditer] = useState({})
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tasks, setTasks] = useState([])
  const [sprints, setSprints] = useState([])
  const [sprint, setSprint] = useState("")
  const [dueDate, setDueDate] = useState(null)
  const [estimate, setEstimate] = useState(null)
  const [labels, setLabels] = useState([])
  const [selectedLabels, setSelectedLabels] = useState([])
  const [editingIssue, setEditingIssue] = useState(false)
  const [originalTitle, setOriginalTitle] = useState("")
  const [originalDescription, setOriginalDescription] = useState("")

  let DataListener;
  let TasksListener;

  useEffect(() => {
    const init = async () => {
      await getData()
      await getTasks()
      await getAllLables()
      await getAllSprints()
      props.finishLoading()
    }
    init()

    return () => {
      DataListener()
      TasksListener()
    }
  }, [])

  useEffect(() => {
    if(prevId.current !== id) {
      setShowModal(false)
      setStatus("OPEN")
      setCreationTimestamp(new Date())
      setEditedTimestamp(new Date())
      setCreator("")
      setLastEditer("")
      setTitle("")
      setDescription("")
      setTasks([])
      setSprints([])
      setSprint("")
      setDueDate(new Date())
      setEstimate(null)
      setLabels([])
      setSelectedLabels([])
      setEditingIssue(false)
      setOriginalTitle("")
      setOriginalDescription("")

      getData()
      getTasks()
      getAllLables()
      getAllSprints()
      props.finishLoading()

      prevId.current = id
    }
  })

  const getData = async () => {
    const onSnapshot = (doc) => {
      let issue = doc.data()
      issue.creationTimestamp = issue.creationTimestamp == null ? new Date() : FsTsToDate(issue.timestamp)
      issue.lastUpdateTimestamp = issue.lastUpdateTimestamp == null ? new Date() : FsTsToDate(issue.lastUpdateTimestamp)
      issue.dueDate = issue.dueDate == null ? null : FsTsToDate(issue.dueDate)
      let tempArray = []
      for (const [key, value] of Object.entries(issue.labels)) {
        tempArray.push([key, value])
      }
      issue.labels = tempArray

      setStatus(issue.status)
      setCreationTimestamp(issue.timestamp)
      setEditedTimestamp(issue.lastUpdateTimestamp)
      setCreator(issue.creator)
      setLastEditer(issue.lastEditer)
      setTitle(issue.title)
      setDescription(issue.description)
      setOriginalTitle(issue.title)
      setOriginalDescription(issue.description)
      setSprint(issue.sprint)
      setSelectedLabels(issue.labels)
      setDueDate(issue.dueDate)
      setEstimate(issue.estimate)
    }
    DataListener = await ListenToDocument(firebase, onSnapshot, "products/" + products[selectedProduct].id + "/stories/" + id)
  }

  const getTasks = async () => {
    const onSnapshot = (querySnapshot) => {
      let tempArray = querySnapshot.docs
                                   .map((doc) => {
                                      let obj = doc.data()
                                      obj.id = doc.id
                                      return obj
                                    })
      setTasks(tempArray)
    }
    TasksListener = await ListenToDocuments(firebase, onSnapshot, "products/" + products[selectedProduct].id + "/stories/" + id + "/tasks", null, [["title"]])
  }

  const getAllLables = async () => {
    let list = await GetDocument(firebase, "products/" + products[selectedProduct].id + "/labels/list")

    if(list) {
      let tempArray = []
      for (const [key, value] of Object.entries(list.list)) {
        tempArray.push([key, value])
      }
      setLabels(tempArray)
    } else {
      setLabels([])
    }
  }

  const getAllSprints = async () => {
    let sprints = await GetDocuments(firebase, "products/" + products[selectedProduct].id + "/sprints", [['dueDate','>',new Date()]])

    setSprints(sprints)
  }

  const showNewIssueModal = () => {
    setShowModal(true)
    setModalContent("CreateIssue")
  }

  const showNewTaskModal = () => {
    setShowModal(true)
    setModalContent("CreateTask")
  }
  
  const changeToEditMode = () => {
    setEditingIssue(true)
  }

  const saveEdit = () => {
    if(title == originalTitle && description == originalDescription) 
    {
      setEditingIssue(false)
      return
    }

    let data = {
      title: title,
      description: description,
      lastUpdateTimestamp: firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
      lastEditer: {
        uid: uid,
        firstname: firstname,
        lastname: lastname
      }
    }

    let success = () => {
      setEditingIssue(false)
    }

    let failure = () => {
      setEditingIssue(false)
      setTitle(originalTitle)
      setDescription(originalDescription)
    }

    UpdateDocument(firebase, "products/" + products[selectedProduct].id + "/stories/" + id, data, success, failure)
  }

  const updateSprint = (sprintId) => {
    let data = {
      sprint: sprintId,
      lastUpdateTimestamp: props.firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
      lastEditer: {
        uid: uid,
        firstname: firstname,
        lastname: lastname
      }
    }

    UpdateDocument(firebase, "products/" + products[selectedProduct].id + "/stories/" + id, data)
  }

  const updateDueDate = (dueDate) => {
    let data = {
      dueDate: new Date(dueDate),
      lastUpdateTimestamp: firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
      lastEditer: {
        uid: this.props.uid,
        firstname: firstname,
        lastname: lastname
      }
    }

    UpdateDocument(firebase, "products/" + products[selectedProduct].id + "/stories/" + id, data)
  }

  const updateLabels = (labels) => {
    let data = {
      labels: labels,
      lastUpdateTimestamp: props.firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
      lastEditer: {
        uid: uid,
        firstname: firstname,
        lastname: lastname
      }
    }

    UpdateDocument(firebase, "products/" + products[selectedProduct].id + "/stories/" + id, data)
  }

  const updateEstimate = (estimate) => {
    let data = {
      estimate: estimate,
      lastUpdateTimestamp: props.firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
      lastEditer: {
        uid: uid,
        firstname: firstname,
        lastname: lastname
      }
    }

    UpdateDocument(firebase, "products/" + products[selectedProduct].id + "/stories/" + id, data)
  }

  const discardEdit = () => {
    setEditingIssue(false)
    setTitle(originalTitle)
    setDescription(originalDescription)
  }

  const onChangeTitle = (e) => {
    setTitle(e.target.value)
  }

  const onChangeDescription = (e) => {
    setDescription(e.target.value)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const goToCreatedIssue = (issueId) => {
    history.push('/backlog/issue/'+issueId)
  }

  let _modalContent;
  if(modalContent == "CreateIssue") {
    _modalContent = <CreateIssue exit={closeModal} finished={goToCreatedIssue} />
  } else if (modalContent == "CreateTask") {
    _modalContent = <CreateTask exit={closeModal} issueId={id} />
  }

  return (
    <Wrapper>
      {
        showModal
        ?
          <Modal content={_modalContent} 
                 minWidth={"500px"} 
                 exitModalCallback={closeModal} 
          />
        :
          null
      }
      <Body
        status={status}
        editedTimestamp={editedTimestamp}
        lastEditer={lastEditer}
        editingIssue={editingIssue}
        title={title}
        description={description}
        issueId={id}
        productId={products[selectedProduct].id}
        tasks={tasks}
        showNewIssueModal={showNewIssueModal}
        showNewTaskModal={showNewTaskModal}
        onChangeTitle={onChangeTitle}
        saveEdit={saveEdit}
        discardEdit={discardEdit}
        changeToEditMode={changeToEditMode}
        onChangeDescription={onChangeDescription}
        uid={uid}
        firstname={firstname}
        lastname={lastname}
      />
      <SideBar status={status} 
               sprints={sprints} 
               selectedSprint={sprint} 
               dueDate={dueDate}
               estimate={estimate}
               labels={labels} 
               selectedLabels={selectedLabels} 
               updateSprint={updateSprint} 
               updateDueDate={updateDueDate} 
               updateLabels={updateLabels}
               updateEstimate={updateEstimate}
      />
    </Wrapper>
  );
}

IssuePage.propTypes = {
  finishLoading: PropTypes.func.isRequired,
}

export { IssuePage };