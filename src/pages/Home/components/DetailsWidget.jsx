import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import BlankProfilePicture from '../../../assets/Blank-profile-image.gif'

const Widget = styled.div`
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
  display: flex;
  margin: 20px;
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  background-color: #ffffff;

  @media only screen and (max-width: 800px) {
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 2;
    grid-row-end: 3;
  }
`

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`

const WidgetHeader = styled.div`
  padding: 10px;
  background-color: #00b8fe;
  color: #ffffff;
`

const WidgetBody = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
`

const Inputs = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

const FirstRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`

const ProfilePicture = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`

const Input = styled.input`
  font-size: 16px;
  color: #000000;
  line-height: 1.2;
  display: block;
  height: 45px;
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  border-bottom: 2px solid rgba(0,0,0,0.24);
  margin-bottom: 10px;
`

const Name = styled.div`
  display: flex;
`

const Firstname = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-right: 5px;
`

const Lastname = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: 5px;
`

const Contact = styled.div`
  display: flex;
`

const Mobile = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-right: 5px;
`

const Email = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: 5px;
`

const SaveButton = styled.button`
  min-width: 200px;
  min-height: 60px;
  background-color: #4CAF50;
  color: #ffffff;
  border: none;
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);

  &:disabled {
    background-color: #cccccc;
  }
`


const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 110px;
  height: 34px;
`

const ToggleButton = styled.input`
  display:none;

  &:checked {

  }

  &:focus {

  }
`

const Slider = styled.div`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #FFC0CB;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 50%;
  }

  ${ToggleButton}:checked + & {
    background-color: #89CFF0;
  }

  ${ToggleButton}:focus + & {
    box-shadow: 0 0 1px #2196F3;
  }

  ${ToggleButton}:checked + &:before {
    -webkit-transform: translateX(75px);
    -ms-transform: translateX(75px);
    transform: translateX(75px);
  }

  &:after {
   content:'Female';
   color: white;
   display: block;
   position: absolute;
   transform: translate(-50%,-50%);
   top: 50%;
   left: 50%;
   font-size: 10px;
   font-family: Verdana, sans-serif;
  }

  ${ToggleButton}:checked + &:after
  {  
    content:'Male';
  }
`

class DetailsWidget extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      profilePicture: this.props.photoURL,
      originalGender: this.props.gender,
      originalFirstname: this.props.firstname ? this.props.firstname : "",
      originalLastname: this.props.lastname ? this.props.lastname : "",
      originalMobile: this.props.phoneNumber ? this.props.phoneNumber : "",
      originalEmail: this.props.email ? this.props.email : "",
      gender: this.props.gender,
      firstname: this.props.firstname ? this.props.firstname : "",
      lastname: this.props.lastname ? this.props.lastname : "",
      mobile: this.props.phoneNumber ? this.props.phoneNumber : "",
      email: this.props.email ? this.props.email : "",
      saveDisabled: true
    };

    this.changeGender = this.changeGender.bind(this)
    this.changeFirstname = this.changeFirstname.bind(this)
    this.changeLastname = this.changeLastname.bind(this)
    this.changeMobile = this.changeMobile.bind(this)
    this.changeEmail = this.changeEmail.bind(this)
    this.isOriginal = this.isOriginal.bind(this)
  }

  componentDidMount() {

  }

  changeGender(e) {
    let _saveDisabled = false
    if(this.isOriginal(!this.state.gender)) {
      _saveDisabled = true
    }

    this.setState({
      gender: !this.state.gender, 
      saveDisabled: _saveDisabled
    })
  }

  changeFirstname(e) {
    let _saveDisabled = false
    if(this.isOriginal(null, e.target.value)) {
      _saveDisabled = true
    }
    this.setState({
      firstname: e.target.value,
      saveDisabled: _saveDisabled
    });
  }

  changeLastname(e) {
    let _saveDisabled = false
    if(this.isOriginal(null,null, e.target.value)) {
      _saveDisabled = true
    }
    this.setState({
      lastname: e.target.value,
      saveDisabled: _saveDisabled
    });
  }

  changeMobile(e) { 
    let value = parseInt(e.target.value) ? parseInt(e.target.value) : ""
    value = value != NaN ? value: ""

    let _saveDisabled = false
    if(this.isOriginal(null, null, null, value)) {
      _saveDisabled = true
    }
    this.setState({
      mobile: value,
      saveDisabled: _saveDisabled
    });
  }

  changeEmail(e) {
    let _saveDisabled = false
    if(this.isOriginal(null, null, null, null, e.target.value)) {
      _saveDisabled = true
    }
    this.setState({
      email: e.target.value,
      saveDisabled: _saveDisabled
    });
  }

  isOriginal(
              gender = null,
              firstname = null,
              lastname = null,
              mobile = null,
              email = null
            )
  {
    let originalGender = this.state.originalGender
    let originalFirstname = this.state.originalFirstname
    let originalLastname = this.state.originalLastname
    let originalMobile = this.state.originalMobile
    let originalEmail = this.state.originalEmail
    gender = gender != null ? gender : this.state.gender
    firstname = firstname != null ? firstname : this.state.firstname
    lastname = lastname != null  ? lastname : this.state.lastname
    mobile = mobile != null ? mobile : this.state.mobile
    email = email != null ? email : this.state.email

    if(originalGender === gender && 
       originalFirstname === firstname && 
       originalLastname === lastname && 
       originalMobile === mobile && 
       originalEmail === email) 
    {
      return true
    } else {
      return false
    }
  }

  render () {
    return(
      <Widget>
        <Content>
          <WidgetHeader>
            Your Details
          </WidgetHeader>
          <WidgetBody>
            <Inputs>
              <FirstRow>
                <ProfilePicture src={this.state.profilePicture ? this.state.profilePicture : BlankProfilePicture}>
                </ProfilePicture>
                <Switch>
                  <ToggleButton type="checkbox" defaultChecked={this.state.gender} onChange={this.changeGender} />
                  <Slider></Slider>
                </Switch>
              </FirstRow>
              <Name>
                <Firstname>
                  <label>Firstname</label>
                  <Input type="text" value={this.state.firstname} onChange={this.changeFirstname} />
                </Firstname>
                <Lastname>
                  <label>Lastname</label>
                  <Input type="text" value={this.state.lastname} onChange={this.changeLastname} />
                </Lastname>
              </Name>
              <Contact>
                <Mobile>
                  <label>Mobile</label>
                  <Input type="tel" pattern="[0-9]{8}" value={this.state.mobile} onChange={this.changeMobile} />
                </Mobile>
                <Email>
                  <label>Email</label>
                  <Input type="email" value={this.state.email} onChange={this.changeEmail} />
                </Email>
              </Contact>
            </Inputs>
            <SaveButton disabled={this.state.saveDisabled}> Save </SaveButton>
          </WidgetBody>
        </Content>
      </Widget>
    )
  }
}

DetailsWidget.propTypes = {
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  gender: PropTypes.bool,
  email: PropTypes.string.isRequired,
  phoneNumber: PropTypes.string,
  photoURL: PropTypes.string,
}

function mapStateToProps(state) {
    const { firstname, lastname, gender, email, phoneNumber, photoURL } = state.authentication.user;
    return {
        firstname,
        lastname,
        gender,
        email,
        phoneNumber,
        photoURL,
    };
}

const connectedDetailsWidget = connect(mapStateToProps)(DetailsWidget);
export { connectedDetailsWidget as DetailsWidget };