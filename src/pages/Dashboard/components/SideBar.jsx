import React, { useState, useEffect } from 'react';
import { Link as rLink } from 'react-router-dom'
import PropTypes from 'prop-types';

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

    @media only screen and (max-width: 800px) {
      display: ${props => props.hidden ? "block" : "none"};
      grid-row-start: ${props => props.hidden ? "2" : "1"};
      grid-row-end: ${props => props.hidden ? "3" : "3"};
    }
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
    padding: 0px;
    margin: 15px 0px;
    box-sizing: border-box;
`

const ProductSelect = styled.select`
    width: 100%;
    margin-bottom: 15px;
    margin-top: 15px;
    border: 0;
    border-radius: 0;
    -webkit-appearance: none;
    appearance: none;
    -moz-appearance: none;
    background-position: right 50%;
    background-repeat: no-repeat;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAMCAYAAABSgIzaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDZFNDEwNjlGNzFEMTFFMkJEQ0VDRTM1N0RCMzMyMkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDZFNDEwNkFGNzFEMTFFMkJEQ0VDRTM1N0RCMzMyMkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0NkU0MTA2N0Y3MUQxMUUyQkRDRUNFMzU3REIzMzIyQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0NkU0MTA2OEY3MUQxMUUyQkRDRUNFMzU3REIzMzIyQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuGsgwQAAAA5SURBVHjaYvz//z8DOYCJgUxAf42MQIzTk0D/M+KzkRGPoQSdykiKJrBGpOhgJFYTWNEIiEeAAAMAzNENEOH+do8AAAAASUVORK5CYII=);
    padding: 15px;
    margin: 0px;
    background-color: #ffffff;
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
    overflow: auto;
`;

const HomeMenu = styled.ul`
    list-style: none;
    margin-block-start: 0px;
    margin-block-end: 0px;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 0px;
    width: 100%;
    text-align: left;
    overflow: hidden;
    padding: 15px 0px;
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
    position: relative;
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
          <HomeMenu>
            <MenuItem current={props.location.pathname} next={"/dashboard"}>
              <Link to="/dashboard" current={props.location.pathname} next={"/dashboard"}>
                <Home size="1em"/>
                <LeftPadding>Home</LeftPadding>
              </Link>
            </MenuItem>
          </HomeMenu>
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

SideBar.propTypes = {
  selectedIndex: PropTypes.string.isRequired,
  selectProduct: PropTypes.func.isRequired,
  hidden: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
  onClickLogout: PropTypes.func.isRequired
}

export default SideBar;