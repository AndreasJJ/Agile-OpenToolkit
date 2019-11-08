import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import Game from './components/Game'

import styled from 'styled-components';

class PlanningPokerGame extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {

    };

  }

  componentDidMount() {
    console.log(this.props.match.params.id)
  }

  render() {
    return (
        <Game />
    );
  }
}

PlanningPokerGame.proptypes = {

}

const connectedPlanningPokerGame = withRouter(connect()(PlanningPokerGame));
export { connectedPlanningPokerGame as PlanningPokerGame };
