import React from 'react';

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

export default class Body extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {

    }

    this.getPrettyCreationDate = this.getPrettyCreationDate.bind(this)
  }

  async componentDidMount() {

  }

  getPrettyCreationDate(date) {
    let deltaTime = ((new Date()).getTime() - date.getTime())
    // less than 1 second
    if(deltaTime < 1000) {
      return "less than 1 second"
    // less than 1 minute ago
    } else if(deltaTime < 60000) {
      return Math.floor(deltaTime/1000) + " seconds ago"
    // less than 1 hour ago
    } else if(deltaTime < 3600000) {
      return Math.floor(deltaTime/60000) + " minutes ago"
    // less than 1 day
    } else if(deltaTime < 86400000) {
      return Math.floor(deltaTime/3600000) + " hours ago"
    // less than 1 week ago
    } else if(deltaTime < 604800000) {
      return Math.floor(deltaTime/86400000) + " days ago"
    // less than 1 month ago
    } else if(deltaTime < 2628000000) {
      return Math.floor(deltaTime/604800000) + " weeks ago"
    // less than 1 year ago
    } else if(deltaTime < 31540000000) {
      return Math.floor(deltaTime/2628000000) + " months ago"
    // more than a year ago
    } else {
      return Math.floor(deltaTime/31540000000) + " years ago"
    }
  }

  render () {
    return(
      <Issue>
        <IssueContent>
          <Header>
            <Left>
              <Status status={this.props.status}>{this.props.status}</Status>
              <span>Edited {this.getPrettyCreationDate(this.props.editedTimestamp)} by </span> 
              <b>{this.props.lastEditer ? this.props.lastEditer.firstname + " " + this.props.lastEditer.lastname : ""}</b>
            </Left>
            <Right>
              <Button backgroundColor={"#fc9403"} borderColor={"#de7e00"} onClick={(e) => this.props.issueStatusChange()}>
                {this.props.status.toLowerCase() == "open" ? "Close" : "Reopen"}
              </Button>
              <Button backgroundColor={"#1aaa55"} borderColor={"#168f48"} onClick={(e) => this.props.showNewIssueModal()}>
                New Issue
              </Button>
            </Right>
          </Header>
          <InfoBody>
            <TitleWrapper>
              { this.props.editingIssue 
                ? 
                  <TitleEdit value={this.props.title} onChange={(e) => this.props.onChangeTitle()} /> 
                : 
                  <Title>{this.props.title}</Title>
              }
              {
                this.props.status.toLowerCase() == "open" 
                ? 
                  this.props.editingIssue 
                  ? 
                    <EditButton>
                      <Button onClick={(e) => this.props.saveEdit()} backgroundColor={"#1f78d1"} borderColor={"#16528e"}>
                        Save
                      </Button> 
                      <Button onClick={(e) => this.props.discardEdit()} backgroundColor={"#dc0011"} borderColor={"#b0000e"}>
                        Discard
                      </Button>
                    </EditButton> 
                  : 
                    <Edit onClick={(e) => this.props.changeToEditMode()} size="1em" /> 
                : 
                  null
              }
            </TitleWrapper>
            {
              this.props.editingIssue 
              ?
                <DescriptionEdit value={this.props.description} onChange={this.props.onChangeDescription} />
              :
              <Description>
                {this.props.description}
              </Description>
            }
          </InfoBody>
          <TasksWrapper>
            <TasksHeader>
              <h2>Tasks</h2>
              {
                this.props.status.toLowerCase() === "open"
                ?
                  <Button backgroundColor={"#1aaa55"} borderColor={"#168f48"} onClick={() => this.props.showNewTaskModal()}>New Task</Button>
                :
                  null
              }
            </TasksHeader>
            <Tasks>
              {
                this.props.tasks && this.props.tasks.map((task, index) => 
                                                          <Task issueStatus={this.props.status} 
                                                                key={task.id} 
                                                                issueId={this.props.issueId} 
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
}