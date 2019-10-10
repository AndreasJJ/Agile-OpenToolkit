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

        </ControlsWrapper>
      </Wrapper>
    )
  }
}