import React from 'react';

import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 60px;
  background-color: #F4F4F4;
  display: flex;
  padding: 5px;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e8e8e8;

  &:last-child {
    border-bottom: 1px solid #e8e8e8;
  }
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

const Tasks = styled.div`

`

export default class Issue extends React.Component {
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
      </Wrapper>
    )
  }
}