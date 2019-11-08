import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import {AngleDoubleDown} from 'styled-icons/fa-solid/AngleDoubleDown';

import BlankProfilePicture from '../../../assets/Blank-profile-image.gif'

const Wrapper = styled.div`
  width: 100%;
  height: 60px;
  background-color: #e6edf3;
  display: flex;
  padding: 5px;
  box-sizing: border-box;
  border-top: 1px solid #c4cbd1;
`

const Left = styled.div`
  display: flex;
  align-items: center;
`

const Right = styled.div`

`

const ProfilePicture = styled.img`
  height: 40px;
  width: 40px;
  margin-right: 10px;
`

const Text = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`

const Title = styled.div`
  font-weight: bold;
  text-decoration: ${props => props.status == "CLOSED" ? "line-through" : "none"};
`

const Task = (props) => {
  const {assigne, status, title} = props
  const {profilePicture, firstname, lastname} = assigne
  return(
    <Wrapper>
      <Left>
          {
            assigne
            ?
              <ProfilePicture src={profilePicture ? profilePicture : BlankProfilePicture} />
            :
              null
          }
        <Text>
          <Title status={status}>
            {title}
          </Title>
          <div>
            {
              assigne
              ?
                "Assigne: " + firstname.charAt(0).toUpperCase() + firstname.slice(1) + " " + lastname
              :
                null
            }
          </div>
        </Text>
      </Left>
      <Right>

      </Right>
    </Wrapper>
  )
}

Task.propTypes = {
  assigne: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

export default Task