import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { compose } from 'recompose';
import { withFirebase } from '../../../sharedComponents/Firebase';

import { getPrettyCreationDate } from '../../../sharedComponents/Utility'

import styled from 'styled-components';

import { Task } from './Task';

import { EditAlt } from 'styled-icons/boxicons-regular/EditAlt';

const Issue = styled.div`
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 50px;
  box-sizing: border-box
`

const IssueContent = styled.div`
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  padding: 10px 5px 10px 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e8e8e8;
`

const Left = styled.div`

`

const Right = styled.div`

`

const Button = styled.button`
  background-color: ${props => props.backgroundColor};
  border: 1px solid ${props => props.borderColor};
  padding: 6px 10px 6px 10px;
  color: #ffffff;
  border-radius: 3px;
  margin-left: 5px;
`

const EditButton = styled.div`
  display: flex;
  flex-direction: row;
`

const Status = styled.div`
  background-color: ${props => props.status === "Open" ? "#1aaa55" : "#1f78d1"};
  display: inline-block;
  height: auto;
  align-self: center;
  padding: 4px;
  border-radius: 3px;
  margin-right: 10px;
  color: white;
`

const InfoBody = styled.div`
  padding: 0px 5px 0px 5px;
  border-bottom: 1px solid #e8e8e8;
`

const TitleWrapper = styled.div`
  margin-top: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Title = styled.h2`
  margin-block-start: 0em;
  margin-block-end: 0em;
`

const TitleEdit = styled.input`
  width: 100%;
`

const Edit = styled(EditAlt)`
  padding: 5px;
  border: 1px solid #e8e8e8;
  border-radius: 3px;
`

const Description = styled.div`
  margin-bottom: 5px;
  margin-top: 5px;
`

const DescriptionEdit = styled.textarea`
  margin-bottom: 5px;
  margin-top: 5px;
  resize: none;
  width: 100%;
  min-height: 80px;
`

const TasksWrapper = styled.div`
  min-height: 100px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #e8e8e8;
`

const Tasks = styled.div`
  overflow: scroll;
`

const TasksHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Comment = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  flex-grow: 1;
`

const TextArea = styled.textarea`
  resize: none;
  width: 100%;
  min-height: 140px;
  flex-grow: 1;
`

const SubmitButton = styled.button`
  padding: 6px 10px 6px 10px;
  color: #ffffff;
  border-radius: 3px;
  background-color: #1aaa55;
  margin-top: 5px;
  width: fit-content;
`

const Body = (props) => {
  const {status, editedTimestamp, lastEditer, 
         showNewIssueModal, showNewTaskModal, editingIssue, title, onChangeTitle, 
         saveEdit, discardEdit, changeToEditMode, description,
         issueId, productId, onChangeDescription, tasks,
         uid, firstname, lastname} = props

  const issueStatusChange = () => {
    props.firebase
              .db
              .collection("products")
              .doc(productId)
              .collection("stories")
              .doc(issueId)
              .update({
                status: status.toLowerCase() == "open" ? "CLOSED" : "OPEN",
                lastUpdateTimestamp: props.firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
                lastEditer: {
                  uid: uid,
                  firstname: firstname,
                  lastname: lastname
                }
              })
  }

  return(
    <Issue>
      <IssueContent>
        <Header>
          <Left>
            <Status status={status}>{status}</Status>
            <span>Edited {getPrettyCreationDate(props.editedTimestamp)} by </span> 
            <b>{lastEditer ? lastEditer.firstname + " " + lastEditer.lastname : ""}</b>
          </Left>
          <Right>
            <Button backgroundColor={"#fc9403"} borderColor={"#de7e00"} onClick={(e) => issueStatusChange()}>
              {status.toLowerCase() == "open" ? "Close" : "Reopen"}
            </Button>
            <Button backgroundColor={"#1aaa55"} borderColor={"#168f48"} onClick={(e) => showNewIssueModal()}>
              New Issue
            </Button>
          </Right>
        </Header>
        <InfoBody>
          <TitleWrapper>
            { editingIssue 
              ? 
                <TitleEdit value={title} onChange={(e) => onChangeTitle()} /> 
              : 
                <Title>{title}</Title>
            }
            {
              status.toLowerCase() == "open" 
              ? 
                editingIssue 
                ? 
                  <EditButton>
                    <Button onClick={(e) => saveEdit()} backgroundColor={"#1f78d1"} borderColor={"#16528e"}>
                      Save
                    </Button> 
                    <Button onClick={(e) => discardEdit()} backgroundColor={"#dc0011"} borderColor={"#b0000e"}>
                      Discard
                    </Button>
                  </EditButton> 
                : 
                  <Edit onClick={(e) => changeToEditMode()} size="1em" /> 
              : 
                null
            }
          </TitleWrapper>
          {
            editingIssue 
            ?
              <DescriptionEdit value={description} onChange={onChangeDescription} />
            :
            <Description>
              {description}
            </Description>
          }
        </InfoBody>
        <TasksWrapper>
          <TasksHeader>
            <h2>Tasks</h2>
            {
              status.toLowerCase() === "open"
              ?
                <Button backgroundColor={"#1aaa55"} borderColor={"#168f48"} onClick={() => showNewTaskModal()}>New Task</Button>
              :
                null
            }
          </TasksHeader>
          <Tasks>
            {
              tasks && tasks.map((task, index) => 
                                  <Task issueStatus={props.status} 
                                        key={task.id} 
                                        issueId={props.issueId} 
                                        taskId={task.id} 
                                        title={task.title} 
                                        description={task.description} 
                                        status={task.status} 
                                        assignee={task.assignee} 
                                  />
                                )
            }
          </Tasks>
        </TasksWrapper>
        <Comment>
          <TextArea />
          <SubmitButton>Comment</SubmitButton>
        </Comment>
      </IssueContent>
    </Issue>
  )
}

Body.propTypes = {
  status: PropTypes.string.isRequired,
  issueId: PropTypes.string.isRequired,
  showNewIssueModal: PropTypes.func.isRequired,
  showNewTaskModal: PropTypes.func.isRequired,
  editingIssue: PropTypes.bool.isRequired, 
  title: PropTypes.string.isRequired, 
  onChangeTitle: PropTypes.func.isRequired, 
  saveEdit: PropTypes.func.isRequired, 
  discardEdit: PropTypes.func.isRequired, 
  changeToEditMode: PropTypes.func.isRequired, 
  description: PropTypes.string.isRequired,
  issueId: PropTypes.string.isRequired, 
  productId: PropTypes.string.isRequired,
  onChangeDescription: PropTypes.func.isRequired,
  tasks: PropTypes.array.isRequired,
  editedTimestamp: PropTypes.object.isRequired,
  lastEditer: PropTypes.object.isRequired, 
  uid: PropTypes.string.isRequired,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired
}

function mapStateToProps(state) {
    const { uid, firstname, lastname } = state.authentication.user;
    return {
      uid,
      firstname,
      lastname
    };
}

const connectedBody = connect(mapStateToProps)(Body);
const firebaseBody = compose(withFirebase)(connectedBody)
export { firebaseBody as Body };