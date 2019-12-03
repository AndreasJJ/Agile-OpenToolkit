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
    background-color: #ffffff;
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
    box-sizing: border-box;
    min-height: 80px;
`

const ProductSelect = styled.select`
    font-size: 16px;
    height: 80px;
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
    padding: 0px 15px;
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
`

const MenuItem = styled.li`
    padding-bottom: 15px;
    padding-top: 15px;
    
`

const Link = styled(rLink)`
    color: #535353;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    :visited {
      color: #535353;
    }

    & > span {
      text-align: center;
      font-size: 0.8em;
      width: 69px;
    }

    @media only screen and (max-width: 800px) {
      flex-direction: row;
      justify-content: start;
      margin-left: 15px;

      & > span {
        width: 100%;
        text-align: start;
        margin-left: 5px;
        font-size: 1em;
      }
    }
`

const IconWrapper = styled.div`
  padding: 15px;
  background-color: ${props => props.current == props.next ? "#2ECEFE" : "#e5e4f2"};
  border-radius: 10px;

  & > svg {
    color: ${props => props.current == props.next ? "#ffffff" : "#000000"};
  }  
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
    grid-template-rows: 100%;
    width: 100%;
    height: 100%;
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
        <SideNav>
          <ProductSelecter>
              <ProductSelect onChange={selectChange} defaultValue={selectedIndex}>
                  {
                    //TODO: Handle if the stored selectedIndex in redux is higher than the number of products
                    props.products && 
                    props.products.map((product, index) => 
                                        <option key={product.id} value={index}>{product.name}</option>
                                      )
                  }
              </ProductSelect>
          </ProductSelecter>
          {
            props.products.length > 0
            ?
              <Menu>
                <MenuItem>
                  <Link to="/dashboard" current={props.location.pathname} next={"/dashboard"}>
                    <IconWrapper current={props.location.pathname} next={"/dashboard"}>
                      <Home size="1.5em"/>
                    </IconWrapper>
                    <span>Home</span>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/overview" current={props.location.pathname} next={"/overview"}>
                    <IconWrapper current={props.location.pathname} next={"/overview"}>
                      <Graph size="1.5em"/>
                    </IconWrapper>
                    <span>Overview</span>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/backlog" current={props.location.pathname} next={"/backlog"}>
                    <IconWrapper current={props.location.pathname} next={"/backlog"}>
                      <Collection size="1.5em"/>
                    </IconWrapper>
                    <span>Product backlog</span>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/labels" current={props.location.pathname} next={"/labels"}>
                    <IconWrapper current={props.location.pathname} next={"/labels"}>
                      <Label size="1.5em"/>
                    </IconWrapper>
                    <span>Labels</span>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/sprints" current={props.location.pathname} next={"/sprints"}>
                    <IconWrapper current={props.location.pathname} next={"/sprints"}>
                      <DirectionsRun size="1.5em"/>
                    </IconWrapper>
                    <span>Sprints</span>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/sprintboard" current={props.location.pathname} next={"/sprintboard"}>
                    <IconWrapper current={props.location.pathname} next={"/sprintboard"}>
                      <Columns size="1.5em"/>
                    </IconWrapper>
                    <span>Sprintboard</span>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/planning" current={props.location.pathname} next={"/planning"}>
                    <IconWrapper current={props.location.pathname} next={"/planning"}>
                      <ViewCarousel size="1.5em"/>
                    </IconWrapper>
                    <span>Planning Poker</span>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/retrospective" current={props.location.pathname} next={"/retrospective"}>
                    <IconWrapper  current={props.location.pathname} next={"/retrospective"}>
                      <Directions size="1.5em"/>
                    </IconWrapper>
                    <span>Retrospective Board</span>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/logout" current={props.location.pathname} next={"/logout"}>
                    <IconWrapper current={props.location.pathname} next={"/logout"}>
                      <SignOutAlt size="1.5em" />
                    </IconWrapper>
                    <span>Logout</span>
                  </Link>
                </MenuItem>
              </Menu>
            :
              null
          }
        </SideNav>
      </SideBarGrid>
    </SIDEBAR>
  );
}

SideBar.propTypes = {
  selectedIndex: PropTypes.string.isRequired,
  selectProduct: PropTypes.func.isRequired,
  hidden: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired
}

export default SideBar;