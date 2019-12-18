import React, {useState, useEffect, useContext} from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { FirebaseContext } from '../../sharedComponents/Firebase';
import { history } from '../../state/helpers/history';

import { alertActions } from '../../state/actions/alert';

import sideImage from '../../assets/login_image';
import Modal from '../../sharedComponents/Modal';
import ForgotPassword from './components/ForgotPassword'

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
  width: 800px;
  overflow: hidden;
  padding: 55px 55px 37px 55px;
  background-color: #ffffff;
  -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  border-radius: 5px;
  display: grid;
  grid-template-columns: Calc(50% - 1px) 2px Calc(50% - 1px);
  grid-template-rows: 100%;

  @media only screen and (max-width: 800px) {
    display: block;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
  }
`;

const Left = styled.div`
  padding-right: 5px;
`

const Middle = styled.div`
  border: 1px dashed #000000;

  @media only screen and (max-width: 800px) {
    display: none;
  }
`

const Right = styled.div`
  padding-left: 5px;
  background-image: url("${props => props.image}");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  @media only screen and (max-width: 800px) {
    display: none;
  }
`

const LoginForm = styled.form`
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
  justify-content: space-between;

  @media only screen and (max-width: 800px) {
    flex-direction: column-reverse;
  }
`;


const Footer = styled.div`
  text-align: left;
  padding-top: 90px;
`;

const ForgotPasswordLink = styled.span`
  
  &:hover {
    text-decoration: underline;
    color: #1565f0;
    cursor: default;
  }
`

const LoginButton = styled.button`
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

const ToRegisterButton = styled.button`
  font-size: 16px;
  color: #1565f0;
  background-color: #ffffff;
  border: 2px solid #1565f0;
  line-height: 1.2;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  min-width: 150px;
  height: 50px;
  border-radius: 25px;

  @media only screen and (max-width: 800px) {
    width: 100%;
    margin-bottom: 10px;
  }
`

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

const Login = (props) => {
  // Redux dispatch
  const dispatch = useDispatch()

  // Firebase
  const firebase = useContext(FirebaseContext)

  // State
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Constructor
  useEffect(() => {
    // Set cookie visited to true such that the splash page isnt shown again
    setCookie("visited", true)
    props.finishLoading()
  }, [])

  // Cookie setter function
  const setCookie = (name,value,days) =>  {
      let expires = "";
      if (days) {
          let date = new Date();
          date.setTime(date.getTime() + (days*24*60*60*1000));
          expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }

  // Login function
  const login = async (e) => {
    e.preventDefault();

    // If both email and password isnt null then try to firebase log in
    if (email && password) {
      try {
        // firebase log in
        let user = await firebase.doSignInWithEmailAndPassword(email, password)
      }catch (err) {
        // Dispatch error
        dispatch(alertActions.error(err.message));
      }
    }
  }

  // Redirect to registration
  const toRegister = (e) => {
    e.preventDefault();

    history.push('/register');
  }

  const onChange = (e) => {
    if(e.target.name === "email") {
      setEmail(e.target.value)
    } else if(e.target.name === "password") {
      setPassword(e.target.value)
    }
  }

  const onClickForgotPassword = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <Container>
      {
          showModal
          ?
            <Modal content={<ForgotPassword finished={closeModal} />} 
                   minWidth={"800px"} 
                   exitModalCallback={closeModal} 
            />
          :
            null
      }
      <Wrapper>
        <Left>
          <LoginForm>
            <Title>Login</Title>
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
              <ToRegisterButton type="button" 
                                tabIndex={4} 
                                onClick={toRegister}>
                  To Register
              </ToRegisterButton>
              <LoginButton type="submit" 
                           tabIndex={3} 
                           onClick={login}
              >
                  Login
              </LoginButton>
            </ButtonsWrapper>
            <Footer>
              <ForgotPasswordLink onClick={onClickForgotPassword}>
                Forgot password
              </ForgotPasswordLink>
            </Footer>
          </LoginForm>
        </Left>
        <Middle></Middle>
        <Right image={sideImage}>

        </Right>
      </Wrapper>
    </Container>
  )
}

Login.proptypes = {
  finishLoading: PropTypes.func.isRequired
}

export { Login }; 