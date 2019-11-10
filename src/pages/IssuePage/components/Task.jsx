import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { compose } from 'recompose';
import { withFirebase } from './../../../sharedComponents/Firebase';
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
`

const TaskTitle = styled.h3`
  font-size: 1.17em;
  margin-block-start: 0em;
  margin-block-end: 0em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
`

const TaskAssignee = styled.span`

`

const TaskDescription = styled.div`

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

class Task extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      checked: this.props.status.toLowerCase() == "open" ? false : true,
      members: [],
      assigneeIndex: 0
    }

    this.getMembers = this.getMembers.bind(this)
    this.setAssigneeIndex = this.setAssigneeIndex.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    this.updateTaskStatus = this.updateTaskStatus.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.updateTaskAssignee = this.updateTaskAssignee.bind(this)
  }

  async componentDidMount() {
    await this.getMembers()
    await this.setAssigneeIndex()
  }

  async componentDidUpdate(prevProps, prevState) {
    if(this.props.assignee !== prevProps.assignee) {
       await this.setAssigneeIndex()
    }
  }

  async getMembers() {
    let docSnapshot = await this.props.firebase
                                      .db.collection("products")
                                      .doc(this.props.products[this.props.selectedProduct].id)
                                      .collection("members")
                                      .doc("members")
                                      .get()
    let members = docSnapshot.data().list.map((member) => {
      return {uid: Object.keys(member)[0], 
              firstname: Object.values(member)[0].firstname, 
              lastname: Object.values(member)[0].lastname,
              profilePicture: Object.values(member)[0].profilePicture ,
              name: Object.values(member)[0].firstname + " " + Object.values(member)[0].lastname
             }
    })
    await this.setState({members: members})
  }

  async setAssigneeIndex() {
    let index = 0
    for (var i = 0; i < this.state.members.length; i++) {
      if(this.props.assignee && (this.state.members[i].uid == this.props.assignee.uid)) {
        index = i+1
      }
    }
    await this.setState({assigneeIndex: index})
  }

  updateTaskStatus() {
    return this.props.firebase
                     .db.collection("products")
                     .doc(this.props.products[this.props.selectedProduct].id)
                     .collection("stories")
                     .doc(this.props.issueId)
                     .collection("tasks")
                     .doc(this.props.taskId)
                     .update({
                        status: !this.state.checked ? "CLOSED" : "OPEN",
                        lastUpdateTimestamp: this.props.firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
                        lastEditer: {
                          firstname: this.props.firstname,
                          lastname: this.props.lastname,
                          uid: this.props.uid,

                        }
                     })
  }

  handleCheckboxChange(e) {
    this.setState({ checked: !this.state.checked })
    this.updateTaskStatus().then(() => {
    }).catch((err) => {
      this.setState({ checked: !this.state.checked })
    })
  }

  handleSelectChange(e) {
     if(e.target.value == 0) {
       this.updateTaskAssignee(null)
     } else {
      this.updateTaskAssignee({
        firstname: this.state.members[e.target.value-1].firstname,
        lastname: this.state.members[e.target.value-1].lastname,
        uid: this.state.members[e.target.value-1].uid,
        profilePicture: this.state.members[e.target.value-1].profilePicture ? this.state.members[e.target.value-1].profilePicture : null
      })
     }
  }

  updateTaskAssignee(assignee) {
    return this.props.firebase
                     .db.collection("products")
                     .doc(this.props.products[this.props.selectedProduct].id)
                     .collection("stories")
                     .doc(this.props.issueId)
                     .collection("tasks")
                     .doc(this.props.taskId)
                     .update({
                       assignee: assignee
                     })
  }

  render () {
    return(
    <TaskWrapper>
      {
        this.props.issueStatus.toLowerCase() === "open"
        ?
          <CheckBoxLabel><Checkbox checked={this.state.checked} onChange={this.handleCheckboxChange} /></CheckBoxLabel>
        :
          null
      }
      <TaskInfo>
        <TaskHeader>
          <TaskTitle>
            {this.props.title}
          </TaskTitle>
          <TaskAssignee>
            {this.props.assignee ? "Assigned: " + this.props.assignee.firstname.charAt(0).toUpperCase() + this.props.assignee.firstname.slice(1) + " " + this.props.assignee.lastname : ""}
          </TaskAssignee>
        </TaskHeader>
        <TaskDescription>
          {this.props.description}
        </TaskDescription>
        <TaskAssignation>
          <Select list={this.state.members} value={this.state.assigneeIndex} onChange={this.handleSelectChange} keyName={"uid"} textName={"name"} />
        </TaskAssignation>
      </TaskInfo>
    </TaskWrapper>
    )
  }
}

Task.propTypes = {
  issueStatus: PropTypes.string.isRequired,
  issueId: PropTypes.string.isRequired,
  taskId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  status: PropTypes.string.isRequired,
  assignee: PropTypes.object.isRequired,
  uid: PropTypes.string.isRequired,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
  selectedProduct: PropTypes.string.isRequired
}

function mapStateToProps(state) {
    const { uid, firstname, lastname } = state.authentication.user;
    const { products, selectedProduct } = state.product
    return {
        uid,
        firstname,
        lastname,
        products,
        selectedProduct
    };
}

const connectedTask = connect(mapStateToProps)(Task);
const firebaseTask = compose(withFirebase)(connectedTask)
export { firebaseTask as Task }; 