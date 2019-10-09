import React from 'react';

import styled from 'styled-components';

const Wrapper = styled.div`
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 1;
  width: 200px;
    -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
`

const Content = styled.div`
  margin: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #e8e8e8;
`

const Info = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Value = styled.div`
  margin-top: 5px;
`

const SprintSelect = styled.select`
  width: 100%;
`

const DueDateInput = styled.input`
  width: 100%;
`

const LabelSelect = styled.select`
  width: 100%;
`

export default class Sidebar extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      editingSection: [],
      sprints: [],
      labels: [],
      selectedSprint: 0,
      dueDate: this.props.dueDate,
      selectedLabels: this.props.selectedLabels.map(label => this.state.labels.indexOf(label))
    }
    this.onChangeSprint = this.onChangeSprint.bind(this)
    this.onChangeDuedate = this.onChangeDuedate.bind(this)
    this.onChangeLabels = this.onChangeLabels.bind(this)
    this.saveSprint = this.saveSprint.bind(this)
    this.saveDueDate = this.saveDueDate.bind(this)
    this.saveLabels = this.saveLabels.bind(this)
  }

  async componentDidMount() {
    let sprints = await this.props.sprints()
    let index = sprints.map(sprint => sprint.id).indexOf(this.props.selectedSprint)
    index = index === -1 ? 0 : index+1
    this.setState({sprints: sprints, selectedSprint: index})

    let labels = await this.props.labels()
    this.setState({labels: labels})
  }

  componentDidUpdate(prevProps) {
    if (this.props.dueDate !== prevProps.dueDate) {
      this.setState({dueDate: this.props.dueDate})
    }

    if(this.props.selectedSprint !== prevProps.selectedSprint) {
      let index = this.state.sprints.map(sprint => sprint.id).indexOf(this.props.selectedSprint)
      index = index === -1 ? 0 : index+1
      this.setState({selectedSprint: index})
    }

    if (this.props.selectedLabels !== prevProps.selectedLabels) {
      let selectedLabels = this.props.selectedLabels ? this.props.selectedLabels : []
      this.setState({selectedLabels: selectedLabels.map(label => this.state.labels.indexOf(label))})
    }
  }

  onChangeSprint(e) {
    this.setState({selectedSprint: e.target.value})
  }

  onChangeDuedate(e) {
    this.setState({dueDate: e.target.value})
  }

  onChangeLabels(e) {
    let newVal = e.target.value
    let stateVal = this.state.selectedLabels

    let selectedValue = [...e.target.options].filter(o => o.selected).map(o => o.value)
    this.setState({selectedLabels: selectedValue})
  }

  saveSprint() {
    let sprint = parseInt(this.state.selectedSprint) === 0 ? null : this.state.sprints[this.state.selectedSprint-1].id

    if(this.props.selectedSprint === sprint) {
      return
    }

    this.props.updateSprint(sprint);
  }

  saveDueDate() {
    if(this.props.dueDate === this.state.dueDate) {
      return
    }
    this.props.updateDueDate(this.state.dueDate);
  }

  saveLabels() {
    let selectedLabels = this.state.selectedLabels.map(i => this.state.labels[i])
    if(!this.props.selectedLabels) {
      return
    }
    if(this.props.selectedLabels.sort().join(';') === selectedLabels.sort().join(';')) {
      return
    }
    this.props.updateLabels(selectedLabels);
  }

  render () {
    return(
      <Wrapper>
        <Content>
          <Info>
            <span>Sprint</span>
            {
              this.props.status.toLowerCase() === "open"
              ?
                <span onClick={
                  function(e) { 
                    if(this.state.editingSection.indexOf(0) === -1) {
                      this.setState({editingSection: this.state.editingSection.concat([0])}) 
                    } else {
                      this.setState({editingSection: this.state.editingSection.filter(section => section !== 0)})
                      this.saveSprint()
                    }
                  }.bind(this)
                }>
                Edit</span>
              :
                null
            }
          </Info>
          <Value>
            {
              this.state.editingSection.includes(0)
              ?
                <SprintSelect onChange={this.onChangeSprint} value={this.state.selectedSprint}>
                  <option value={0}></option>
                  {
                    this.state.sprints.length > 0 && this.state.sprints.map((sprint, index) => <option key={sprint.id} value={index+1}>{sprint.title}</option>)
                  }
                </SprintSelect>
              :
                <span>
                {  
                  this.state.sprints.length > 0 && this.state.selectedSprint > 0 ? this.state.sprints[this.state.selectedSprint-1].title : "None"
                }
                </span>
            }
          </Value>
        </Content>
        <Content>
          <Info>
            <span>Due Date</span>
            {
              this.props.status.toLowerCase() === "open"
              ?
                <span onClick={
                  function(e) { 
                    if(this.state.editingSection.indexOf(1) === -1) {
                      this.setState({editingSection: this.state.editingSection.concat([1])}) 
                    } else {
                      this.setState({editingSection: this.state.editingSection.filter(section => section !== 1)})
                      this.saveDueDate()
                    }
                  }.bind(this)
                }>
                Edit</span>
              :
                null
            }
          </Info>
          <Value>
            {
              this.state.editingSection.includes(1)
              ?
                <DueDateInput type="date" 
                              onChange={this.onChangeDuedate} 
                              value={this.state.dueDate.toLocaleString("en-GB", {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, year: "numeric", month: "2-digit", day: "2-digit"}).split("/").reverse().join("-")} />
              :
                this.state.dueDate.toLocaleString("en-GB", {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, year: "numeric", month: "2-digit", day: "2-digit"}).split("/").reverse().join("-") 
            }
          </Value>
        </Content>
        <Content>
          <Info>
            <span>Labels</span>
            {
              this.props.status.toLowerCase() === "open"
              ?
                <span onClick={
                  function(e) { 
                    if(this.state.editingSection.indexOf(2) === -1) {
                      this.setState({editingSection: this.state.editingSection.concat([2])}) 
                    } else {
                      this.setState({editingSection: this.state.editingSection.filter(section => section !== 2)})
                      this.saveLabels()
                    }
                  }.bind(this)
                }>
                Edit</span>
              :
                null
            }
          </Info>
          <Value>
            {
              this.state.editingSection.includes(2)
              ?
                <LabelSelect multiple onChange={this.onChangeLabels} value={this.state.selectedLabels}>
                  {
                    this.state.labels.length > 0 && this.state.labels.map((label, index) => <option key={label} value={index}>{label}</option>)
                  }
                </LabelSelect>
              :
                <LabelSelect multiple value={this.state.selectedLabels} disabled>
                  {
                    this.state.labels.length > 0 && this.state.labels.map((label, index) => <option key={label} value={index}>{label}</option>)
                  }
                </LabelSelect>
            }
          </Value>
        </Content>
      </Wrapper>
    )
  }
}