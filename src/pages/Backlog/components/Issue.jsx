import React from 'react';

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
`

const Right = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-end;
`

const Title = styled.span`

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
`

export default class Issue extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      taskVisible: false
    }

    this.showTasks = this.showTasks.bind(this)
  }

  componentDidMount() {

  }

  showTasks() {
    this.setState({taskVisible: !this.state.taskVisible})
  }

  render () {
    return (
      <Wrapper>
        <Card>
          <IssueInfo>
            <Left>
              <div>
                <Title>{this.props.title}</Title>
              </div>
              <div>
                <Id>#{this.props.id}</Id>
                <span> · </span>
                <Creation>Created {this.props.creationDate} by {this.props.creator}</Creation>
              </div>
            </Left>
            <Right>
              <div>
                <Status>{this.props.status}</Status>
              </div>
              <div>
                <Updated>{this.props.updated}</Updated>
              </div>
            </Right>
          </IssueInfo>
          <TasksOpen onClick={this.showTasks}>
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
          {this.props.tasks && this.props.tasks.map((task, index) => <Task key={index} title={task.title} assigne={task.assigne} />)}
        </Tasks>
      </Wrapper>
    )
  }
}