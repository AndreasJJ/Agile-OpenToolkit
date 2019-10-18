import React from 'react';

import styled from 'styled-components';
import {Bars, SignOutAlt} from 'styled-icons/fa-solid'

import BlankProfilePicture from '../../../assets/Blank-profile-image.gif'

const HEADER = styled.header`
    display: grid;
    grid-template-columns: fit-content(100%) auto;
    grid-template-rows: 100%;
    grid-column-start: 2;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 1;
    background-color: #ffffff;
    border-bottom: 1px solid #cccccc;
    z-index: 9;
`;

const Collapse = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: -webkit-xxx-large;
    padding: 5px;
`;

const TopBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
`

const ProfileCard = styled.div`
    display: -webkit-inline-box;
    align-items: center;
    background-color: #ffffff;
    -webkit-box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.15);
    -moz-box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.15);
    box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    margin-right: 25px;
`

const ProfileImage = styled.img`
    width: 50px;
    height: 50px;
    margin-right: 10px;
`

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  height: 50px;
  justify-content: center;
  padding: 0px 10px 0px 10px;
`

const Username = styled.span`

`

const Header = (props) => {
  const {ProfilePicture, firstname, lastname, onClickCollapse} = props
  return (
    <HEADER>
      <Collapse onClick={() => {onClickCollapse()}}>
        <Bars size="1em" />
      </Collapse>
      <TopBar>
          <ProfileCard>
            <ProfileImage src={ProfilePicture ? ProfilePicture : BlankProfilePicture}/>
            <ProfileInfo>
              <Username>
                {
                  (firstname ? (firstname.charAt(0).toUpperCase() + firstname.slice(1)) : null) 
                  + " " 
                  + (lastname ? (lastname) : null)
                }
              </Username>
            </ProfileInfo>
          </ProfileCard>
      </TopBar>
    </HEADER>
  );
}

export default Header;
