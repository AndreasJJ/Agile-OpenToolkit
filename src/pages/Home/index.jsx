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
      user: JSON.parse(localStorage.getItem('user')),
      teams: []
    };

    this.getData = this.getData.bind(this)
    this.changeData = this.changeData.bind(this)
    this.createTeam = this.createTeam.bind(this)
  }
  
  getData = data => {
    this.setState({ teams: JSON.parse(data)});
  };

  changeData = () => this.props.socket.emit("initial_data");

  componentDidMount() {
    this.props.socket.on('connect', function(_socket) {
      console.log("connected")
    }.bind(this));
    this.props.socket.on('disconnect', function(){
      console.log("disconnected")
    });
    this.props.socket.emit('initial_data');
    this.props.socket.on('get_data', this.getData);
    this.props.socket.on('change_data', this.changeData);
  }

  componentWillUnmount() {
    this.props.socket.off("get_data");
    this.props.socket.off("change_data");
  }

  createTeam(team) {
    console.log(team)
    this.props.socket.emit('create_team', team);
  }

  render() {
      return (
        <Wrapper>
          <TeamWidget teams={this.state.teams} sendTeam={this.createTeam} />
          <DetailsWidget profilePicture={this.state.user.profile_picture} gender={this.state.user.gender} firstname={this.state.user.firstname} lastname={this.state.user.lastname} email={this.state.user.email} />
          <PlaceholderWidget />
        </Wrapper>
      );
  }
}