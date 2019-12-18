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
  // Previous props
  const prevProps = useRef(props)

  // State
  const [editingSection, setEditingSection] = useState([])
  const [sprints, setSprints] = useState([])
  const [labels, setLabels] = useState([])
  const [originalSelectedLabels, setOriginalSelectedLabels] = useState([])
  const [selectedLabels, setSelectedLabels] = useState([])
  const [selectedSprint, setSelectedSprint] = useState(0)
  const [dueDate, setDueDate] = useState(props.dueDate)
  const [estimate, setEstimate] = useState(null)

  // Constructor
  useEffect(() => {
    if(props.sprints) {
      // Get index of the selected sprint
      let index = props.sprints.map(sprint => sprint.id).indexOf(props.selectedSprint)
      // If there's no selected sprint set selected index to 0 else set it to index+1
      index = index === -1 ? 0 : index+1

      // Update state
      setSprints(props.sprints)
      setSelectedSprint(index)
    }
  }, [])

  // On component rerender
  useEffect(() => {
    // Update estimate if its different
    if(props.estimate !== prevProps.current.estimate) {
      let estimate = props.estimate ? props.estimate : ""
      setEstimate(estimate)

      prevProps.current = props
    }

    // Update due date if its different
    if (props.dueDate !== prevProps.current.dueDate) {
      setDueDate(props.dueDate)

      prevProps.current = props
    }

    // Update sprints if they are different
    if(props.sprints !== prevProps.current.sprints) {
      if(props.sprints) {
        let index = props.sprints.map(sprint => sprint.id).indexOf(props.selectedSprint)
        index = index === -1 ? 0 : index+1

        setSprints(props.sprints)
        setSelectedSprint(index)
      }

      prevProps.current = props
    }

    // Update selecetd sprint if they are different
    if(props.selectedSprint !== prevProps.current.selectedSprint) {
      let index = sprints.map(sprint => sprint.id).indexOf(props.selectedSprint)
      index = index === -1 ? 0 : index+1

      setSelectedSprint(index)

      prevProps.current = props
    }

    // Update selected labels and labels if either of them are different
    if (props.selectedLabels !== prevProps.current.selectedLabels || props.labels !== prevProps.current.labels) {
      let selectedLabels = props.selectedLabels ? props.selectedLabels : []

      let tempArray = []
      // Loop over all selected labels 
      for (let i = 0; i < props.selectedLabels.length; i++) {
        // Loop over all albels
        for (let j = 0; j < props.labels.length; j++) {
          // If a label title is equal to a selected label title add it to the temp array
          if(props.labels[j][0] == props.selectedLabels[i][0]) {
            tempArray.push(i)
            break
          }
        }
      }

      // Update state
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

  // Update edited sprint
  const saveSprint = () => {
    // If it isnt index 0 then get the actual id from the sprints with the help of the index
    let sprint = parseInt(selectedSprint) === 0 ? null : sprints[selectedSprint-1].id

    if(props.selectedSprint === sprint) {
      return
    }

    props.updateSprint(sprint);
  }

  // Update edited due date
  const saveDueDate = () => {
    if(props.dueDate === dueDate) {
      return
    }

    props.updateDueDate(dueDate);
  }

  // Update edited labels
  const saveLabels = () => {
    // Get the full label objects from the index array selectedLabels
    let _selectedLabels = selectedLabels.map((i) => labels[i])
    if(!originalSelectedLabels) {
      return
    }
    // sort and join with ';' to easily compare the arrays
    if(originalSelectedLabels.sort().join(';') === selectedLabels.sort().join(';')) {
      return
    }
    // Make objects
    _selectedLabels = Object.fromEntries(selectedLabels)
    // Update state
    props.updateLabels(_selectedLabels);
  }

  // Update estimate
  const saveEstimate = () => {
    let state = estimate

    if(state === "") {
      state = null
    }

    // Check the estimated is actually changed
    if(props.estimate === state) {
      return
    }

    // Set estimate to null
    let estimate = null
    // Set estimate to the value from the input if its a number
    if(state && state !== "" && !isNaN(state)) {
      estimate = Number(state)
    }

    // Update state
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