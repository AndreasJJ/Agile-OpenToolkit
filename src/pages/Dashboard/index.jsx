import React from 'react';
import { connect } from 'react-redux';

import styled from 'styled-components';

import Header from './components/Header';
import SideBar from './components/SideBar';

import io from 'socket.io-client';

const Grid = styled.div`
    display: grid;
    grid-template-columns: ${props => props.hidden ? "0px 100%" : "200px calc(100% - 200px);"};
    grid-template-rows: 80px calc(100% - 80px);
    width: 100%;
    height: 100%;
`

const Content = styled.div`
    display: block;
    grid-column-start: 2;
    grid-column-end: 2;
    grid-row-start: 2;
    grid-row-end: 3;
    width: 100%;
    height: 100%;
    background-color: #F4F4F4;
`;

/* eslint-disable react/prefer-stateless-function */
class Dashboard extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      hidden: false
    };

    this.socket = io('http://localhost:5000/' + this.props.namespace, {query: {token: this.props.access_token}});

    this.collapseSideBar = this.collapseSideBar.bind(this)
    this.logout = this.logout.bind(this)
  }

  componentDidMount() {
  }

  collapseSideBar() {
    event.preventDefault();
    event.stopPropagation();
    this.setState(state => ({ hidden: !state.hidden }));
  }

  logout() {
    this.props.history.push('/logout')
  }

  render() {
    return (
      <Grid hidden={this.state.hidden} >
        <Header onClickCollapse={this.collapseSideBar} onClickLogout={this.logout}></Header>
        <SideBar hidden={this.state.hidden} teams={this.props.teams} profilePic={this.props.profile_picture}  ></SideBar>
        <Content>
          <this.props.content socket={this.socket} />
        </Content>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
    const { teams, profile_picture, access_token } = state.authentication.user;
    return {
        teams, 
        profile_picture, 
        access_token
    };
}

const connectedDashboard = connect(mapStateToProps)(Dashboard);
export { connectedDashboard as Dashboard };
