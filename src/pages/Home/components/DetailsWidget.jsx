import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
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
  -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  border-radius: 5px;
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

const DetailsWidget = (props) => {
  const Gfirstname = useSelector(state => state.authentication.user.firstname)
  const Glastname = useSelector(state => state.authentication.user.lastname)
  const Ggender = useSelector(state => state.authentication.user.gender)
  const Gemail = useSelector(state => state.authentication.user.email)
  const GphoneNumber = useSelector(state => state.authentication.user.phoneNumber)
  const GphotoURL = useSelector(state => state.authentication.user.photoURL)

  const [profilePicture, setProfilePicture] = useState(GphotoURL)
  const [originalGender, setOriginalGender] = useState(Ggender)
  const [originalFirstname, setOriginalFirstname] = useState(Gfirstname ? Gfirstname : "")
  const [originalLastname, setOriginalLastname] = useState(Glastname ? Glastname : "")
  const [originalMobile, setOriginalMobile] = useState(GphoneNumber ? GphoneNumber : "")
  const [originalEmail, setOriginalEmail] = useState(Gemail ? Gemail : "")
  const [gender, setGender] = useState(Ggender)
  const [firstname, setFirstname] = useState(Gfirstname ? Gfirstname : "")
  const [lastname, setLastname] = useState(Glastname ? Glastname : "")
  const [mobile, setMobile] = useState(GphoneNumber ? GphoneNumber : "")
  const [email, setEmail] = useState(Gemail ? Gemail : "")
  const [saveDisabled, setSaveDisabled] = useState(true)

  const changeGender = (e) => {
    let _saveDisabled = false
    if(isOriginal(!gender)) {
      _saveDisabled = true
    }

    setGender(!gender)
    setSaveDisabled(_saveDisabled)
  }

  const changeFirstname = (e) => {
    let _saveDisabled = false
    if(isOriginal(null, e.target.value)) {
      _saveDisabled = true
    }

    setFirstname(e.target.value)
    setSaveDisabled(_saveDisabled)
  }

  const changeLastname = (e) => {
    let _saveDisabled = false
    if(isOriginal(null,null, e.target.value)) {
      _saveDisabled = true
    }

    setLastname(e.target.value)
    setSaveDisabled(_saveDisabled)
  }

  const changeMobile = (e) => { 
    let value = parseInt(e.target.value) ? parseInt(e.target.value) : ""
    value = value != NaN ? value: ""

    let _saveDisabled = false
    if(isOriginal(null, null, null, value)) {
      _saveDisabled = true
    }

    setMobile(value)
    setSaveDisabled(_saveDisabled)
  }

  const changeEmail = (e) => {
    let _saveDisabled = false
    if(isOriginal(null, null, null, null, e.target.value)) {
      _saveDisabled = true
    }

    setEmail(e.target.value)
    setSaveDisabled(_saveDisabled)
  }

  const isOriginal = (
              _gender = null,
              _firstname = null,
              _lastname = null,
              _mobile = null,
              _email = null
            ) =>
  {
    _gender = _gender != null ? _gender : gender
    _firstname = _firstname != null ? _firstname : firstname
    _lastname = _lastname != null  ? _lastname : lastname
    _mobile = _mobile != null ? _mobile : mobile
    _email = _email != null ? _email : email

    if(originalGender === _gender && 
       originalFirstname === _firstname && 
       originalLastname === _lastname && 
       originalMobile === _mobile && 
       originalEmail === _email) 
    {
      return true
    } else {
      return false
    }
  }

  return(
    <Widget>
      <Content>
        <WidgetHeader>
          Your Details
        </WidgetHeader>
        <WidgetBody>
          <Inputs>
            <FirstRow>
              <ProfilePicture src={profilePicture ? profilePicture : BlankProfilePicture}>
              </ProfilePicture>
              <Switch>
                <ToggleButton type="checkbox" defaultChecked={gender} onChange={changeGender} />
                <Slider></Slider>
              </Switch>
            </FirstRow>
            <Name>
              <Firstname>
                <label>Firstname</label>
                <Input type="text" value={firstname} onChange={changeFirstname} />
              </Firstname>
              <Lastname>
                <label>Lastname</label>
                <Input type="text" value={lastname} onChange={changeLastname} />
              </Lastname>
            </Name>
            <Contact>
              <Mobile>
                <label>Mobile</label>
                <Input type="tel" pattern="[0-9]{8}" value={mobile} onChange={changeMobile} />
              </Mobile>
              <Email>
                <label>Email</label>
                <Input type="email" value={email} onChange={changeEmail} />
              </Email>
            </Contact>
          </Inputs>
          <SaveButton disabled={saveDisabled}> Save </SaveButton>
        </WidgetBody>
      </Content>
    </Widget>
  )
}

export { DetailsWidget };