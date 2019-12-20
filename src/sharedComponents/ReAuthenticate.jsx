import React, {useState, useEffect, useContext} from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { FirebaseContext } from './Firebase';

import { alertActions } from '../state/actions/alert';

import styled from 'styled-components';

import {User} from 'styled-icons/fa-solid/User';
import {UnlockAlt} from 'styled-icons/fa-solid/UnlockAlt';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 100%;
  overflow: hidden;
  padding: 55px 55px 37px 55px;
  background-color: #ffffff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: 800px) {
    display: block;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
  }
`;

const Form = styled.form`
  width: 100%;
`;

const Title = styled.h1`
  font-size: 30px;
  color: #000000;
  line-height: 1.2;
  text-align: left;
  text-transform: uppercase;
  display: block;
`;

const EmailWrapper = styled.div`
  width: 100%;
  position: relative;
  border-bottom: 1px solid rgba(0,0,0,0.24);
  margin-bottom: 30px;
  color: #000000;
`;

const PasswordWrapper = styled.div`
  width: 100%;
  position: relative;
  border-bottom: 1px solid rgba(0,0,0,0.24);
  margin-bottom: 30px;
  color: #000000;
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const ReAuthenicateButton = styled.button`
  font-size: 16px;
  color: #ffffff;
  background-color: #1565f0;
  line-height: 1.2;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  min-width: 150px;
  height: 50px;
  border-radius: 25px;
  border: none;

  @media only screen and (max-width: 800px) {
    width: 100%;
    margin-bottom: 10px;
  }
`;

const Input = styled.input`
  font-size: 16px;
  color: #000000;
  line-height: 1.2;
  display: block;
  width: 100%;
  height: 45px;
  background: transparent;
  padding: 0 5px 0 38px;
  border: none;
  outline: none;
`;

const ReAuthenticate = (props) => {
  // Redux dispatch
  const dispatch = useDispatch()

  // Firebase
  const firebase = useContext(FirebaseContext)

  // State
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Constructor
  useEffect(() => {

  }, [])

  // Reauthenticate user
  const reAuthenticate = async (e) => {
    e.preventDefault()
    try {
        // User credentials
        const credential = firebase.doCreateEmailAuthCredentials(email, password)
        // ReAuthenticate user through firebase
        await firebase.doReauthenticateWithCredential(credential)
        // Alert users that reauthentication was successful
        dispatch(alertActions.success("Re-authenication was successful."))
        // Exit ReAuthentication
        props.finished()
    } catch(err) {
        // Dispatch en alert error for the user
        dispatch(alertActions.error(err.message))
    }
  }

  const onChange = (e) => {
    if(e.target.name === "email") {
      setEmail(e.target.value)
    } else if(e.target.name === "password") {
      setPassword(e.target.value)
    }
  }

  return (
    <Container>
      <Wrapper>
          <Form>
            <Title>Re-authenticate</Title>
            <EmailWrapper>
              <span>Email</span>
              <InputWrapper>
                <User size="1em" />
                <Input type="text" 
                            tabIndex={1} 
                            name="email" 
                            value={email} 
                            onChange={onChange} 
                            placeholder="email" 
                            required />
              </InputWrapper>
            </EmailWrapper>
            <PasswordWrapper>
              <span>Password</span>
              <InputWrapper>
                <UnlockAlt size="1em" />
                <Input type="password" 
                               tabIndex={2} 
                               name="password" 
                               value={password} 
                               onChange={onChange} 
                               placeholder="Password" 
                               required />
              </InputWrapper>
            </PasswordWrapper>
            <ButtonsWrapper>
              <ReAuthenicateButton type="submit" 
                           tabIndex={3} 
                           onClick={reAuthenticate}
              >
                  Re-authenticate
              </ReAuthenicateButton>
            </ButtonsWrapper>
          </Form>
      </Wrapper>
    </Container>
  )
}

ReAuthenticate.proptypes = {

}

export { ReAuthenticate }; 
