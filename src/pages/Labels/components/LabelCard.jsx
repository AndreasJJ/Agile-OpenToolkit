import React from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';

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

const Name = styled.span`
  padding: 4px 8px;
  line-height: 16px;
  border-radius: ${props => props.skeleton ? "0px" : "100px"};
  text-align: center;
  white-space: nowrap;
  color: ${props => props.skeleton ? "transparent" : "#ffffff" };
  background-color: ${props => props.skeleton ? "lightgray" : props.bgc};

  @media only screen and (max-width: 800px) {
    display: flex;
    white-space: normal;
  }
`

const Description = styled.div`
  flex: 1;
  margin: 0px 10px;
  overflow: hidden;
  text-overflow: ellipsis;

  @media only screen and (max-width: 800px) {
    display: none;
  }
`

const ControlsWrapper = styled.div`
  @media only screen and (max-width: 800px) {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  }
`

const DeleteButton = styled.button`
  width: 88px;
  height: 35px;
  background-color: #ff6961;
  border-color: #bf4f49;
  color: #ffffff;
  border-radius: 3px;
  margin: 0px 5px;

  @media only screen and (max-width: 800px) {
    margin: 5px;
  }
`

const SubscribeButton = styled.button`
  width: 88px;
  height: 35px;
  background-color: ${props => props.subscribed ? "#fc9403" : "#1f78d1"};
  border-color: ${props => props.subscribed ? "#de7e00" : "#185b9e"};
  color: #ffffff;
  border-radius: 3px;
  margin: 0px 5px;

  @media only screen and (max-width: 800px) {
    margin: 5px;
  }
`

const LabelCard = (props) => {
  const {skeleton, bgc, name, description, subscribed, 
         unsubscribe, subscribe, deleteLabel} = props
  return (
    <Wrapper>
      <div>
        <Name skeleton={skeleton} bgc={bgc}>
          {name}
        </Name>
      </div>
      <Description>
        {description}
      </Description>
      <ControlsWrapper>
        {
          skeleton
          ?
            null
          :
            <SubscribeButton subscribed={subscribed} 
            onClick={(e) => subscribed ? unsubscribe(name) : subscribe(name)}
            >
              {subscribed ? "Unsubscribe" : "Subscribe"}
            </SubscribeButton>
        }
        {
          skeleton
          ?
            null
          :
            <DeleteButton onClick={(e) => deleteLabel(name)}>Delete</DeleteButton>
        }
      </ControlsWrapper>
    </Wrapper>
  )
}

LabelCard.proptypes = {
  skeleton: PropTypes.bool.isRequired,
  bgc: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  subscribed: PropTypes.bool.isRequired, 
  unsubscribe: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
  deleteLabel: PropTypes.func.isRequired
}

export default LabelCard