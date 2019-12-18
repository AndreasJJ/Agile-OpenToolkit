import React, {useState, useContext} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import {FirebaseContext, GetDocument} from '../../../sharedComponents/Firebase';
import { alertActions } from '../../../state/actions/alert';

import styled from 'styled-components';

const Input = styled.input`
    width: 100%;
    max-width: 600px;
    margin: 0px;
`

const Controlls = styled.div`
    display: flex;
    margin-bottom 5px;
    height: 30px;
`

const Button = styled.button`
    border-radius: 3px;
    padding: 6px 10px 6px 10px;
    margin: 0px;
`

const ButtonMargin = styled.div`
    margin-left: 5px;
    display: flex;
`

const ShowWrapper = styled.div`
    height: 30px;
`

const SecretKey = (props) => {
    // Redux dispatch
    const dispatch = useDispatch()

    // Firebase
    const firebase = useContext(FirebaseContext)

    // Redux state
    const products = useSelector(state => state.product.products)
    const selectedProduct = useSelector(state => state.product.selectedProduct)

    // State
    const [showingKey, setShowingKey] = useState(false)
    const [key, setKey] = useState(null)

    // Get secret key from database
    const getSecretKey = async () => {
        let secret = await GetDocument(firebase, "products/" + products[selectedProduct].id + "/config/secret")
        if(secret) {
            return secret[props.type]
        }
        return null
    }

    // Get new secret key
    const resetSecretKey = async () => {
        try {
            // Data consist of which product to give new secret key and to which 3rd party app
            const data = {
                productId: products[selectedProduct].id,
                type: props.type
            }

            // Get firebase id token for request authentication
            let firebaseIdToken = await firebase.doGetIdToken(true)

            // Fetch post request
            const response = await fetch("https://agiletoolkit.io/api/secret-key", {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + firebaseIdToken
                },
                redirect: 'follow',
                referrer: 'no-referrer',
                body: JSON.stringify(data)
            })

            // parse key and update state
            let newKey = await response.json()
            setKey(newKey.key)
            setShowingKey(true)
        } catch(err) {
            // Dispatch alert on error
            dispatch(alertActions.error(err.message))
        }
    }

    // Copy secret key to clipboard
    const copySecretKey = async () => {
        let _key = key
        if(!key) {
            _key = await getSecretKey()
            _key = _key ? _key : ""
            //TODO handle if no key => tell user to generate key
        }
        // Create input element that is invisible for user and
        // copy key to clipboard
        const dummy = document.createElement("input")
        dummy.setAttribute('value', _key)
        dummy.style.width = "10px"
        dummy.style.height = "10px"
        dummy.style.opacity = 0;
        dummy.style.position = "absolute"
        document.body.appendChild(dummy)
        dummy.select()
        document.execCommand("copy")
        document.body.removeChild(dummy)
    }

    // Show the secret key
    const showSecretKey = async () => {
        // Get secret key
        let key = await getSecretKey()
        // Update secret key state
        setKey(key ? key : " ")
        setShowingKey(true)
    }

    // Hide secret key
    const hideSecretKey = () => {
        // Remove secret key from state for security reasons
        setKey(null)
        setShowingKey(false)
    }

  return (
    <div>
        <label>
            Secret Key
        </label>
        <div>
            <Controlls>
                <Input value={key ? key : "•••••••••••••••••••••••••••••••••••••••••••"} readonly />
                {
                    document.queryCommandSupported('copy') &&
                    <ButtonMargin>
                        <Button onClick={copySecretKey}>Copy</Button>
                    </ButtonMargin>
                }
                <ButtonMargin>
                    <Button onClick={resetSecretKey}>Reset</Button>
                </ButtonMargin>
            </Controlls>
            <ShowWrapper>
                {
                    showingKey
                    ?
                        <Button onClick={hideSecretKey}>
                            Hide
                        </Button>
                    :
                        <Button onClick={showSecretKey}>
                            Show
                        </Button>
                }
                
            </ShowWrapper>
        </div>
    </div>
  )
}

SecretKey.proptypes = {

}

export {
    SecretKey
}