import React, {useState} from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import {EnvelopeOpen} from 'styled-icons/fa-solid/EnvelopeOpen';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Header = styled.h2`
  text-align: center;
`

const Body = styled.form`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 0px;
  overflow: auto;
  justify-content: space-evenly;
  align-items: center;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Envelope = styled(EnvelopeOpen)`
  padding-bottom: 20px;
`

const Input = styled.input`
  width 200px;
  height: 40px;
  margin-right: 20px;
`

const SubmitButton = styled.button`
  height: 40px;
  width: 100px;
  border-radius: 4px;
`

const Message = styled.div`
  text-align: center;
  padding-bottom: 20px;
`

const JoinProduct = ({joinProduct, success}) => {
  // State
  const [invitationCode, setInvitationCode] = useState("")

  // On change funcntion to update state
  const onInputChange = (e) => {
    setInvitationCode(e.target.value)
  }

  // Try to join product with invitation code
  const onClick = async (e) => {
    e.preventDefault()
    await joinProduct(invitationCode)
    // Call success callback
    success()
  }

  return(
    <Wrapper>
       <Header>
         Join Team
       </Header>
       <Body>
         <Info>
           <Envelope size="2em" />
           <Message>To join a product please write in the invitation code that was sent to you through mail. 
                    If you haven't recived it then please make sure to check your spam folder or 
                    ask your invitor to invite you once more.
            </Message>
         </Info>
         <div>
           <Input placeholder="Enter invitation code" value={invitationCode} onChange={onInputChange} />
           <SubmitButton onClick={onClick}>Join Product</SubmitButton>
         </div>
       </Body>
    </Wrapper>
  )
}

JoinProduct.propTypes = {
  joinProduct: PropTypes.func.isRequired,
  success: PropTypes.func.isRequired
}

export default JoinProduct