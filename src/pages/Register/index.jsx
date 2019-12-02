import React, {useState, useEffect, useContext} from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { FirebaseContext } from '../../sharedComponents/Firebase';
import { history } from '../../state/helpers/history';

import { alertActions } from '../../state/actions/alert';

import sideImage from '../../assets/register_image.svg';

import styled from 'styled-components';
import {User} from 'styled-icons/fa-solid/User';
import {UnlockAlt} from 'styled-icons/fa-solid/UnlockAlt';
import {Envelope} from 'styled-icons/boxicons-regular/Envelope';

import bg from '../../assets/bg.png'

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
  background-size: contain;

  @media only screen and (max-width: 800px) {
    display: none;
  }
`


const RegisterForm = styled.form`
  width: 100%;
`;

const Title = styled.h1`
  font-size: 30px;
  color: #000000;
  line-height: 1.2;
  text-align: center;
  text-transform: uppercase;
  display: block;
`;

const EmailWrapper = styled.div`
  width: 100%;
  position: relative;
  border-bottom: 2px solid rgba(255,255,255,0.24);
  margin-bottom: 30px;
  color: #000000;
  border-bottom: 1px solid rgba(0,0,0,0.24);
`;

const NameWrapper = styled.div`
  display: flex;
`

const FirstnameWrapper = styled.div`
  width: 100%;
  position: relative;
  border-bottom: 2px solid rgba(255,255,255,0.24);
  margin-bottom: 30px;
  color: #000000;
  border-bottom: 1px solid rgba(0,0,0,0.24);
  margin-right: 5px;
`

const LastnameWrapper = styled.div`
  width: 100%;
  position: relative;
  border-bottom: 2px solid rgba(255,255,255,0.24);
  margin-bottom: 30px;
  color: #000000;
  border-bottom: 1px solid rgba(0,0,0,0.24);
  margin-left: 5px;
`

const PasswordWrapper = styled.div`
  width: 100%;
  position: relative;
  border-bottom: 2px solid rgba(255,255,255,0.24);
  margin-bottom: 30px;
  color: #000000;
  border-bottom: 1px solid rgba(0,0,0,0.24);
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

const RegisterButton = styled.button`
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

const ToLoginButton = styled.button`
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

const Footer = styled.div`
  text-align: center;
  padding-top: 90px;
`;

const EmailInput = styled.input`
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

  &:placeholder {
    color: white;
  }
`;

const FirstnameInput = styled.input`
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

const LastnameInput = styled.input`
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

const PasswordInput = styled.input`
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

const ConfirmPasswordInput = styled.input`
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
`

const Register = (props) => {
  const firebase = useContext(FirebaseContext)

  const dispatch = useDispatch()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")

  useEffect(() => {
    props.finishLoading()
    setCookie("visited", true)
  },[])

  const setCookie = (name,value,days) => {
      let expires = "";
      if (days) {
          let date = new Date();
          date.setTime(date.getTime() + (days*24*60*60*1000));
          expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }

  const register = async (e) => {
    e.preventDefault();

    if(!validateEmail(email) || email == "") {
      dispatch(alertActions.error('Please provide a valid email'));
      return
    }

    if(firstname.length < 2 || lastname.length < 2) {
      dispatch(alertActions.error('Names need to be 2 characters or longer'));
      return
    }

    if(!validateName(firstname) || !validateName(lastname)) {
      dispatch(alertActions.error('Names can only contain letters'));
      return
    }

    if(password != confirmPassword) {
      dispatch(alertActions.error('Your password doesnt match your confirmation password'));
      return
    }

    if(password.length < 6 || confirmPassword.length < 6) {
      dispatch(alertActions.error('The password must be at least 6 characters long'));
      return
    }
    try {
      let user = await firebase.doCreateUserWithEmailAndPassword(email, password)
      firebase.db.collection("users").doc(user.user.uid).set({
          email: user.user.email,
          firstname: firstname,
          lastname: lastname
        })
    } catch(err) {
      dispatch(alertActions.error(err.message));
    }
  }

  const validateEmail = (email) => {
    let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return re.test(email);
  }

  const validateName = (name) => {
    let re = /^[a-zA-Z]+$/;
    return re.test(name);
  } 

  const onChange = (e) => {
    if(e.target.name === "email") {
      setEmail(e.target.value)
    } else if(e.target.name === "password") {
      setPassword(e.target.value)
    } else if(e.target.name === "confirmPassword") {
      setConfirmPassword(e.target.value)
    } else if(e.target.name === "firstname") {
      setFirstname(e.target.value)
    } else if(e.target.name === "lastname") {
      setLastname(e.target.value)
    }
  }

  const toLogin = (e) => {
    e.preventDefault();

    history.push('/login');
  }

  return(
      <Container>
        <Wrapper>
          <Left>
            <RegisterForm>
              <Title>Register</Title>
              <EmailWrapper>
                <span>Email</span>
                <InputWrapper>
                  <Envelope size="1em" />
                  <EmailInput type="email" 
                              tabIndex={1} 
                              name="email" 
                              value={email}
                              onChange={onChange} 
                              placeholder="Email" 
                              minlength="3" 
                              maxlength="12" 
                              required />
                </InputWrapper>
              </EmailWrapper>
              <NameWrapper>
                <FirstnameWrapper>
                  <span>Lastname</span>
                  <InputWrapper>
                    <User size="1em" />
                    <FirstnameInput type="text" 
                                    tabIndex={2} 
                                    name="firstname" 
                                    value={firstname} 
                                    onChange={onChange} 
                                    placeholder="Firstname" 
                                    minlength="3" 
                                    required />
                  </InputWrapper>
                </FirstnameWrapper>
                <LastnameWrapper>
                  <span>Lastname</span>
                  <InputWrapper>
                    <User size="1em" />
                    <LastnameInput type="text" 
                                   tabIndex={3} 
                                   name="lastname" 
                                   value={lastname} 
                                   onChange={onChange} 
                                   placeholder="Lastname" 
                                   minlength="3" 
                                   required />
                  </InputWrapper>
                </LastnameWrapper>
              </NameWrapper>
              <PasswordWrapper>
                <span>Password</span>
                <InputWrapper>
                  <UnlockAlt size="1em" />
                  <PasswordInput type="password" 
                                 tabIndex={4} 
                                 name="password" 
                                 value={password} 
                                 onChange={onChange} 
                                 placeholder="Password" 
                                 minlength="6" 
                                 maxlength="32" 
                                 required />
                </InputWrapper>
              </PasswordWrapper>
              <PasswordWrapper>
                <span>Confirm Password</span>
                <InputWrapper>
                  <UnlockAlt size="1em" />
                  <ConfirmPasswordInput type="password" 
                                        tabIndex={5} 
                                        name="confirmPassword" 
                                        value={confirmPassword} 
                                        onChange={onChange} 
                                        placeholder="Confirm password" 
                                        minlength="6" 
                                        maxlength="32" 
                                        required />
                </InputWrapper>
              </PasswordWrapper>
              <ButtonsWrapper>
                <ToLoginButton type="button" 
                               tabIndex={7} 
                               onClick={toLogin}
                >
                  To Login
                </ToLoginButton>
                <RegisterButton type="submit" 
                                tabIndex={6} 
                                onClick={register}
                >
                    Register
                </RegisterButton>
              </ButtonsWrapper>
              <Footer></Footer>
            </RegisterForm>
          </Left>
          <Middle></Middle>
          <Right image={sideImage}>

          </Right>
      </Wrapper>
    </Container>
  )
}

Register.proptypes = {
  finishLoading: PropTypes.func.isRequired
}

export { Register }; 