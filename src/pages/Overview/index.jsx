import React from 'react';
import { connect } from 'react-redux';

import NotificationsWidget from './components/NotificationsWidget';
import GraphWidget from './components/GraphWidget';

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 60% 40%;
`;

class Overview extends React.PureComponent {

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
          <GraphWidget />
          <NotificationsWidget />
        </Wrapper>
      );
  }
}

function mapStateToProps(state) {
    const { uid, firstname, lastname, gender, phoneNumber, email, photoURL } = state.authentication.user;
    return {
        uid,
        firstname,
        lastname,
        gender,
        phoneNumber,
        email,
        photoURL,
    };
}

const connectedOverview = connect(mapStateToProps)(Overview);
export { connectedOverview as Overview };