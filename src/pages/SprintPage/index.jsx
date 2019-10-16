import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import InformationWidget from './components/InformationWidget';
import {IssuesListsWidget} from './components/IssuesListsWidget';

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 30% 70%;
`;

class SprintPage extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {

    };

  }

  componentDidMount() {
    this.props.finishLoading()
  }

  render() {
    return (
        <Wrapper>
          <InformationWidget />
          <IssuesListsWidget />
        </Wrapper>
    );
  }
}

function mapStateToProps(state) {
    return {
    };
}

const connectedSprintPage = withRouter(connect(mapStateToProps)(SprintPage));
export { connectedSprintPage as SprintPage };
