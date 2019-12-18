import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import { DateToLocalString } from '../../../sharedComponents/Utility';

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
  min-width: 100px;
`

const DescriptionArea = styled.textarea`
  width: 100%;
  margin: 0px 15px 0px 15px;
  border: 1px solid rgb(238,238,238);
  resize: none;
`

const Options = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`

const DateWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-top: 15px;
`

const DateLabel = styled.label`
  padding: 7px 15px 7px 15px;
  min-width: 100px;
`

const DateInput = styled.input`
  flex-grow: 1;
  margin: 0px 15px 0px 15px;
  border: 1px solid rgb(238,238,238);
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

const CreateIssue = (props) => {
  // State
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState(DateToLocalString(new Date()))
  const [dueDate, setDueDate] = useState(DateToLocalString(new Date(new Date().setDate((new Date).getDate() + 1))))
  const [submitDisabled, setSubmitDisabled] = useState(true)

  // On title change
  const onChangeTitle = (e) => {
    let isSubmitDisabled = false

    if(e.target.value === "") {
      isSubmitDisabled = true
    } 

    setTitle(e.target.value)
    setSubmitDisabled(isSubmitDisabled)
  }

  // On description change
  const onChangeDescription = (e) => {
    setDescription(e.target.value)
  }

  // On start date change
  const onChangeStartDate = (e) => {
    if(new Date(e.target.value) >= new Date(dueDate)) {
      setDueDate(DateToLocalString(new Date(new Date().setDate((new Date(e.target.value)).getDate() + 1))))
    } 

    setStartDate(e.target.value)
  }

  // On due date change
  const onChangeDueDate = (e) => {
    setDueDate(e.target.value)
  }

  // Add sprint
  const sendSprint = async () => {
    // Sprint data
    let sprint = {
      title: title,
      description: description,
      startDate: new Date(startDate),
      dueDate: new Date(dueDate)
    }
    // Add sprint to database
    await props.createSprint(sprint)
    props.exit()
  }

  return (
    <Wrapper>
      <Header>
        <h3>New Sprint</h3>
      </Header>
      <Body>
        <Info>
          <TitleWrapper>
            <Title>Title</Title>
            <TitleInput placeholder="Title" value={title} onChange={onChangeTitle} />
          </TitleWrapper>
          <DescriptionWrapper>
            <Description>Description</Description>
            <DescriptionArea placeholder="Write a comment..." value={description} onChange={onChangeDescription} />
          </DescriptionWrapper>
        </Info>
        <Options>
          <DateWrapper>
            <DateLabel>Start Date</DateLabel>
            <DateInput type="date" value={startDate} onChange={onChangeStartDate} min={DateToLocalString(new Date())} />
          </DateWrapper>
          <DateWrapper>
            <DateLabel>Due Date</DateLabel>
            <DateInput type="date" value={dueDate} onChange={onChangeDueDate} min={DateToLocalString(new Date(new Date().setDate((new Date(startDate)).getDate() + 1)))} />
          </DateWrapper>
        </Options>
        <Action>
          <Submit disabled={submitDisabled} onClick={(e) => sendSprint()}>Submit sprint</Submit>
          <Cancel onClick={(e) => props.exit()}>Cancel</Cancel>
        </Action>
      </Body>
    </Wrapper>
  )
}

CreateIssue.proptypes = {
  exit: PropTypes.func.isRequired,
  createSprint: PropTypes.func.isRequired
}

export default CreateIssue