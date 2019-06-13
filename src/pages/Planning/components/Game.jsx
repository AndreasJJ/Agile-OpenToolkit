import React, { useState, useCallback } from 'react';

import Poker from './Poker';
import RoundResult from './RoundResult';
import FinishScreen from './FinishScreen';

import styled, { keyframes } from 'styled-components';


const keyframe = keyframes`

`

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;


export default class Game extends React.PureComponent {

   constructor(props) {
    super(props)

    this.state = {
      state: 0
    };

  }

  componentDidMount() {

  }

  render() {
      let component;

      switch(this.state.state) {
        case 0:
          component = <Poker />
          break;
        case 1:
          component = <RoundResult story={"A Test Story"} people={[{name: "andreas", estimate: 5}, {name: "andreas", estimate: 5}, {name: "andreas", estimate: 5},{name: "andreas", estimate: 5}, {name: "andreas", estimate: 5}, {name: "andreas", estimate: 5}, {name: "andreas", estimate: 5}, {name: "andreas", estimate: 5}, {name: "andreas", estimate: 5}, {name: "andreas", estimate: 5}, {name: "andreas", estimate: 5}, {name: "andreas", estimate: 5}, {name: "andreas", estimate: 5}]} averageEstimate={5} />
          break;
        case 2:
          component = <FinishScreen />
          break;
      }
      return (
        <Wrapper>
          {
            component
          }
        </Wrapper>
      );
  }
}