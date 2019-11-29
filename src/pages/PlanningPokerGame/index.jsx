import React, {useEffect} from 'react';
import PropTypes from 'prop-types';

import Game from './components/Game'

import styled from 'styled-components';

const PlanningPokerGame = (props) => {

  useEffect(() => {
    console.log(props.match.params.id)
  },[])

  return (
      <Game />
  )
}

PlanningPokerGame.proptypes = {

}

export { PlanningPokerGame };
