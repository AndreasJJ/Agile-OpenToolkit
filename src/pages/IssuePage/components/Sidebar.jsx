import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

import { DateToLocalString } from '../../../sharedComponents/Utility';

import styled from 'styled-components';

const Wrapper = styled.div`
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 1;
  width: 200px;
  -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #ffffff;

  @media only screen and (max-width: 800px) {
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 2;
    grid-row-end: 3;
  }
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
  font-size: 16px;
  width: 100%;
`

const DueDateInput = styled.input`
  width: 100%;
`

const LabelSelect = styled.select`
  font-size: 16px;
  width: 100%;
`

const Option = styled.option`
  width: 100%;
  background-color: ${props => props.backgroundColor ? props.backgroundColor : "none"};
  color: black;
`

const Sidebar = (props) => {
  const prevProps = useRef(props)

  const [editingSection, setEditingSection] = useState([])
  const [sprints, setSprints] = useState([])
  const [labels, setLabels] = useState([])
  const [originalSelectedLabels, setOriginalSelectedLabels] = useState([])
  const [selectedLabels, setSelectedLabels] = useState([])
  const [selectedSprint, setSelectedSprint] = useState(0)
  const [dueDate, setDueDate] = useState(props.dueDate)
  const [estimate, setEstimate] = useState(null)

  useEffect(() => {
    if(props.sprints) {
      let index = props.sprints.map(sprint => sprint.id).indexOf(props.selectedSprint)
      index = index === -1 ? 0 : index+1

      setSprints(props.sprints)
      setSelectedSprint(index)
    }
  }, [])

  useEffect(() => {
    if(props.estimate !== prevProps.current.estimate) {
      let estimate = props.estimate ? props.estimate : ""
      setEstimate(estimate)

      prevProps.current = props
    }

    if (props.dueDate !== prevProps.current.dueDate) {
      setDueDate(props.dueDate)

      prevProps.current = props
    }

    if(props.sprints !== prevProps.current.sprints) {
      if(props.sprints) {
        let index = props.sprints.map(sprint => sprint.id).indexOf(props.selectedSprint)
        index = index === -1 ? 0 : index+1

        setSprints(props.sprints)
        setSelectedSprint(index)
      }

      prevProps.current = props
    }

    if(props.selectedSprint !== prevProps.current.selectedSprint) {
      let index = sprints.map(sprint => sprint.id).indexOf(props.selectedSprint)
      index = index === -1 ? 0 : index+1

      setSelectedSprint(index)

      prevProps.current = props
    }

    if (props.selectedLabels !== prevProps.current.selectedLabels || props.labels !== prevProps.current.labels) {
      let selectedLabels = props.selectedLabels ? props.selectedLabels : []

      let tempArray = []
      for (let i = 0; i < props.selectedLabels.length; i++) {
        for (let j = 0; j < props.labels.length; j++) {
          if(props.labels[j][0] == props.selectedLabels[i][0]) {
            tempArray.push(i)
            break
          }
        }
      }

      setLabels(props.labels)
      setOriginalSelectedLabels(selectedLabels)
      setSelectedLabels(tempArray)

      prevProps.current = props
    }
  })

  const onChangeSprint = (e) => {
    setSelectedSprint(e.target.value)
  }

  const onChangeDuedate = (e) => {
    setDueDate(e.target.value)
  }

  const onChangeLabels = (e) => {
    let newVal = e.target.value
    let stateVal = selectedLabels

    let selectedValue = [...e.target.options].filter(o => o.selected).map(o => o.value)

    setSelectedLabels(selectedValue)
  }

  const onChangeEstimate = (e) => {
    setEstimate(e.target.value)
  }

  const saveSprint = () => {
    let sprint = parseInt(selectedSprint) === 0 ? null : sprints[selectedSprint-1].id

    if(props.selectedSprint === sprint) {
      return
    }

    props.updateSprint(sprint);
  }

  const saveDueDate = () => {
    if(props.dueDate === dueDate) {
      return
    }

    props.updateDueDate(dueDate);
  }

  const saveLabels = () => {
    let selectedLabels = selectedLabels.map((i) => labels[i])
    if(!originalSelectedLabels) {
      return
    }
    if(originalSelectedLabels.sort().join(';') === selectedLabels.sort().join(';')) {
      return
    }
    selectedLabels = Object.fromEntries(selectedLabels)

    props.updateLabels(selectedLabels);
  }

  const saveEstimate = () => {
    let props = props.estimate
    let state = estimate

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

    props.updateEstimate(estimate)
  }

  return(
    <Wrapper>
      <Content>
        <Info>
          <span>Sprint</span>
          {
            props.status.toLowerCase() === "open"
            ?
              <span onClick={(e) => { 
                  if(editingSection.indexOf(0) === -1) {
                    setEditingSection(editingSection.concat([0]))
                  } else {
                    setEditingSection(editingSection.filter(section => section !== 0))
                    saveSprint()
                  }
                }
              }>
                {editingSection.includes(0) ? "Save" : "Edit"}
              </span>
            :
              null
          }
        </Info>
        <Value>
          {
            editingSection.includes(0)
            ?
              <SprintSelect onChange={onChangeSprint} value={selectedSprint}>
                <option value={0}></option>
                {
                  sprints.length > 0 && sprints.map((sprint, index) => <option key={sprint.id} value={index+1}>{sprint.title}</option>)
                }
              </SprintSelect>
            :
              <span>
              {  
                sprints.length > 0 && selectedSprint > 0 ? sprints[selectedSprint-1].title : "None"
              }
              </span>
          }
        </Value>
      </Content>
      <Content>
        <Info>
          <span>Due Date</span>
          {
            props.status.toLowerCase() === "open"
            ?
              <span onClick={(e) => { 
                  if(editingSection.indexOf(1) === -1) {
                    setEditingSection(editingSection.concat([1]))
                  } else {
                    setEditingSection(editingSection.filter(section => section !== 1))
                    saveDueDate()
                  }
                }
              }>
                {editingSection.includes(1) ? "Save" : "Edit"}
              </span>
            :
              null
          }
        </Info>
        <Value>
          {
            editingSection.includes(1)
            ?
              <DueDateInput type="date" 
                            onChange={onChangeDuedate} 
                            value={dueDate ? DateToLocalString(dueDate) : DateToLocalString(new Date())}
                            min={DateToLocalString(new Date())}
               />
            :
              dueDate ? DateToLocalString(dueDate) : "None"
          }
        </Value>
      </Content>
      <Content>
        <Info>
          <span>Labels</span>
          {
            props.status.toLowerCase() === "open"
            ?
              <span onClick={(e) => { 
                  if(editingSection.indexOf(2) === -1) {
                    setEditingSection(editingSection.concat([2]))
                  } else {
                    setEditingSection(editingSection.filter(section => section !== 2))
                    saveLabels()
                  }
                }
              }>
                {editingSection.includes(2) ? "Save" : "Edit"}
              </span>
            :
              null
          }
        </Info>
        <Value>
          {
            editingSection.includes(2)
            ?
              <LabelSelect multiple onChange={onChangeLabels} value={selectedLabels}>
                {
                  labels.length > 0 
                  && labels.map((label, index) => 
                                <Option key={label[0]} value={index} backgroundColor={label[1].color}>{label[0]}</Option>
                                )
                }
              </LabelSelect>
            :
              <LabelSelect multiple value={selectedLabels} disabled>
                {
                  labels.length > 0 
                  && labels.map((label, index) => 
                                <Option key={label[0]} value={index} backgroundColor={label[1].color}>{label[0]}</Option>
                               )
                }
              </LabelSelect>
          }
        </Value>
      </Content>
      <Content>
        <Info>
          <span>Estimate</span>
          {
            props.status.toLowerCase() === "open"
            ?
              <span onClick={(e) => { 
                  if(editingSection.indexOf(3) === -1) {
                    setEditingSection(editingSection.concat([3]))
                  } else {
                    setEditingSection(editingSection.filter(section => section !== 3))
                    saveEstimate()
                  }
                }
              }>
                {editingSection.includes(4) ? "Save" : "Edit"}
              </span>
            :
              null
          }
        </Info>
        <Value>
          {
            editingSection.includes(3)
            ?
              <input type="number" min="0" value={estimate} onChange={onChangeEstimate} />
            :
              estimate ? estimate : "None"
          }
        </Value>
      </Content>
    </Wrapper>
  )
}

Sidebar.propTypes = {
  status: PropTypes.string.isRequired,
  sprints: PropTypes.array.isRequired,
  selectedSprint: PropTypes.string.isRequired,
  dueDate: PropTypes.instanceOf(Date),
  estimate: PropTypes.number,
  labels: PropTypes.array.isRequired,
  selectedLabels: PropTypes.array.isRequired,
  updateSprint: PropTypes.func.isRequired,
  updateDueDate: PropTypes.func.isRequired,
  updateLabels: PropTypes.func.isRequired,
  updateEstimate: PropTypes.func.isRequired
}

export default Sidebar