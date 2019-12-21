import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import { FsTsToDate, getPrettyCreationDate } from '../../../sharedComponents/Utility';

import styled from 'styled-components';

import {DotsHorizontalRounded} from 'styled-icons/boxicons-regular/DotsHorizontalRounded';

const CommentContainer = styled.div`
    width: 100%;
    margin-bottom: 10px;
    box-sizing: border-box;
    -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
    -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
    box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
    background-color: #ffffff;
    position: relative;

    &:first-child {
        margin-top: 10px;
    }

    &::after {
        position: absolute;
        left: 20px;
        display: block;
        width: 3px;
        content: "";
        background-color: #cbced2;
        height: 10px;
    }
`

const Commenter = styled.div`
    border-bottom: 1px solid #e8e8e8;
    padding: 10px;
`

const CommenterName = styled.span`
    font-weight: bold;
`

const CommentText = styled.div`
    padding: 10px;
`

const Comment = ({creator, text, timestamp}) => {
    return (
        <CommentContainer>
            <Commenter>
                <CommenterName>
                    {creator.firstname.substring(0,1).toUpperCase() + 
                        creator.firstname.substring(1) + 
                        " " + 
                        creator.lastname
                    }
                </CommenterName>
                <span>
                    &nbsp;commented&nbsp;
                    {getPrettyCreationDate(FsTsToDate(timestamp))}
                </span>
            </Commenter>
            <CommentText>
                {text}
            </CommentText>
        </CommentContainer>
    )
}

Comment.propTypes = {
    creator: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired
}

export {
    Comment
}