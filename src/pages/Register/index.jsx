import React from 'react';
import { connect } from 'react-redux';
import { history } from '../../state/helpers/history';

import { userActions } from '../../state/actions/user';
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
  border-radius: 6px;
  overflow: hidden;
  padding: 55px 55px 37px 55px;
  background-color: #ffffff;
  -webkit-box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.15);
     -moz-box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.15);
          box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.15);
  display: grid;
  grid-template-columns: Calc(50% - 1px) 2px Calc(50% - 1px);
  grid-template-rows: 100%;
`;

const Left = styled.div`
  padding-right: 5px;
`

const Middle = styled.div`
  border: 1px dashed #000000;
`

const Right = styled.div`
  padding-left: 5px;
  background-image: url("${props => props.image}");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
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

class Register extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      firstname: '',
      lastname: ''
    };
    this.register = this.register.bind(this)
    this.changeEmailInputValue = this.changeEmailInputValue.bind(this)
    this.changePasswordInputValue = this.changePasswordInputValue.bind(this)
    this.changeConfirmPasswordInputValue = this.changeConfirmPasswordInputValue.bind(this)
    this.validateEmail = this.validateEmail.bind(this)
    this.validateName = this.validateName.bind(this)
  }

  componentDidMount() {

  }

  register(e) {
    e.preventDefault();
    const { dispatch } = this.props;

    if(!this.validateEmail(this.state.email) || this.state.email == "") {
      console.log(this.state.email)
      dispatch(alertActions.error('Please provide a valid email'));
      return
    }

    if(this.state.firstname.length < 2 || this.state.lastname.length < 2) {
      dispatch(alertActions.error('Names need to be 2 characters or longer'));
      return
    }

    if(!this.validateName(this.state.firstname) || !this.validateName(this.state.lastname)) {
      dispatch(alertActions.error('Names can only contain letters'));
      return
    }

    if(this.state.password != this.state.confirmPassword) {
      dispatch(alertActions.error('Your password doesnt match your confirmation password'));
      return
    }

    if(this.state.password.length < 6 || this.state.confirmPassword.length < 6) {
      dispatch(alertActions.error('The password must be at least 6 characters long'));
      return
    }

    dispatch(userActions.register(this.state.email, this.state.password, this.state.firstname, this.state.lastname));
  }

  validateEmail(email) {
    let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return re.test(email);
  }

  validateName(name){
    let re = /^[a-zA-Z]+$/;
    return re.test(name);
  } 

  changeEmailInputValue(value) {
    this.setState({
      email: value
    });
  }

  changePasswordInputValue(value) {
    this.setState({
      password: value
    });
  }

  changeConfirmPasswordInputValue(value) {
    this.setState({
      confirmPassword: value
    });
  }

  changeFirstnameInputValue(value) {
    this.setState({
      firstname: value
    });
  }

  changeLastnameInputValue(value) {
    this.setState({
      lastname: value
    });
  }

  toLogin(e) {
    e.preventDefault();

    history.push('/login');
  }

  render() {

    return (
        <Container>
          <Wrapper>
            <Left>
              <RegisterForm>
                <Title>Register</Title>
                <EmailWrapper>
                  <span>Email</span>
                  <InputWrapper>
                    <Envelope size="1em" />
                    <EmailInput type="email" name="email" value={this.state.eamil} onChange={e => this.changeEmailInputValue(e.target.value)} placeholder="Email" minlength="3" maxlength="12" required />
                  </InputWrapper>
                </EmailWrapper>
                <NameWrapper>
                  <FirstnameWrapper>
                    <span>Lastname</span>
                    <InputWrapper>
                      <User size="1em" />
                      <FirstnameInput type="text" name="fistname" value={this.state.firstname} onChange={e => this.changeFirstnameInputValue(e.target.value)} placeholder="Firstname" minlength="3" required />
                    </InputWrapper>
                  </FirstnameWrapper>
                  <LastnameWrapper>
                    <span>Lastname</span>
                    <InputWrapper>
                      <User size="1em" />
                      <LastnameInput type="text" name="lastname" value={this.state.lastname} onChange={e => this.changeLastnameInputValue(e.target.value)} placeholder="Lastname" minlength="3" required />
                    </InputWrapper>
                  </LastnameWrapper>
                </NameWrapper>
                <PasswordWrapper>
                  <span>Password</span>
                  <InputWrapper>
                    <UnlockAlt size="1em" />
                    <PasswordInput type="password" name="password" value={this.state.password} onChange={e => this.changePasswordInputValue(e.target.value)} placeholder="Password" minlength="6" maxlength="32" required />
                  </InputWrapper>
                </PasswordWrapper>
                <PasswordWrapper>
                  <span>Confirm Password</span>
                  <InputWrapper>
                    <UnlockAlt size="1em" />
                    <ConfirmPasswordInput type="password" name="confirm_password" value={this.state.confirmPassword} onChange={e => this.changeConfirmPasswordInputValue(e.target.value)} placeholder="Confirm password" minlength="6" maxlength="32" required />
                  </InputWrapper>
                </PasswordWrapper>
                <ButtonsWrapper>
                  <ToLoginButton onClick={e => this.toLogin(e)}>
                    To Login
                  </ToLoginButton>
                  <RegisterButton onClick={e => this.register(e)}>
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
    );
  }
}

function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    return {
        loggingIn
    };
}

const connectedRegisterPage = connect(mapStateToProps)(Register);
export { connectedRegisterPage as Register }; 