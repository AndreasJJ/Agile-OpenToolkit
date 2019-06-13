import React from 'react';

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

/* eslint-disable react/prefer-stateless-function */
export default class CreateNewTeam extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {

  }

  render () {
    return(
      <Wrapper>
         <Header>
           Create New Team
         </Header>
         <Form>
           <InputWrapper>
             <label>Team Name</label>
             <Input placeholder="Fiery Devils" />
             <label>Short Description</label>
             <Input placeholder="A team with real spirit." />
             <label>Add Members</label>
             <TagsInput />
           </InputWrapper>
           <ButtonWrapper>
             <SubmitButton> Create Team! </SubmitButton>
           </ButtonWrapper>
         </Form>
      </Wrapper>
    )
  }
}