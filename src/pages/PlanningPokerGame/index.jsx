import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

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

function mapStateToProps(state) {
    const { user } = state.authentication;
    const { selectedTeam } = state.teams
    return {
        user,
        selectedTeam
    };
}

const connectedPlanningPokerGame = withRouter(connect(mapStateToProps)(PlanningPokerGame));
export { connectedPlanningPokerGame as PlanningPokerGame };
