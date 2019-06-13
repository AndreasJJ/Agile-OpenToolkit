import React from 'react';

import TeamWidget from './components/TeamWidget';
import DetailsWidget from './components/DetailsWidget';
import PlaceholderWidget from './components/PlaceholderWidget';

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
`;

export default class Home extends React.PureComponent {

 constructor(props) {
    super(props)

    this.state = {
      user: JSON.parse(localStorage.getItem('user'))
    };
  }
  componentDidMount() {
    
  }

  render() {
      return (
        <Wrapper>
          <TeamWidget />
          <DetailsWidget profilePicture={this.state.user.profile_picture} gender={this.state.user.gender} firstname={this.state.user.firstname} lastname={this.state.user.lastname} email={this.state.user.email} />
          <PlaceholderWidget />
        </Wrapper>
      );
  }
}