import React, { useState, useCallback } from 'react';
import { Textfit } from 'react-textfit';


import styled, { keyframes } from 'styled-components';


const keyframe = keyframes`

`

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 100px;
`

const Content = styled.div`
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
`

const Header = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
`

const Story = styled.h2`
  text-align: center;
`

const AverageEstimate = styled.div`
  flex-grow: 1;
  text-align: center;
`

const PeopleList = styled.div`
  width: 100%;
  flex-grow: 1;
  padding: 5px;
  box-sizing: border-box;
  overflow: auto;
`

const PersonCard = styled.div`
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
`

const Name = styled.span`

`

const Estimate = styled.span`

`


export default class RoundResult extends React.PureComponent {

   constructor(props) {
    super(props)

    this.state = {
    };

  }

  componentDidMount() {

  }

  static Person = (props) => (
      <PersonCard>
        <Name>{props.name}</Name>
        <Estimate>{props.estimate}</Estimate>
      </PersonCard>
  );

  render() {
      return (
        <Wrapper>
          <Content>
            <Header>
              <Story>
                {this.props.story}
              </Story>
              <AverageEstimate>
                <Textfit mode="single">
                {this.props.averageEstimate}
                </Textfit>
              </AverageEstimate>
            </Header>
            <PeopleList>
              {this.props.people.length > 0 && this.props.people.map((person, index) => <RoundResult.Person key={index} name={person.name} estimate={person.estimate} />)}
            </PeopleList>
          </Content>
        </Wrapper>
      );
  }
}