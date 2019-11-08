import React from 'react';
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
  border-radius: 3px
  padding: 6px 10px;
  font-size: 14px;
  font-weight: 400;
`

const Cancel = styled.button`
  border-radius: 3px
  padding: 6px 10px;
  font-size: 14px;
  font-weight: 400;
`

export default class CreateIssue extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      startDate: DateToLocalString(new Date()),
      dueDate: DateToLocalString(new Date(new Date().setDate((new Date).getDate() + 1))),
      submitDisabled: true
    }
    this.onChangeTitle = this.onChangeTitle.bind(this)
    this.onChangeDescription = this.onChangeDescription.bind(this)
    this.onChangeStartDate = this.onChangeStartDate.bind(this)
    this.onChangeDueDate = this.onChangeDueDate.bind(this)
    this.sendSprint = this.sendSprint.bind(this)
  }

  onChangeTitle(e) {
    let isSubmitDisabled = false
    if(e.target.value === "") {
      isSubmitDisabled = true
    } 

    this.setState({title: e.target.value, submitDisabled: isSubmitDisabled})
  }

  onChangeDescription(e) {
    this.setState({description: e.target.value})
  }

  onChangeStartDate(e) {
    if(new Date(e.target.value) >= new Date(this.state.dueDate)) {
      this.setState({dueDate: DateToLocalString(new Date(new Date().setDate((new Date(e.target.value)).getDate() + 1)))})
    } 
    this.setState({startDate: e.target.value})
  }

  onChangeDueDate(e) {
    this.setState({dueDate: e.target.value})
  }

  async sendSprint() {
    let sprint = {
      title: this.state.title,
      description: this.state.description,
      startDate: new Date(this.state.startDate),
      dueDate: new Date(this.state.dueDate)
    }
    await this.props.createSprint(sprint)
    this.props.exit()
  }

  render () {
    return (
      <Wrapper>
        <Header>
          <h3>New Sprint</h3>
        </Header>
        <Body>
          <Info>
            <TitleWrapper>
              <Title>Title</Title>
              <TitleInput placeholder="Title" value={this.state.title} onChange={this.onChangeTitle} />
            </TitleWrapper>
            <DescriptionWrapper>
              <Description>Description</Description>
              <DescriptionArea placeholder="Write a comment..." value={this.state.description} onChange={this.onChangeDescription} />
            </DescriptionWrapper>
          </Info>
          <Options>
            <DateWrapper>
              <DateLabel>Start Date</DateLabel>
              <DateInput type="date" value={this.state.startDate} onChange={this.onChangeStartDate} min={DateToLocalString(new Date())} />
            </DateWrapper>
            <DateWrapper>
              <DateLabel>Due Date</DateLabel>
              <DateInput type="date" value={this.state.dueDate} onChange={this.onChangeDueDate} min={DateToLocalString(new Date(new Date().setDate((new Date(this.state.startDate)).getDate() + 1)))} />
            </DateWrapper>
          </Options>
          <Action>
            <Submit disabled={this.state.submitDisabled} onClick={(e) => this.sendSprint()}>Submit sprint</Submit>
            <Cancel onClick={(e) => this.props.exit()}>Cancel</Cancel>
          </Action>
        </Body>
      </Wrapper>
    )
  }
}

CreateIssue.proptypes = {
  exit: PropTypes.func.isRequired,
  createSprint: PropTypes.func.isRequired
}