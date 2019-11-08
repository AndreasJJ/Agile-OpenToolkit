import React from 'react';
import PropTypes from 'prop-types';
import { Textfit } from 'react-textfit';

import PersonCard from './PersonCard';

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

const RoundResult = (props) => {
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
          {this.props.people.length > 0 && this.props.people.map((person, index) => <PersonCard key={index} name={person.name} estimate={person.estimate} />)}
        </PeopleList>
      </Content>
    </Wrapper>
  );
}

RoundResult.proptypes = {
  name: PropTypes.string.isRequired,
  estimate: PropTypes.number.isRequired,
  story: PropTypes.string.isRequired,
  averageEstimate: PropTypes.number.isRequired,
  people: PropTypes.array.isRequired,
}

export default RoundResult