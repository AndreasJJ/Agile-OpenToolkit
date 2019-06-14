import React from 'react';
import { Link as rLink } from 'react-router-dom'

import styled from 'styled-components'
import {Home} from 'styled-icons/fa-solid/Home'
import {Collection} from 'styled-icons/boxicons-regular/Collection'
import {Columns} from 'styled-icons/boxicons-regular/Columns'
import {Directions} from 'styled-icons/boxicons-regular/Directions'
import {ViewCarousel} from 'styled-icons/material/ViewCarousel'

import BlankProfilePicture from '../../../assets/Blank-profile-image.gif'

const SideNav = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    text-align: center;
`;

const Menu = styled.ul`
    list-style: none;
    margin-block-start: 0px;
    margin-block-end: 0px;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 0px;
    width: 100%;
    text-align: left;
`;

const MenuItem = styled.li`
    padding-bottom: 15px;
    padding-top: 15px;
    padding-left: 10px;
`

const Link = styled(rLink)`
    color: #94a0b3;
    text-decoration: none;
    display: flex;
    align-items: center;

    :visited {
      color: #94a0b3;
    }
`

const LeftPadding = styled.span`
  padding-left: 5px;
`

const SideProfile = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    background-color: #9373CA;
`

const ProfileImage = styled.img`
    width: 50px;
    height: 50px;
`

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  height: 50px;
  justify-content: center;
`

const Username = styled.span`

`

const GroupSelect = styled.select`
    width: 100px;
`

const SIDEBAR = styled.aside`
    display: ${props => props.hidden ? "none" : "block"};
    grid-column-start: 1;
    grid-column-end: 1;
    grid-row-start: 2;
    grid-row-end: 3;
    background-color: #252634;
    color: #ffffff;
    height: 100%;
`

const SideBarGrid = styled.div`
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 100px calc(100% - 100px);
    width: 100%;
    height: 100%;
`

/* eslint-disable react/prefer-stateless-function */
class SideBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedIndex: this.props.selectedIndex
    };

    this.selectChange = this.selectChange.bind(this)
  }

  selectChange(e) {
    this.setState({selectedIndex: e.target.value}, function(test) {
      this.props.selectTeam(this.state.selectedIndex)
    }.bind(this))
  }

  render() {
    return (
      <SIDEBAR hidden={this.props.hidden} >
        <SideBarGrid>
          <SideProfile>
              <ProfileImage src={this.props.ProfilePicture ? this.props.ProfilePicture : BlankProfilePicture}/>
              <ProfileInfo>
                <Username>Andreas</Username>
                <GroupSelect onChange={this.selectChange} defaultValue={this.state.selectedIndex}>
                    {
                      //TODO: Handle if the stored selectedIndex in redux is higher than the number of teams
                      this.props.teams && this.props.teams.map((team, index) => <option key={team} value={index}>{team}</option>)
                    }
                </GroupSelect>
              </ProfileInfo>
          </SideProfile>
          <SideNav>
            <Menu>
                <MenuItem className ="side-nav-active"><Link to="/dashboard"><Home size="1em"/><LeftPadding>Home</LeftPadding></Link></MenuItem>
                <MenuItem><Link to="/backlog"><Collection size="1em"/><LeftPadding>Product backlog</LeftPadding></Link></MenuItem>
                <MenuItem><Link to="/sprintboard"><Columns size="1em"/><LeftPadding>Sprintboard</LeftPadding></Link></MenuItem>
                <MenuItem><Link to="/planning"><ViewCarousel size="1em"/><LeftPadding>Planning Poker</LeftPadding></Link></MenuItem>
                <MenuItem><Link to="/retrospective"><Directions size="1em"/><LeftPadding>Retrospective Board</LeftPadding></Link></MenuItem>
            </Menu>
          </SideNav>
        </SideBarGrid>
      </SIDEBAR>
    );
  }
}

export default SideBar;