import React from 'react';
import { Link as rLink } from 'react-router-dom'

import styled from 'styled-components'
import {Home} from 'styled-icons/fa-solid/Home'
import {Collection} from 'styled-icons/boxicons-regular/Collection'
import {Columns} from 'styled-icons/boxicons-regular/Columns'
import {Directions} from 'styled-icons/boxicons-regular/Directions'
import {ViewCarousel} from 'styled-icons/material/ViewCarousel'
import {SignOutAlt} from 'styled-icons/fa-solid'

const SIDEBAR = styled.aside`
    display: ${props => props.hidden ? "none" : "block"};
    grid-column-start: 1;
    grid-column-end: 1;
    grid-row-start: 1;
    grid-row-end: 3;
    background-color: #2eb1e5;
    color: #ffffff;
    height: 100%;
    box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.15);
    z-index: 10;
`

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
    background-color: ${props => props.current == props.next ? "#f6f6f6" : null};
`

const Link = styled(rLink)`
    color: ${props => props.current == props.next ? "#2eb1e5" : "#ffffff"};
    text-decoration: none;
    display: flex;
    align-items: center;

    :visited {
      color: ${props => props.current == props.next ? "#2eb1e5" : "#ffffff"};
    }
`

const LeftPadding = styled.span`
  padding-left: 5px;
`

const LogoWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 5px;
    justify-content: center;
    align-items: center;
`;

const Logo = styled.span`
    font-size: 2em;
    font-weight: bolder;
    color: #ffffff;
`

const SideBarGrid = styled.div`
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 100px calc(100% - 150px) 50px;
    width: 100%;
    height: 100%;
`

const Logout = styled.div`
  display: flex;
  color: #ffffff;
  cursor: pointer;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
     -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently
                                supported by Chrome and Opera */
`

const LogoutButton = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  padding-left: 10px;
`

const SignIcon = styled(SignOutAlt)`
  margin-right: 5px;
`



/* eslint-disable react/prefer-stateless-function */
class SideBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedPage: 0
    };

  }

  componentDidMount() {
    console.log(this.props.location.pathname)
  }

  render() {
    return (
      <SIDEBAR hidden={this.props.hidden} >
        <SideBarGrid>
          <LogoWrapper>
            <Logo>Agile Toolkit</Logo>
          </LogoWrapper>
          <SideNav>
            <Menu>
                <MenuItem current={this.props.location.pathname} next={"/dashboard"}><Link to="/dashboard" current={this.props.location.pathname} next={"/dashboard"}><Home size="1em"/><LeftPadding>Overview</LeftPadding></Link></MenuItem>
                <MenuItem current={this.props.location.pathname} next={"/backlog"}><Link to="/backlog" current={this.props.location.pathname} next={"/backlog"}><Collection size="1em"/><LeftPadding>Product backlog</LeftPadding></Link></MenuItem>
                <MenuItem current={this.props.location.pathname} next={"/sprintboard"}><Link to="/sprintboard" current={this.props.location.pathname} next={"/sprintboard"}><Columns size="1em"/><LeftPadding>Sprintboard</LeftPadding></Link></MenuItem>
                <MenuItem current={this.props.location.pathname} next={"/planning"}><Link to="/planning" current={this.props.location.pathname} next={"/planning"}><ViewCarousel size="1em"/><LeftPadding>Planning Poker</LeftPadding></Link></MenuItem>
                <MenuItem current={this.props.location.pathname} next={"/retrospective"}><Link to="/retrospective" current={this.props.location.pathname} next={"/retrospective"}><Directions size="1em"/><LeftPadding>Retrospective Board</LeftPadding></Link></MenuItem>
            </Menu>
          </SideNav>
          <Logout title="Click here to logout">
            <LogoutButton onClick={() => {this.props.onClickLogout()}}>
              <SignIcon size="1em" /><span>Logout</span>
            </LogoutButton>
          </Logout>
        </SideBarGrid>
      </SIDEBAR>
    );
  }
}

export default SideBar;