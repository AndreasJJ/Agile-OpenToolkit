import React from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../../../sharedComponents/Firebase';

import Task from './Task'

import styled from 'styled-components';
import {AngleDoubleDown} from 'styled-icons/fa-solid/AngleDoubleDown';
import {AngleDoubleUp} from 'styled-icons/fa-solid/AngleDoubleUp';

const Wrapper = styled.div`
  width: 100%;
  min-height: 60px;
`

const IssueInfo = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
`

const Left = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;

  & > div {
    color: ${props => props.skeleton ? "transparent" : null};
    background-color: ${props => props.skeleton ? "lightgray" : null}
  }
`

const Right = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-end;

  & > div {
    color: ${props => props.skeleton ? "transparent" : null};
    background-color: ${props => props.skeleton ? "lightgray" : null}
  }
`

const Title = styled.span`

`

const ReactLink = styled(Link)`
  font-weight: bold;
  text-decoration: none;
  color: ${props => props.skeleton ? "transparent" : "#000000"};
  background-color: ${props => props.skeleton ? "lightgray" : null}

  &:hover {
    text-decoration: underline;
  }
`

const Id = styled.span`

`

const Creation = styled.span`

`

const Updated = styled.span`

`

const Status = styled.span`

`

const Card = styled.div`
  width: 100%;
  height: 60px;
  background-color: #F4F4F4;
  display: flex;
  padding: 5px;
  box-sizing: border-box;
  border-top: 1px solid #e8e8e8;

  &:last-child {
    border-bottom: 1px solid #e8e8e8;
  }
`

const Tasks = styled.div`
  padding-left: 50px;
  display: ${props => props.displaying ? "block" : "none"};
  max-height: 243px;
  overflow: auto;
`

const TasksOpen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  pointer-events: ${props => props.skeleton ? "none" : null};
`

class Issue extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      taskVisible: false,
      tasks: [],
      loadedTasks: false
    }

    this.getTasks = this.getTasks.bind(this)
    this.showTasks = this.showTasks.bind(this)
  }

  async getTasks() {
    let querySnapshot = await this.props.firebase
                      .db.collection("products")
                      .doc(this.props.productId)
                      .collection("stories")
                      .doc(this.props.issueId)
                      .collection("tasks")
                      .orderBy("title")
                      .get()
    return querySnapshot.docs.map((doc) => doc.data())
  }

  async showTasks() {
    if(!this.state.loadedTasks) {
      let tasks = await this.getTasks()
      this.setState({taskVisible: true, tasks: tasks, loadedTasks: true})
    } else {
      this.setState({taskVisible: !this.state.taskVisible})
    }
  }

  render () {
    return (
      <Wrapper>
        <Card>
          <IssueInfo>
            <Left skeleton={this.props.skeleton}>
              <div>
                <ReactLink skeleton={this.props.skeleton} to={"/backlog/issue/" + this.props.issueId}>
                  {this.props.title}
                </ReactLink>
              </div>
              <div>
                <Id>#{this.props.number}</Id>
                <span> · </span>
                <Creation>Created {this.props.creationDate} by {this.props.creator}</Creation>
              </div>
            </Left>
            <Right skeleton={this.props.skeleton}>
              <div>
                <Status>{this.props.status}</Status>
              </div>
              <div>
                <Updated>{this.props.updated}</Updated>
              </div>
            </Right>
          </IssueInfo>
          <TasksOpen skeleton={this.props.skeleton} onClick={this.showTasks}>
            {
              this.state.taskVisible
              ?
                <AngleDoubleUp size="2em" />
              :
                <AngleDoubleDown size="2em" />
            }    
          </TasksOpen>
        </Card>
        <Tasks displaying={this.state.taskVisible}>
          {
            this.state.tasks && this.state.tasks.map((task, index) => 
                                                      <Task key={index} title={task.title} assigne={task.assignee} status={task.status} />
                                                    )
          }
        </Tasks>
      </Wrapper>
    )
  }
}

const firebaseIssue = compose(withFirebase)(Issue)
export { firebaseIssue as Issue };