import React from 'react';

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

export default class Task extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    }

  }

  componentDidMount() {
    console.log(this.props.status)
  }

  render () {
    return (
      <Wrapper>
        <Left>
            {
              this.props.assigne
              ?
                <ProfilePicture src={this.props.assigne.profilePicture ? this.props.assigne.profilePicture : BlankProfilePicture} />
              :
                null
            }
          <Text>
            <Title status={this.props.status}>
              {this.props.title}
            </Title>
            <div>
              {
                this.props.assigne
                ?
                  "Assigne: " + this.props.assigne.firstname.charAt(0).toUpperCase() + this.props.assigne.firstname.slice(1) + " " + this.props.assigne.lastname
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
}