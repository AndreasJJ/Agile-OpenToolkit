import React, { useState } from 'react';

import Poker from './Poker';
import RoundResult from './RoundResult';
import FinishScreen from './FinishScreen';

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`


const Game = (props) => {
  // State
  const [state, setState] = useState(0)

  // Show component depending on which state the game is in (playing, roundresult, finished)
  let component;
  switch(state) {
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

export default Game