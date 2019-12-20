import React, {useContext, useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Comment } from './Comment';

import { FirebaseContext, GetDocuments, AddDocument } from '../../../sharedComponents/Firebase';

import styled from 'styled-components';

const CommentSection = styled.div`
    display: flex;
    flex-direction: column;
`

const NewComment = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 5px;
  -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  border-radius: 0px 0px 5px 5px;
  background-color: #ffffff;
`

const TextArea = styled.textarea`
  resize: none;
  width: 100%;
  min-height: 140px;
  flex-grow: 1;
`

const SubmitButton = styled.button`
  padding: 6px 10px 6px 10px;
  color: #ffffff;
  border-radius: 3px;
  background-color: #1aaa55;
  margin-top: 5px;
  width: fit-content;
`

const Comments = ({productId, storyId}) => {
    // Firebase
    const firebase = useContext(FirebaseContext)

    // Redux state
    const uid = useSelector(state => state.authentication.user.uid)
    const firstname = useSelector(state => state.authentication.user.firstname)
    const lastname = useSelector(state => state.authentication.user.lastname)

    // State
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")

    // Constructor
    useEffect(() => {
        const init = async () => {
            // Get comments
            await fetchComments()
        }
        init()
    }, [])

    // Fetch comments from database and update state
    const fetchComments = async () => {
        let documents = await GetDocuments(firebase, "/products/" + productId + "/stories/" + storyId + "/comments")
        setComments(documents)
    }

    // Add comment to database
    const addComment = async () => {
        // New comment data
        let _newComment = {
            creator: {
                firstname: firstname,
                lastname: lastname,
                uid: uid
            },
            text: newComment,
            timestamp: firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp()
        }
        // Add comment to database or throw error, clear textarea and fetch comments again
        try {
            await AddDocument(firebase, "/products/" + productId + "/stories/" + storyId + "/comments", _newComment)
            setNewComment("")
            await fetchComments()
        } catch {
            //TODO: Add error handling
        } 
    }

    const onNewCommentChange = (e) => {
        setNewComment(e.target.value)
    }

    return (
        <CommentSection>
            {
                comments && comments.map((comment, index) => 
                    <Comment creator={comment.creator} text={comment.text} timestamp={comment.timestamp} />
                )
            }
            <NewComment>
                <TextArea value={newComment} onChange={onNewCommentChange} />
                <SubmitButton onClick={addComment}>Comment</SubmitButton>
            </NewComment>
        </CommentSection>
    )
}

Comments.propTypes = {
    productId: PropTypes.string.isRequired
}

export {
    Comments
}