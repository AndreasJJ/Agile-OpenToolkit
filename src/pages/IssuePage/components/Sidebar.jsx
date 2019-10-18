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

const Option = styled.option`
  width: 100%;
  background-color: ${props => props.backgroundColor ? props.backgroundColor : "none"}
  color: black;
`

export default class Sidebar extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      editingSection: [],
      sprints: [],
      labels: [],
      originalSelectedLabels: [],
      selectedLabels: [],
      selectedSprint: 0,
      dueDate: this.props.dueDate,
      estimate: ""
    }
    this.onChangeSprint = this.onChangeSprint.bind(this)
    this.onChangeDuedate = this.onChangeDuedate.bind(this)
    this.onChangeLabels = this.onChangeLabels.bind(this)
    this.saveSprint = this.saveSprint.bind(this)
    this.saveDueDate = this.saveDueDate.bind(this)
    this.saveLabels = this.saveLabels.bind(this)
    this.saveEstimate = this.saveEstimate.bind(this)
    this.onChangeEstimate = this.onChangeEstimate.bind(this)
  }

  async componentDidMount() {
    if(this.props.sprints) {
      let index = this.props.sprints.map(sprint => sprint.id).indexOf(this.props.selectedSprint)
      index = index === -1 ? 0 : index+1
      this.setState({sprints: this.props.sprints, selectedSprint: index})
    }
  }

  async componentDidUpdate(prevProps) {
    if(this.props.estimate !== prevProps.estimate) {
      let estimate = this.props.estimate ? this.props.estimate : ""
      this.setState({estimate: estimate})
    }

    if (this.props.dueDate !== prevProps.dueDate) {
      this.setState({dueDate: this.props.dueDate})
    }

    if(this.props.sprints !== prevProps.sprints) {
      if(this.props.sprints) {
        let index = this.props.sprints.map(sprint => sprint.id).indexOf(this.props.selectedSprint)
        index = index === -1 ? 0 : index+1
        this.setState({sprints: this.props.sprints, selectedSprint: index})
      }
    }

    if(this.props.selectedSprint !== prevProps.selectedSprint) {
      let index = this.state.sprints.map(sprint => sprint.id).indexOf(this.props.selectedSprint)
      index = index === -1 ? 0 : index+1
      this.setState({selectedSprint: index})
    }

    if (this.props.selectedLabels !== prevProps.selectedLabels || this.props.labels !== prevProps.labels) {
      let selectedLabels = this.props.selectedLabels ? this.props.selectedLabels : []

      let tempArray = []
      for (var i = 0; i < this.props.selectedLabels.length; i++) {
        for (var j = 0; j < this.props.labels.length; i++) {
          if(this.props.labels[i][0] == this.props.selectedLabels[j][0]) {
            tempArray.push(i)
            break
          }
        }
      }
      this.setState({labels: this.props.labels, originalSelectedLabels: selectedLabels, selectedLabels: tempArray})
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

  onChangeEstimate(e) {
    this.setState({estimate: e.target.value})
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
    let selectedLabels = this.state.selectedLabels.map((i) => this.state.labels[i])
    if(!this.state.originalSelectedLabels) {
      return
    }
    if(this.state.originalSelectedLabels.sort().join(';') === selectedLabels.sort().join(';')) {
      return
    }
    selectedLabels = Object.fromEntries(selectedLabels)
    this.props.updateLabels(selectedLabels);
  }

  saveEstimate() {
    let props = this.props.estimate
    let state = this.state.estimate

    if(state === "") {
      state = null
    }

    if(props === state) {
      return
    }

    let estimate = null
    if(state && state !== "" && !isNaN(state)) {
      estimate = Number(state)
    }
    this.props.updateEstimate(estimate)
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
                  {this.state.editingSection.includes(0) ? "Save" : "Edit"}
                </span>
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
                  {this.state.editingSection.includes(1) ? "Save" : "Edit"}
                </span>
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
                              value={this.state.dueDate ? this.state.dueDate.toLocaleString("en-GB", {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, year: "numeric", month: "2-digit", day: "2-digit"}).split("/").reverse().join("-") : (new Date).toLocaleString("en-GB", {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, year: "numeric", month: "2-digit", day: "2-digit"}).split("/").reverse().join("-")}
                              min={new Date().toLocaleString("en-GB", {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, year: "numeric", month: "2-digit", day: "2-digit"}).split("/").reverse().join("-")}
                 />
              :
                this.state.dueDate ? this.state.dueDate.toLocaleString("en-GB", {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, year: "numeric", month: "2-digit", day: "2-digit"}).split("/").reverse().join("-") : "None"
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
                  {this.state.editingSection.includes(2) ? "Save" : "Edit"}
                </span>
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
                    this.state.labels.length > 0 && this.state.labels.map((label, index) => <Option key={label[0]} value={index} backgroundColor={label[1].color}>{label[0]}</Option>)
                  }
                </LabelSelect>
              :
                <LabelSelect multiple value={this.state.selectedLabels} disabled>
                  {
                    this.state.labels.length > 0 && this.state.labels.map((label, index) => <Option key={label[0]} value={index} backgroundColor={label[1].color}>{label[0]}</Option>)
                  }
                </LabelSelect>
            }
          </Value>
        </Content>
        <Content>
          <Info>
            <span>Estimate</span>
            {
              this.props.status.toLowerCase() === "open"
              ?
                <span onClick={
                  function(e) { 
                    if(this.state.editingSection.indexOf(3) === -1) {
                      this.setState({editingSection: this.state.editingSection.concat([3])}) 
                    } else {
                      this.setState({editingSection: this.state.editingSection.filter(section => section !== 3)})
                      this.saveEstimate()
                    }
                  }.bind(this)
                }>
                  {this.state.editingSection.includes(4) ? "Save" : "Edit"}
                </span>
              :
                null
            }
          </Info>
          <Value>
            {
              this.state.editingSection.includes(3)
              ?
                <input type="number" min="0" value={this.state.estimate} onChange={this.onChangeEstimate} />
              :
                this.state.estimate ? this.state.estimate : "None"
            }
          </Value>
        </Content>
      </Wrapper>
    )
  }
}