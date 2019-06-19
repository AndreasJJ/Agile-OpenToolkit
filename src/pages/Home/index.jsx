import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';

import { userActions } from '../../state/actions/user';
import { alertActions } from '../../state/actions/alert';

import TeamWidget from './components/TeamWidget';
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
      teams: []
    };
    this.connectToSocket = this.connectToSocket.bind(this)

    this.getData = this.getData.bind(this)
    this.changeData = this.changeData.bind(this)
    this.createTeam = this.createTeam.bind(this)
    this.teamAdded = this.teamAdded.bind(this)
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

  changeData = () => this.socket.emit("initial_data");

  teamAdded = () => this.props.dispatch(alertActions.success('Team successfully added'));

  componentDidMount() {
    this.connectToSocket()
  }

  connectToSocket() {
    this.socket = io('http://localhost:5000/home', {query: {token: this.props.access_token}})

    this.socket.on('connect', function() {
      console.log("connected")
    }.bind(this));
    this.socket.on('disconnect', function(reason) {
      console.log("disconnected")
      if (reason === 'io server disconnect') {
        if(!this.props.refreshing) {
          const { dispatch } = this.props;
          dispatch(userActions.refresh(this.props.user)).then(() => {
            console.log("Refreshed token")
            this.connectToSocket()
            console.log("Reconnected")
          })
        }
      }
    }.bind(this));
    this.socket.on('get_data', this.getData);
    this.socket.on('change_data', this.changeData);
    this.socket.on('team_added', this.teamAdded);
    this.socket.emit('initial_data');
  }

  componentWillUnmount() {
    this.socket.off("conenct");
    this.socket.off("disconenct");
    this.socket.off("get_data");
    this.socket.off("change_data");
    this.socket.off('team_added');
  }

  createTeam(team) {
    this.socket.emit('create_team', team);

    const { dispatch } = this.props;
    dispatch(alertActions.info('The team creation process has started. Please wait for verification.'));
  }

  render() {
      return (
        <Wrapper>
          <TeamWidget teams={this.state.teams} sendTeam={this.createTeam} />
          <DetailsWidget profilePicture={this.props.profile_picture} gender={this.props.gender} firstname={this.props.firstname} lastname={this.props.lastname} email={this.props.email} />
          <NotificationsWidget />
        </Wrapper>
      );
  }
}

function mapStateToProps(state) {
    const { profile_picture, gender, firstname, lastname, email, access_token } = state.authentication.user;
    const { user, refreshing} = state.authentication
    return {
        refreshing,
        user,
        profile_picture, 
        gender, 
        firstname, 
        lastname, 
        email,
        access_token
    };
}

const connectedHome = connect(mapStateToProps)(Home);
export { connectedHome as Home }; 