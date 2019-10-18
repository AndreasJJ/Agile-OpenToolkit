import React, { useState, useEffect } from 'react';
import { Link as rLink } from 'react-router-dom'

import styled from 'styled-components'
import {Home} from 'styled-icons/fa-solid/Home'
import {Graph} from 'styled-icons/octicons/Graph'
import {Collection} from 'styled-icons/boxicons-regular/Collection'
import {DirectionsRun} from 'styled-icons/material/DirectionsRun'
import {Columns} from 'styled-icons/boxicons-regular/Columns'
import {Directions} from 'styled-icons/boxicons-regular/Directions'
import {ViewCarousel} from 'styled-icons/material/ViewCarousel'
import {SignOutAlt} from 'styled-icons/fa-solid'
import {Label} from 'styled-icons/material/Label'

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

const ProductSelecter = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    width: 100%;
    padding: 15px 10px 15px 10px;
    box-sizing: border-box;
`

const ProductSelect = styled.select`
    width: 100%;
`

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

const SideBar = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(
    props.selectedIndex
  );

  useEffect(() => {
    if(selectedIndex !== props.selectedIndex) {
      props.selectProduct(selectedIndex)
    }
  }, [selectedIndex])

  const selectChange = async (e) => {
    await setSelectedIndex(e.target.value)
  }

  return (
    <SIDEBAR hidden={props.hidden} >
      <SideBarGrid>
        <LogoWrapper>
          <Logo>Agile Toolkit</Logo>
        </LogoWrapper>
        <SideNav>
          <Menu>
            <MenuItem current={props.location.pathname} next={"/dashboard"}>
              <Link to="/dashboard" current={props.location.pathname} next={"/dashboard"}>
                <Home size="1em"/>
                <LeftPadding>Home</LeftPadding>
              </Link>
            </MenuItem>
          </Menu>
          <ProductSelecter>
              <ProductSelect onChange={selectChange} defaultValue={selectedIndex}>
                  {
                    //TODO: Handle if the stored selectedIndex in redux is higher than the number of products
                    props.products && props.products.map((product, index) => 
                                                                    <option key={product.id} value={index}>{product.name}</option>
                                                                  )
                  }
              </ProductSelect>
          </ProductSelecter>
          {
            props.products.length > 0
            ?
              <Menu>
                <MenuItem current={props.location.pathname} next={"/overview"}>
                  <Link to="/overview" current={props.location.pathname} next={"/overview"}><Graph size="1em"/>
                    <LeftPadding>Overview</LeftPadding>
                  </Link>
                </MenuItem>
                <MenuItem current={props.location.pathname} next={"/backlog"}>
                  <Link to="/backlog" current={props.location.pathname} next={"/backlog"}><Collection size="1em"/>
                    <LeftPadding>Product backlog</LeftPadding>
                  </Link>
                </MenuItem>
                <MenuItem current={props.location.pathname} next={"/labels"}>
                  <Link to="/labels" current={props.location.pathname} next={"/labels"}><Label size="1em"/>
                    <LeftPadding>Labels</LeftPadding>
                  </Link>
                </MenuItem>
                <MenuItem current={props.location.pathname} next={"/sprints"}>
                  <Link to="/sprints" current={props.location.pathname} next={"/sprints"}><DirectionsRun size="1em"/>
                    <LeftPadding>Sprints</LeftPadding>
                  </Link>
                </MenuItem>
                <MenuItem current={props.location.pathname} next={"/sprintboard"}>
                  <Link to="/sprintboard" current={props.location.pathname} next={"/sprintboard"}>
                    <Columns size="1em"/>
                    <LeftPadding>Sprintboard</LeftPadding>
                  </Link>
                </MenuItem>
                <MenuItem current={props.location.pathname} next={"/planning"}>
                  <Link to="/planning" current={props.location.pathname} next={"/planning"}><ViewCarousel size="1em"/>
                    <LeftPadding>Planning Poker</LeftPadding>
                  </Link>
                </MenuItem>
                <MenuItem current={props.location.pathname} next={"/retrospective"}>
                  <Link to="/retrospective" current={props.location.pathname} next={"/retrospective"}>
                    <Directions size="1em"/>
                    <LeftPadding>Retrospective Board</LeftPadding>
                  </Link>
                </MenuItem>
              </Menu>
            :
              null
          }
        </SideNav>
        <Logout title="Click here to logout">
          <LogoutButton onClick={() => {props.onClickLogout()}}>
            <SignIcon size="1em" />
            <span>Logout</span>
          </LogoutButton>
        </Logout>
      </SideBarGrid>
    </SIDEBAR>
  );
}

export default SideBar;