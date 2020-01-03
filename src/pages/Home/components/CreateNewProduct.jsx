import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { alertActions } from '../../../state/actions/alert';

import TagsInput from '../../../sharedComponents/TagsInput';

import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Header = styled.h2`
  text-align: center;
`

const Form = styled.form`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 0px;
  overflow: auto;
`

const InputWrapper = styled.div`
  padding: 20px;
`

const Input = styled.input`
  font-size: 16px;
  color: #fff;
  line-height: 1.2;
  display: block;
  width: 100%;
  height: 45px;
  background: #F4F4F4;
  outline: none;
  position: relative;
  border-style: none;
  border: 1px solid #dddfe6;
  border-radius: 4px;
  padding: 0px 10px 0px 10px;
  margin-bottom: 30px;
  color: #000000;
`

const ButtonWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  background: #F4F4F4;
  border-top: 1px solid #dddfe6;
  padding: 10px;
`

const SubmitButton = styled.button`
    min-width: 200px;
    min-height: 60px;
    background-color: #4CAF50;
    color: #ffffff;
    border: none;
    -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
    -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
    box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
`

const CreateNewProduct = (props) => {
  // Redux dispatch
  const dispatch = useDispatch()

  // State
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [members, setMembers] = useState([])

  // Add product to database
  const sendProduct = (e) => {
    e.preventDefault()

    // Trim data
    let name = productName.trim()
    let description = productDescription.trim()

    // Check that name length is over 2 characters long else dispatch error
    if(name.length < 3 ) {
      dispatch(alertActions.error('The team name has to be at least 3 characters long'));
      return
    }

    // Check that description length is over 2 characters long or is empty else dispatch error
    if(description.length < 3 && (description || description != "")) {
      dispatch(alertActions.error('The description has to either be 3 characters long or empty'));
      return
    }
    // If description is empty set it eqal to null for firestore
    if(description == "") {
      description = null
    }

    // Add to database
    props.sendProduct({name: name, description: description}, members)
    props.onclick()
  }

  const changeproductName = (e) => {
    setProductName(e.target.value)
  }

  const changeproductDescription = (e) => {
    setProductDescription(e.target.value)
  }

  const changeTags = (tags) => {
    setMembers(tags)
  }

  return(
    <Wrapper>
       <Header>
         Create New Product
       </Header>
       <Form>
         <InputWrapper>
           <label>Product Name</label>
           <Input placeholder="marvelous dog feeder" 
                  value={productName} 
                  onChange={changeproductName} />
           <label>Short Description</label>
           <Input placeholder="A product for the future." 
                  value={productDescription} 
                  onChange={changeproductDescription} />
           <label>Add Members</label>
           <TagsInput tags={members} setTags={changeTags} />
         </InputWrapper>
         <ButtonWrapper>
          <SubmitButton onClick={sendProduct}> 
           Create Product! 
          </SubmitButton>
         </ButtonWrapper>
       </Form>
    </Wrapper>
  )
}

CreateNewProduct.propTypes = {
  sendProduct: PropTypes.func.isRequired,
  onclick: PropTypes.func.isRequired
}

export { CreateNewProduct }; 