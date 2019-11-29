import React from 'react';

import styled from 'styled-components';
import {DotsHorizontalRounded} from 'styled-icons/boxicons-regular/DotsHorizontalRounded';

import BlankProfilePicture from '../../../assets/Blank-profile-image.gif';

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

const Member = (props) => (
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

export default Member