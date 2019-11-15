import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import {PersonAdd} from 'styled-icons/material/PersonAdd';
import {DotsHorizontalRounded} from 'styled-icons/boxicons-regular/DotsHorizontalRounded';

import BlankProfilePicture from '../../../assets/Blank-profile-image.gif'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`

const TopBarPadding = styled.div`
  padding: 10px;
  border-bottom: 2px solid #F4F4F4;
`

const TopBar = styled.div`
  font-weight: bold;
`

const ButtonWrapper = styled.div`
  padding: 5px 20px 5px 20px;
`

const AddMember = styled.button`
  border: 2px solid #F4F4F4;
  width 100%;
  height: 30px;
`

const MemberList = styled.div`
  overflow: auto;
`

const Body = styled.div`
  flex-grow: 1;
`

const MemberCard = styled.div`
  border-bottom: 1px solid #F4F4F4;
`

const MemberCardContent = styled.div`
   display: flex;
   align-items: center;
   justify-content: space-between;
   padding: 5px 20px 5px 20px;
`

const Left = styled.div`
  display: flex;
  align-items: center;
`

const Options = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ProfilePicture = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`

const Name = styled.div`
  margin-left: 10px;
  word-break: break-all;
`

export default class ProductMembers extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      members: []
    }
  }

  async componentDidMount() {
    let members = await this.props.getMembers(this.props.products[this.props.productIndex].id)
    this.setState({members: members})
  }

  static Member = (props) => (
      <MemberCard>
        <MemberCardContent>
           <Left>
             <ProfilePicture src={props.profilePicture ? props.profilePicture : BlankProfilePicture} />
             <Name>
               {
                 props.firstname.charAt(0).toUpperCase() + props.firstname.slice(1) + " " + props.lastname
               }
              </Name>
           </Left>
           <Options>
             <DotsHorizontalRounded size="1em" />
           </Options>
        </MemberCardContent>
      </MemberCard>
  );

  render () {
    return(
      <Wrapper>
        <div>
          <TopBarPadding>
            <TopBar>
              <span>Members</span>
            </TopBar>
          </TopBarPadding>
          <ButtonWrapper>
            <AddMember>
              <PersonAdd size="1em" /> Add member
            </AddMember>
          </ButtonWrapper>
        </div>
        <Body>
          <MemberList>
            {this.state.members && 
             this.state.members.length > 0 &&
             this.state.members.map((member, index) => 
                                      <ProductMembers.Member key={Object.keys(member)[0]} 
                                                             profilePicture={Object.values(member)[0].profilePicture} 
                                                             firstname={Object.values(member)[0].firstname} 
                                                             lastname={Object.values(member)[0].lastname} />
                                    )
            }
          </MemberList>
        </Body>  
      </Wrapper>
    )
  }
}

ProductMembers.defaultProps = {
  firstname: "",
  lastname: ""
}

ProductMembers.propTypes = {
  getMembers: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
  productIndex: PropTypes.string.isRequired,
  profilePicture: PropTypes.string,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired
}