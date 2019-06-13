import React from 'react';
import { connect } from 'react-redux';

import { userActions } from '../../state/actions/user';

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

class Home extends React.PureComponent {

 constructor(props) {
    super(props)

    this.state = {
      teams: []
    };

    this.getData = this.getData.bind(this)
    this.changeData = this.changeData.bind(this)
    this.createTeam = this.createTeam.bind(this)
  }
  
  getData = data => {
    this.setState({ teams: JSON.parse(data)});

    let teams = []
    JSON.parse(data).forEach((currentValue, index, arr) => {
      teams.push(currentValue.name)
    })
    const { dispatch } = this.props;
    dispatch(userActions.addTeams(this.props.user, teams));
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
          <DetailsWidget profilePicture={this.props.profile_picture} gender={this.props.gender} firstname={this.props.firstname} lastname={this.props.lastname} email={this.props.email} />
          <PlaceholderWidget />
        </Wrapper>
      );
  }
}

function mapStateToProps(state) {
    const { profile_picture, gender, firstname, lastname, email } = state.authentication.user;
    const { user } = state.authentication
    return {
        user,
        profile_picture, 
        gender, 
        firstname, 
        lastname, 
        email
    };
}

const connectedHome = connect(mapStateToProps)(Home);
export { connectedHome as Home }; 