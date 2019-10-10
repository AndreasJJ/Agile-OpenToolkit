import React from 'react';
import { Link } from 'react-router-dom'

import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
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

const NameWrapper = styled.div`

`

const Name = styled.span`
  padding: 4px 8px;
  line-height: 16px;
  border-radius: 100px;
  text-align: center;
  white-space: nowrap
  color: ${props => props.skeleton ? "transparent" : "#ffffff" };
  background-color: ${props => props.skeleton ? "lightgray" : props.bgc};
`

const Description = styled.div`
  flex: 1;
  margin: 0px 10px;
  overflow: auto;
`

const ControlsWrapper = styled.div`

`

const DeleteButton = styled.button`
  width: 88px;
  height: 35px;
  background-color: #ff6961;
  border-color: #bf4f49;
  color: #ffffff;
  border-radius: 3px;
  margin: 0px 5px;
`

const SubscribeButton = styled.button`
  width: 88px;
  height: 35px;
  background-color: ${props => props.subscribed ? "#fc9403" : "#1f78d1"};
  border-color: ${props => props.subscribed ? "#de7e00" : "#185b9e"};
  color: #ffffff;
  border-radius: 3px;
  margin: 0px 5px;
`

export default class LabelCard extends React.Component {
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
        <NameWrapper>
          <Name skeleton={this.props.skeleton} bgc={this.props.bgc}>
            {this.props.name}
          </Name>
        </NameWrapper>
        <Description>
          {this.props.description}
        </Description>
        <ControlsWrapper>
          <SubscribeButton subscribed={this.props.subscribed} 
                           onClick={(e) => this.props.subscribed ? this.props.unsubscribe(this.props.name) : this.props.subscribe(this.props.name)}
          >
            {this.props.subscribed ? "Unsubscribe" : "Subscribe"}
          </SubscribeButton>
          <DeleteButton onClick={(e) => this.props.delete(this.props.name)}>Delete</DeleteButton>
        </ControlsWrapper>
      </Wrapper>
    )
  }
}