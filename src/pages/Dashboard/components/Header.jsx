import React from 'react';
import PropTypes from 'prop-types';

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
    grid-row-end: 2;
    background-color: #2ECEFE;
    /* border-bottom: 1px solid #cccccc; */
    z-index: 9;

    @media only screen and (max-width: 800px) {
      grid-column-start: ${props => props.hidden ? "1" : "2"};
      grid-column-end: ${props => props.hidden ? "2" : "3"};
    }
`;

const Collapse = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: -webkit-xxx-large;
    padding: 5px;
    color: #ffffff;
`;

const TopBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
`

const ProfileCard = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
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
    border-radius: 4px 0px 0px 4px;
`

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  height: 50px;
  justify-content: center;
  padding: 0px 10px 0px 10px;
`

const Header = (props) => {
  const {ProfilePicture, firstname, lastname, onClickCollapse, hidden} = props
  return (
    <HEADER hidden={hidden}>
      <Collapse onClick={onClickCollapse}>
        <Bars size="1em" />
      </Collapse>
      <TopBar>
          <ProfileCard>
            <ProfileImage src={ProfilePicture ? ProfilePicture : BlankProfilePicture}/>
            <ProfileInfo>
              <span>
                {
                  (firstname ? (firstname.charAt(0).toUpperCase() + firstname.slice(1)) : null) 
                  + " " 
                  + (lastname ? (lastname) : null)
                }
              </span>
            </ProfileInfo>
          </ProfileCard>
      </TopBar>
    </HEADER>
  );
}

Header.propTypes = {
  ProfilePicture: PropTypes.string,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  onClickCollapse: PropTypes.func.isRequired,
  hidden: PropTypes.bool.isRequired
}

export default Header;
