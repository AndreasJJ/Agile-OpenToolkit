import React from 'react';
import { Link } from 'react-router-dom'

import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 80px;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  background-color: #F4F4F4;
  justify-content: space-between;
  align-items: center;

  &:not(:first-child) {
    margin-top: 10px;
  }
`

const Left = styled.div`

  & > div {
    margin-top: 2px;
    color: ${props => props.skeleton ? "transparent" : null};
    background-color: ${props => props.skeleton ? "lightgray" : null}
  }
`

const ReactLink = styled(Link)`
  font-weight: bold;
  text-decoration: none;
  margin-bottom: 2px;
  color: ${props => props.skeleton ? "transparent" : "#000000"};
  background-color: ${props => props.skeleton ? "lightgray" : null}

  &:hover {
    text-decoration: underline;
  }
`

const Dates = styled.div`

`

const ProgressWrapper = styled.div`
  width: 50%;
`

const ProgressBar = styled.progress`
  width: 100%;
`

const ProgressInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  & > span {
    color: ${props => props.skeleton ? "transparent" : null};
    background-color: ${props => props.skeleton ? "lightgray" : null}
  }
`

const CreateIssue = (props) => {
  const {skeleton, sprintId, title, startDate, 
         dueDate, totalIssues, finishedIssues} = props
  return (
    <Wrapper>
      <Left skeleton={skeleton}>
        <ReactLink skeleton={skeleton} to={"/sprints/" + sprintId}>{title}</ReactLink>
        <Dates>
          {startDate} / {dueDate}
        </Dates>
      </Left>
      <ProgressWrapper>
        <ProgressBar max={100} value={totalIssues === 0 ? 100 : (finishedIssues / totalIssues)*100}>{totalIssues === 0 ? 100 : (finishedIssues / totalIssues)*100}</ProgressBar>
        <ProgressInfo skeleton={skeleton}>
          <span>
            {totalIssues} Issues
          </span>
          <span>
            {totalIssues === 0 ? 100 : (finishedIssues / totalIssues)*100}%
          </span>
        </ProgressInfo>
      </ProgressWrapper>
    </Wrapper>
  )
}

export default CreateIssue