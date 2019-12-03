import React, {useState, useContext} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { FirebaseContext, AddDocument } from './../../../sharedComponents/Firebase';

import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  border-bottom: 1px solid #e1e1e1;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

const Info = styled.div`
  border-bottom: 1px solid #e1e1e1;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

const TitleWrapper = styled.div`
  display: flex;
  margin-top 15px;
`

const Title = styled.label`
  padding: 7px 15px 7px 15px;
  width: 100px;
  min-width: 100px;
`

const TitleInput = styled.input`
  width: 100%;
  margin: 0px 15px 0px 15px;
  border: 1px solid rgb(238,238,238);
`

const DescriptionWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  margin-top 15px;
  margin-bottom 15px;
`

const Description = styled.label`
  padding: 7px 15px 7px 15px;
  width: 100px;
  min-width: 100px;
`

const DescriptionArea = styled.textarea`
  width: 100%;
  margin: 0px 15px 0px 15px;
  border: 1px solid rgb(238,238,238);
  resize: none;
`

const Action = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e1e1e1;
  margin-top: 24px;
  padding: 16px;
  background-color: #fafafa;
`

const Submit = styled.button`
  border-radius: 3px;
  padding: 6px 10px;
  font-size: 14px;
  font-weight: 400;
`

const Cancel = styled.button`
  border-radius: 3px;
  padding: 6px 10px;
  font-size: 14px;
  font-weight: 400;
`

const CreateTask = (props) => {
  const firebase = useContext(FirebaseContext)

  const products = useSelector(state => state.product.products)
  const selectedProduct = useSelector(state => state.product.selectedProduct)

  const [submitDisabled, setSubmitDisabled] = useState(true)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const onChangeTitle = (e) => {
    setTitle(e.target.value)
    setSubmitDisabled(e.target.value === "" ? true : false)
  }

  const onChangeDescription = (e) => {
    setDescription(e.target.value)
  }

  const sendTask = async () => {
    let task = {
      title: title,
      description: description,
      status: "OPEN",
      timestamp: firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp()
    }
    await AddDocument(firebase, "products/" + products[selectedProduct].id + "/stories/" + props.issueId + "/tasks", task)
    props.exit()
  }

  return(
    <Wrapper>
      <Header>
        <h3>New Task</h3>
      </Header>
      <Body>
        <Info>
          <TitleWrapper>
            <Title>Title</Title>
            <TitleInput placeholder="Title" 
                        value={title} 
                        onChange={onChangeTitle} />
          </TitleWrapper>
          <DescriptionWrapper>
            <Description>Description</Description>
            <DescriptionArea placeholder="Write a comment..." 
                             value={description} 
                             onChange={onChangeDescription} />
          </DescriptionWrapper>
        </Info>
        <Action>
          <Submit disabled={submitDisabled} onClick={(e) => sendTask()}>
            Submit task
          </Submit>
          <Cancel onClick={(e) => props.exit()}>
            Cancel
          </Cancel>
        </Action>
      </Body>
    </Wrapper>
  )
}

CreateTask.propTypes = {
  issueId: PropTypes.string.isRequired,
  exit: PropTypes.func.isRequired
}

export { CreateTask }; 