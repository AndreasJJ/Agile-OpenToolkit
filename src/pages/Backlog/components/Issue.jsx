import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import {FirebaseContext, GetDocuments} from '../../../sharedComponents/Firebase';

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
    background-color: ${props => props.skeleton ? "lightgray" : null};
  }
`

const MetaInfo = styled.div`
  @media only screen and (max-width: 800px) {
    display: none;
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
    background-color: ${props => props.skeleton ? "lightgray" : null};
  }
`

const Title = styled.span`

`

const ReactLink = styled(Link)`
  font-weight: bold;
  text-decoration: none;
  color: ${props => props.skeleton ? "transparent" : "#000000"};
  background-color: ${props => props.skeleton ? "lightgray" : null};

  &:hover {
    text-decoration: underline;
  }
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
  min-width: 50px;
  pointer-events: ${props => props.skeleton ? "none" : null};
`

const Issue = (props) => {
  // Firebase
  const firebase = useContext(FirebaseContext)

  // State
  const [taskVisible, setTaskVisible] = useState(false)
  const [tasks, setTasks] = useState([])
  const [loadedTasks, setLoadedTasks] = useState(false)

  // Get tasks and update state
  const showTasks = async () => {
    if(!loadedTasks) {
      // Get tasks
      let tasks = await GetDocuments(firebase, "products/" + props.productId + "/stories/" + props.issueId + "/tasks", null, [["title"]])
      // Update state
      setTasks(tasks)
      setLoadedTasks(true)
      setTaskVisible(true)
    } else {
      // Change visibility
      setTaskVisible(!taskVisible)
    }
  }

  return (
    <Wrapper>
      <Card>
        <IssueInfo>
          <Left skeleton={props.skeleton}>
            <div>
              <ReactLink skeleton={props.skeleton} to={"/backlog/issue/" + props.issueId}>
                {props.title}
              </ReactLink>
            </div>
            <MetaInfo>
              <span>#{props.number}</span>
              <span> · </span>
              <span>Created {props.creationDate} by {props.creator}</span>
            </MetaInfo>
          </Left>
          <Right skeleton={props.skeleton}>
            <div>
              <span>{props.status}</span>
            </div>
            <MetaInfo>
              <span>{props.updated}</span>
            </MetaInfo>
          </Right>
        </IssueInfo>
        <TasksOpen skeleton={props.skeleton} onClick={showTasks}>
          {
            taskVisible
            ?
              <AngleDoubleUp size="2em" />
            :
              <AngleDoubleDown size="2em" />
          }    
        </TasksOpen>
      </Card>
      <Tasks displaying={taskVisible}>
        {
          tasks && 
          tasks.map((task, index) => 
                      <Task key={index} 
                            title={task.title}
                            assigne={task.assignee} 
                            status={task.status} />
                    )
        }
      </Tasks>
    </Wrapper>
  )
}

Issue.defaultProps = {
  productId: "",
  issueId: ""
}

Issue.propTypes = {
  skeleton: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  creationDate: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  updated: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
  issueId: PropTypes.string.isRequired
}

export { Issue };