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

const LabelCard = (props) => {
  const {skeleton, bgc, name, description, subscribed, 
         unsubscribe, subscribe, deleteLabel} = props
  return (
    <Wrapper>
      <NameWrapper>
        <Name skeleton={skeleton} bgc={bgc}>
          {name}
        </Name>
      </NameWrapper>
      <Description>
        {description}
      </Description>
      <ControlsWrapper>
        <SubscribeButton subscribed={subscribed} 
                         onClick={(e) => subscribed ? unsubscribe(name) : subscribe(name)}
        >
          {subscribed ? "Unsubscribe" : "Subscribe"}
        </SubscribeButton>
        <DeleteButton onClick={(e) => deleteLabel(name)}>Delete</DeleteButton>
      </ControlsWrapper>
    </Wrapper>
  )
}

export default LabelCard