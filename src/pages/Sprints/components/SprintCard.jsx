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

`

const ReactLink = styled(Link)`
  font-weight: bold;
  color: #000000;
  text-decoration: none;

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
`

export default class CreateIssue extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    }

  }

  componentDidMount() {

  }


  render () {
    return (
      <Wrapper>
        <Left>
          <ReactLink to={"/sprints/" + this.props.sprintId}>{this.props.title}</ReactLink>
          <Dates>
            {this.props.startDate} / {this.props.dueDate}
          </Dates>
        </Left>
        <ProgressWrapper>
          <ProgressBar max={100} value={(this.props.finishedIssues / this.props.totalIssues)*100}>{(this.props.finishedIssues / this.props.totalIssues)*100}</ProgressBar>
          <ProgressInfo>
            <span>
              {this.props.totalIssues} Issues
            </span>
            <span>
              {(this.props.finishedIssues / this.props.totalIssues)*100}%
            </span>
          </ProgressInfo>
        </ProgressWrapper>
      </Wrapper>
    )
  }
}