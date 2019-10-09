import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from './../../../sharedComponents/Firebase';

import Checkbox from './Checkbox'

import styled from 'styled-components';

const TaskWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const TaskInfo = styled.div`
  flex-grow: 1;
`

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
      checked: this.props.status.toLowerCase() == "open" ? false : true
    }

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    this.updateTaskStatus = this.updateTaskStatus.bind(this)
  }

  componentDidMount() {
    console.log(this.props.issueId)
    console.log(this.props.taskId)
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
                        status: !this.state.checked ? "CLOSED" : "OPEN"
                     })
  }

  handleCheckboxChange(e) {
    this.setState({ checked: !this.state.checked })
    this.updateTaskStatus().then(() => {
    }).catch((err) => {
      this.setState({ checked: !this.state.checked })
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
      </TaskInfo>
    </TaskWrapper>
    )
  }
}

function mapStateToProps(state) {
    const { user } = state.authentication;
    const { products, selectedProduct } = state.product
    return {
        user,
        products,
        selectedProduct
    };
}

const connectedTask = connect(mapStateToProps)(Task);
const firebaseTask = compose(withFirebase)(connectedTask)
export { firebaseTask as Task }; 