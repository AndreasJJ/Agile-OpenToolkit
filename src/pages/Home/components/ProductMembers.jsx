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

const AddMemberForm = styled.form`
  display: flex;
  height: 30px;
`

const Input = styled.input`
  flex 1;
  margin-right 5px;
`

const CancelButton = styled.button`
  margin-right: 5px;
`

const Button = styled.button`

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
  const [showInput, setShowInput] = useState(false)
  const [memberInput, setMemberInput] = useState("")

  // Constructor
  useEffect(() => {
    const init = async () => {
      // Get members from database and update state
      let _members = await props.getMembers(props.products[props.productIndex].id)
      setMembers(_members)
    }
    init()
  }, [])

  // On change for input
  const onInputChange = (e) => {
    setMemberInput(e.target.value)
  }

  // On click for add members button to show input
  const onAddMemberClick = () => {
    setShowInput(true)
  }

  // on click for cancel member input
  const onAddMemberCancel = () => {
    setShowInput(false)
  }

  // On submit for adding member
  const onAddMemberSubmit = async (e) => {
    e.preventDefault()
    await props.addMember(props.products[props.productIndex].id, memberInput)
    setShowInput(false)
  }

  return(
    <Wrapper>
      <div>
        <TopBarPadding>
          <TopBar>
            <span>Members</span>
          </TopBar>
        </TopBarPadding>
        <ButtonWrapper>
          {
            showInput
            ?
              <AddMemberForm onSubmit={onAddMemberSubmit}>
                <Input value={memberInput} onChange={onInputChange} />
                <CancelButton type="button" onClick={onAddMemberCancel}>Cancel</CancelButton>
                <Button type="submit">Add member</Button>
              </AddMemberForm>
            :
            <AddMember onClick={onAddMemberClick}>
              <PersonAdd size="1em" /> Add member
            </AddMember>
          }
          
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