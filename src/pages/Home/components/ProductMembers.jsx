import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import {PersonAdd} from 'styled-icons/material/PersonAdd';

import Member from './Member';

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

const ProductMembers = (props) => {
  // State
  const [members, setMembers] = useState([])

  // Constructor
  useEffect(() => {
    const init = async () => {
      // Get members from database and update state
      let _members = await props.getMembers(props.products[props.productIndex].id)
      setMembers(_members)
    }
    init()
  }, [])

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
          {members && 
           members.length > 0 &&
           members.map((member, index) => 
                                    <Member key={Object.keys(member)[0]} 
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

export default ProductMembers