import React from 'react';

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
`

const DescriptionArea = styled.textarea`
  width: 100%;
  margin: 0px 15px 0px 15px;
  border: 1px solid rgb(238,238,238);
  resize: none;
`

const Options = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding-top: 15px;
`

const SprintWrapper = styled.div`

`

const Sprint = styled.label`

`

const SprintSelect = styled.select`
  min-width: 80px;
`

const LabelsWrapper = styled.div`

`

const Labels = styled.label`

`

const LabelsSelect = styled.select`
  min-width: 80px;
`

const Option = styled.option`
  width: 100%;
`

const DueDateWrapper = styled.div`

`

const DueDate = styled.label`

`

const DateInput = styled.input`

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
      dueDate: new Date().toLocaleString("en-GB", {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, year: "numeric", month: "2-digit", day: "2-digit"}).split("/").reverse().join("-"),
      selectedSprint: 0,
      selectedLabels: [],
      submitDisabled: true
    }
    this.onChangeTitle = this.onChangeTitle.bind(this)
    this.onChangeDescription = this.onChangeDescription.bind(this)
    this.onChangeDueDate = this.onChangeDueDate.bind(this)
    this.onChangeSprintSelect = this.onChangeSprintSelect.bind(this)
    this.onChangeLabelsSelect = this.onChangeLabelsSelect.bind(this)
  }

  componentDidMount() {

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

  onChangeDueDate(e) {
    this.setState({dueDate: e.target.value})
  }

  onChangeSprintSelect(e) {
    this.setState({selectedSprint: e.target.value})
  }

  onChangeLabelsSelect(e) {
    let newVal = event.target.value
    let stateVal = this.state.selectedLabels

    let selectedValue = [...e.target.options].filter(o => o.selected).map(o => o.value)
    this.setState({selectedLabels: selectedValue})
  }

  createIssue() {
    let sprint = this.props.sprints.length <= this.state.selectedSprint ? null : this.props.sprints[this.state.selectedSprint]
    let labels = this.state.selectedLabels.map(i => this.props.labels[i])
    let dueDate = new Date(this.state.dueDate)
    let issue = {
      title: this.state.title,
      description: this.state.description,
      dueDate: dueDate,
      labels: labels,
      sprint: sprint,
      status: "OPEN",
    }

    this.props.sendIssue(issue)
  }

  render () {
    return (
      <Wrapper>
        <Header>
          <h3>New Issue</h3>
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
            <SprintWrapper>
              <Sprint>Sprint</Sprint>
              <SprintSelect onChange={this.onChangeSprintSelect} defaultValue={this.state.selectedSprint}>
                <Option disabled></Option>
              </SprintSelect>
            </SprintWrapper>
            <LabelsWrapper>
              <Labels>Labels</Labels>
              <LabelsSelect multiple onChange={this.onChangeLabelsSelect} defaultValue={this.state.selectedLabels}>
                <Option disabled></Option>
                {
                  this.props.labels && this.props.labels.map((label, index) => <Option key={index} value={index}>{label}</Option>)
                }
              </LabelsSelect>
            </LabelsWrapper>
            <DueDateWrapper>
              <DueDate>Due Date</DueDate>
              <DateInput type="date" value={this.state.dueDate} onChange={this.onChangeDueDate} min={new Date().toLocaleString("en-GB", {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, year: "numeric", month: "2-digit", day: "2-digit"}).split("/").reverse().join("-")} />
            </DueDateWrapper>
          </Options>
          <Action>
            <Submit disabled={this.state.submitDisabled} onClick={(e) => this.createIssue()}>Submit issue</Submit>
            <Cancel onClick={(e) => this.props.exit()}>Cancel</Cancel>
          </Action>
        </Body>
      </Wrapper>
    )
  }
}