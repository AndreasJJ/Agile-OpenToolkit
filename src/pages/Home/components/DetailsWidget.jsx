import React, {useState, useEffect, useContext} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { alertActions } from '../../../state/actions/alert';
import { userActions } from '../../../state/actions/user';

import { FirebaseContext, UpdateDocument } from '../../../sharedComponents/Firebase';
import Modal from '../../../sharedComponents/Modal';
import {ReAuthenticate} from '../../../sharedComponents/ReAuthenticate';

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

const DetailsWidget = (props) => {
  // Firebase
  const firebase = useContext(FirebaseContext)

  // Redux dispatch
  const dispatch = useDispatch()

  // Redux state
  const user = useSelector(state => state.authentication.user)
  const Gfirstname = useSelector(state => state.authentication.user.firstname)
  const Glastname = useSelector(state => state.authentication.user.lastname)
  const Gemail = useSelector(state => state.authentication.user.email)
  const GphoneNumber = useSelector(state => state.authentication.user.phoneNumber)
  const GphotoURL = useSelector(state => state.authentication.user.photoURL)
  const uid = useSelector(state => state.authentication.user.uid)

  // Original state
  const [originalFirstname, setOriginalFirstname] = useState(Gfirstname ? Gfirstname : "")
  const [originalLastname, setOriginalLastname] = useState(Glastname ? Glastname : "")
  const [originalMobile, setOriginalMobile] = useState(GphoneNumber ? GphoneNumber : "")
  const [originalEmail, setOriginalEmail] = useState(Gemail ? Gemail : "")
  // Current state (mutable)
  const [profilePicture, setProfilePicture] = useState(GphotoURL)
  const [firstname, setFirstname] = useState(Gfirstname ? Gfirstname : "")
  const [lastname, setLastname] = useState(Glastname ? Glastname : "")
  const [mobile, setMobile] = useState(GphoneNumber ? GphoneNumber : "")
  const [email, setEmail] = useState(Gemail ? Gemail : "")
  const [saveDisabled, setSaveDisabled] = useState(true)
  const [showModal, setShowModal] = useState(false)

  // Function to save account details to database and update auth object
  const saveDetails = async () => {
    try {
      // Update firebase authentication user's email
      if(email !== originalEmail) {
        await firebase.doUpdateEmail(email)
      }
      // New try catch do dispaly error instead of modal on error
      try {
        // Updated user details
        let userDetails = {
          firstname: firstname,
          lastname: lastname,
          email: email,
          mobile: mobile
        }
        // Update firestore database user object
        await UpdateDocument(firebase, "/users/" + uid, userDetails)
        // Dispatch alert to tell user that it was successful
        dispatch(alertActions.success("User details successfully updated."))

        // Update state to reflect the new user details
        setOriginalFirstname(firstname)
        setOriginalLastname(lastname)
        setOriginalEmail(email)
        setOriginalMobile(mobile)
        setSaveDisabled(true)

        // Update Redux
        user.firstname = firstname
        user.lastname = lastname
        user.email = email
        user.mobile = mobile
        dispatch(userActions.setUser(user))
      } catch(err) {
        dispatch(alertActions.error(err.message))
      }
    } catch(err) {
      setShowModal(true)
    }
  }

  // Function to update firstname state
  const changeFirstname = (e) => {
    // Enable save button if current state isnt equal to original state
    let _saveDisabled = false
    if(isOriginal(e.target.value)) {
      _saveDisabled = true
    }

    // Update state
    setFirstname(e.target.value)
    setSaveDisabled(_saveDisabled)
  }

  // Function to update lastname state
  const changeLastname = (e) => {
    // Enable save button if current state isnt equal to original state
    let _saveDisabled = false
    if(isOriginal(null, e.target.value)) {
      _saveDisabled = true
    }

    // Update state
    setLastname(e.target.value)
    setSaveDisabled(_saveDisabled)
  }

  // Function to update mobile state
  const changeMobile = (e) => { 
    // If the mobile number isnt a valid number (int) then set it equal to an empty string
    let value = parseInt(e.target.value) ? parseInt(e.target.value) : ""
    value = value != NaN ? value: ""

    // Enable save button if current state isnt equal to original state
    let _saveDisabled = false
    if(isOriginal(null, null, value)) {
      _saveDisabled = true
    }

    // Update state
    setMobile(value)
    setSaveDisabled(_saveDisabled)
  }

  // Function to update email state
  const changeEmail = (e) => {
    // Enable save button if current state isnt equal to original state
    let _saveDisabled = false
    if(isOriginal(null, null, null, e.target.value)) {
      _saveDisabled = true
    }

    // Update state
    setEmail(e.target.value)
    setSaveDisabled(_saveDisabled)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  // Checks wether any of the user info (state) has been changed 
  // (that the displayed state is not equal the original state)
  const isOriginal = (
              _firstname = null,
              _lastname = null,
              _mobile = null,
              _email = null
            ) =>
  {
    _firstname = _firstname != null ? _firstname : firstname
    _lastname = _lastname != null  ? _lastname : lastname
    _mobile = _mobile != null ? _mobile : mobile
    _email = _email != null ? _email : email
    
    if(originalFirstname === _firstname && 
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
      {
        showModal
        ?
          <Modal content={<ReAuthenticate finished={closeModal} />} 
                 minWidth={"400px"} 
                 maxWidth={"600px"}
                 exitModalCallback={closeModal}
          />
        :
          null
      }
      <Content>
        <WidgetHeader>
          Account Details
        </WidgetHeader>
        <WidgetBody>
          <Inputs>
            <FirstRow>
              <ProfilePicture src={profilePicture ? profilePicture : BlankProfilePicture} />
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
          <SaveButton disabled={saveDisabled} onClick={saveDetails}> Save </SaveButton>
        </WidgetBody>
      </Content>
    </Widget>
  )
}

export { DetailsWidget };