import React from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';

import { userActions } from '../../state/actions/user';

import styled from 'styled-components';
import {User} from 'styled-icons/fa-solid/User';
import {UnlockAlt} from 'styled-icons/fa-solid/UnlockAlt';

import bg from '../../assets/bg.png'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  background-image: ${props => "url(" + props.image + ");"}
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const Wrapper = styled.div`
  width: 500px;
  border-radius: 10px;
  overflow: hidden;
  padding: 55px 55px 37px 55px;
  background: #9152f8;
  background: -webkit-linear-gradient(top, #f87d72, #b224ef);
  -webkit-box-shadow:0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
     -moz-box-shadow:0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
          box-shadow:0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
`;

const LoginForm = styled.form`
  width: 100%;
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;

const LogoImage = styled.img`
  width: 120px;
  height: 120px;
`

const Title = styled.h1`
  font-size: 30px;
  color: #fff;
  line-height: 1.2;
  text-align: center;
  text-transform: uppercase;
  display: block;
`;

const UsernameWrapper = styled.div`
  width: 100%;
  position: relative;
  border-bottom: 2px solid rgba(255,255,255,0.24);
  margin-bottom: 30px;
  color: white;
`;

const PasswordWrapper = styled.div`
  width: 100%;
  position: relative;
  border-bottom: 2px solid rgba(255,255,255,0.24);
  margin-bottom: 30px;
  color: white;
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;


const Footer = styled.div`
  text-align: center;
  padding-top: 90px;
`;

const LoginButton = styled.button`
  font-size: 16px;
  color: #555555;
  line-height: 1.2;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  min-width: 120px;
  height: 50px;
  border-radius: 25px;
`;

const UsernameInput = styled.input`
  font-size: 16px;
  color: #fff;
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
  color: #fff;
  line-height: 1.2;
  display: block;
  width: 100%;
  height: 45px;
  background: transparent;
  padding: 0 5px 0 38px;
  border: none;
  outline: none;
`;

/* eslint-disable react/prefer-stateless-function */
class Login extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: ''
    };
    this.login = this.login.bind(this)
    this.changeUsernameInputValue = this.changeUsernameInputValue.bind(this)
    this.changePasswordInputValue = this.changePasswordInputValue.bind(this)
  }

  componentDidMount() {

  }

  login(e) {
    e.preventDefault();

    const { dispatch } = this.props;
    if (this.state.username && this.state.password) {
      dispatch(userActions.login(this.state.username, this.state.password));
    }
  }

  changeUsernameInputValue(value) {
    this.setState({
      username: value
    });
  }

  changePasswordInputValue(value) {
    this.setState({
      password: value
    });
  }

  render() {

    return (
      <Container image={bg}>
        <Wrapper>
          <LoginForm>
            <Logo>
              <LogoImage src="static/assets/logo.svg" />
            </Logo>
            <Title>Login</Title>
            <UsernameWrapper>
              <span>Username</span>
              <InputWrapper>
                <User size="1em" />
                <UsernameInput type="text" name="username" value={this.state.username} onChange={e => this.changeUsernameInputValue(e.target.value)} placeholder="Username" minlength="3" maxlength="12" required />
              </InputWrapper>
            </UsernameWrapper>
            <PasswordWrapper>
              <span>Password</span>
              <InputWrapper>
                <UnlockAlt size="1em" />
                <PasswordInput type="password" name="password" value={this.state.password} onChange={e => this.changePasswordInputValue(e.target.value)} placeholder="Password" minlength="6" maxlength="32" required />
              </InputWrapper>
            </PasswordWrapper>
            <LoginButtonWrapper>
              <LoginButton onClick={e => this.login(e)}>
                  Login
              </LoginButton>
            </LoginButtonWrapper>
            <Footer></Footer>
          </LoginForm>
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

const connectedLoginPage = connect(mapStateToProps)(Login);
export { connectedLoginPage as Login }; 