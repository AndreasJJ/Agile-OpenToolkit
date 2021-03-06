import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

const Background = styled.div `
    z-index: 1000;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0,  0.5);
    display:flex;
    justify-content:center;
    align-items:center;
`
const Content = styled.div `
    z-index: 1001;
    background-color: white;
    width: 60%;
    height: 60%;
    max-width: ${props => props.maxWidth ? props.maxWidth : "800px"};
    min-width: ${props => props.minWidth ? props.minWidth : "500px"};
    min-height: ${props => props.minHeight ? props.minHeight : "510px"};
    border-radius: 6px;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    @media only screen and (max-width: 500px) {
        border-radius: 0;
        min-width: 100%;
    }
`
// Modal (pop-up) component
const Modal = (props) => {
    /* 
     * Makes it possible to click the modal without triggering the action that happens
     * when you click the background (which usually is to close the modal)
     */
    const stopBackgroundCall = (e) => {
        e.stopPropagation();
    }

    return (
        <Background onClick={props.exitModalCallback}>
            <Content minWidth={props.minWidth} 
                     maxWidth={props.maxWidth} 
                     minHeight={props.minHeight} 
                     onClick={stopBackgroundCall}
            >
                {props.title ? <h1>{props.title}</h1> : null}
                {props.content ? (props.content instanceof String ? <p>{props.content}</p> : props.content) : null}
            </Content>
        </Background>
    )
}

Modal.proptypes = {
    exitModalCallback: PropTypes.func.isRequired,
    minWidth: PropTypes.string.isRequired,
    maxWidth: PropTypes.string.isRequired,
    minHeight: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.element
            ])

}

export default Modal;