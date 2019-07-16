import React from 'react';
import { connect } from 'react-redux';

import { ProductWidget } from './components/ProductWidget';
import DetailsWidget from './components/DetailsWidget';
import NotificationsWidget from './components/NotificationsWidget';

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
`;

class Home extends React.PureComponent {

 constructor(props) {
    super(props)

    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
      return (
        <Wrapper>
          <ProductWidget />
          <DetailsWidget profilePicture={this.props.profile_picture} gender={this.props.gender} firstname={this.props.firstname} lastname={this.props.lastname} email={this.props.email} />
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

const connectedHome = connect(mapStateToProps)(Home);
export { connectedHome as Home };