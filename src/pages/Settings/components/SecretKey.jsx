import React, {useState, useContext} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import {FirebaseContext, GetDocument} from '../../../sharedComponents/Firebase';
import { alertActions } from '../../../state/actions/alert';

import styled from 'styled-components';

const Input = styled.input`
    width: 100%;
    max-width: 600px;
    height: 30px;
`

const Controlls = styled.div`
    display: flex;
    margin-bottom 5px;
`

const Button = styled.button`
    border-radius: 3px;
    padding: 6px 10px 6px 10px;
    height: 100%;
`

const ButtonMargin = styled.div`
    margin-left: 5px;
`

const ShowWrapper = styled.div`
    height: 30px;
`

const SecretKey = (props) => {
    const dispatch = useDispatch()

    const firebase = useContext(FirebaseContext)

    const products = useSelector(state => state.product.products)
    const selectedProduct = useSelector(state => state.product.selectedProduct)

    const [showingKey, setShowingKey] = useState(false)
    const [key, setKey] = useState(null)

    const getSecretKey = async () => {
        let secret = await GetDocument(firebase, "products/" + products[selectedProduct].id + "/config/secret")
        return secret[props.type]
    }

    const resetSecretKey = async () => {
        try {
            const response = await fetch("https://agiletoolkit.io/api/secret-key", {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                  'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrer: 'no-referrer',
                body: JSON.stringify(props.type)
            })
    
            return await response.json()
        } catch(err) {
            dispatch(alertActions.error(err.message))
        }
    }

    const copySecretKey = async () => {
        let _key = key
        if(!key) {
            _key = await getSecretKey()
            _key = _key ? _key : ""
            //TODO handle if no key => tell user to generate key
        }
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

    const showSecretKey = async () => {
        let key = await getSecretKey()
        setKey(key ? key : " ")
        setShowingKey(true)
    }

    const hideSecretKey = () => {
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