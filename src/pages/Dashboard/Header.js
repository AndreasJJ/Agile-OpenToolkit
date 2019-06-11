import React from 'react';

import styled from 'styled-components';
import {Bars, SignOutAlt} from 'styled-icons/fa-solid'

const HEADER = styled.header`
    display: grid;
    grid-template-columns: fit-content(100%) auto fit-content(100%);
    grid-template-rows: 100%;
    grid-column-start: 2;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 1;
    -webkit-box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.5);
    -moz-box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.5);
    box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.5);
`;

const Collapse = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: -webkit-xxx-large;
    padding: 5px;
`;

const LogoWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 5px;
`;

const Logo = styled.span`
    font-size: 2em;
`

const Logout = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: -webkit-xxx-large;
    padding: 5px;
`;

/* eslint-disable react/prefer-stateless-function */
class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <HEADER>
        <Collapse onClick={() => {this.props.onClickCollapse()}}>
          <Bars size="1em" />
        </Collapse>
        <LogoWrapper>
            <Logo>Agile Toolbox</Logo>
        </LogoWrapper>
        <Logout onClick={() => {this.props.onClickLogout()}}>
          <SignOutAlt size="1em" />
        </Logout>
      </HEADER>
    );
  }
}

export default Header;
