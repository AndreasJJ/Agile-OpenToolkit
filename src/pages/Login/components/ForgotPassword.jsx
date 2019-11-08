import React, {useState, useContext} from 'react';
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types';

import { alertActions } from '../../../state/actions/alert';
import {FirebaseContext} from '../../../sharedComponents/Firebase';

import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
`

const ForgotPassword = (props) => {
    const firebase = useContext(FirebaseContext)
    const dispatch = useDispatch()
    const [email, setEmail] = useState()

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            await firebase.doPasswordReset(email)
            props.finished()
        } catch(e) {
            dispatch(alertActions.error(e.message));
        }
        
    }

    const onChangeEmail = (e) => {
        setEmail(e.target.value)
    }

    return(
        <Wrapper>
            <Form onSubmit={onSubmit}>
                <label>Reset Password:</label>
                <input type="email" 
                       placeholder="example@agiletoolkit.io" 
                       value={email} 
                       onChange={onChangeEmail} 
                />
                <input type="submit" />
            </Form>
        </Wrapper>
    )
}

ForgotPassword.proptypes = {
    finished: PropTypes.func.isRequired
}

export default ForgotPassword