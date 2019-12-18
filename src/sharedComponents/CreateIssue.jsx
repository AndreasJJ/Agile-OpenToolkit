import React, {useState, useEffect, useContext} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';

import { FirebaseContext, GetDocuments, GetDocument, AddDocument } from './Firebase';

import { DateToLocalString } from './Utility';
import { alertActions } from '../state/actions/alert';

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

const Options = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding-top: 15px;

  @media only screen and (max-width: 800px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const SprintWrapper = styled.div`
  @media only screen and (max-width: 800px) {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: flex-start;
  }
`

const Sprint = styled.label`
  margin-right: 5px;

  @media only screen and (max-width: 800px) {
    width: 100px;
    min-width: 100px;
    margin-right: 0;
    padding: 0px 15px;
  }
`

const SprintSelect = styled.select`
  font-size: 16px;
  min-width: 80px;

  @media only screen and (max-width: 800px) {
    margin: 0px 15px;
    width: 100%;
  }
`

const LabelsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 800px) {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: flex-start;
  }
`

const Labels = styled.label`
  margin-right: 5px;

  @media only screen and (max-width: 800px) {
    width: 100px;
    min-width: 100px;
    margin-right: 0;
    padding: 0px 15px;
  }
`

const LabelsSelect = styled.select`
  font-size: 16px;
  min-width: 80px;

  @media only screen and (max-width: 800px) {
    margin: 0px 15px;
    width: 100%;
  }
`

const Option = styled.option`
  width: 100%;
  background-color: ${props => props.backgroundColor ? props.backgroundColor : "none"};
`

const DueDateWrapper = styled.div`
  @media only screen and (max-width: 800px) {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: flex-start;
  }
`

const DueDate = styled.label`
  margin-right: 5px;

  @media only screen and (max-width: 800px) {
    width: 100px;
    min-width: 100px;
    margin-right: 0;
    padding: 0px 15px;
  }
`

const DueDateInputsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
`

const DateInput = styled.input`
  @media only screen and (max-width: 800px) {
    margin-right: 15px;
    width: 100%;
    flex: 1;
  }
`

const EnableDueDateInput = styled.input`
  @media only screen and (max-width: 800px) {
    margin-left: 15px;
    margin-right: 15px;
  }
`

const EstimateWrapper = styled.div`
  @media only screen and (max-width: 800px) {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: flex-start;
  }
`

const Estimate = styled.label`
  @media only screen and (max-width: 800px) {
    width: 100px;
    min-width: 100px;
    margin-right: 0;
    padding: 0px 15px;
  }
`

const EstimateInput = styled.input`
  @media only screen and (max-width: 800px) {
    margin: 0px 15px;
    width: 100%;
  }
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
  const firebase = useContext(FirebaseContext)

  const dispatch = useDispatch()

  const uid = useSelector(state => state.authentication.user.uid)
  const firstname = useSelector(state => state.authentication.user.firstname)
  const lastname = useSelector(state => state.authentication.user.lastname)
  const products = useSelector(state => state.product.products)
  const selectedProduct = useSelector(state => state.product.selectedProduct)   

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDateEnabled, setDueDateEnabled] = useState(false)
  const [dueDate, setDueDate] = useState(DateToLocalString(new Date()))
  const [estimate, setEstimate] = useState("")
  const [selectedSprint, setSelectedSprint] = useState(0)
  const [selectedLabels, setSelectedLabels] = useState([])
  const [submitDisabled, setSubmitDisabled] = useState(true)
  const [labels, setLabels] = useState([])
  const [sprints, setSprints] = useState([])

  // Get labels and sprints on mount
  useEffect(() => {
    getLabels()
    getSprints()
  }, [])

  // Get sprints from firestore
  const getSprints = async () => {
    let _sprints = await GetDocuments(firebase, "products/" + products[selectedProduct].id + "/sprints/", [['dueDate','>',new Date()]])
    setSprints(_sprints)
  }

  // Get labels from firestore
  const getLabels = async () => {
    /*
     * The document is a map of labels such that each key is the label name and
     * the value is a new map with color and description key value pairs
    */
    let document = await GetDocument(firebase, "products/" + products[selectedProduct].id + "/labels/list")

    if(document) {
      // Loop over all labels and push an array on the form ['labelName', 'color'] to the temp array
      let tempArray = []
      for (const [key, value] of Object.entries(document.list)) {
        tempArray.push([key, value])
      }

      setLabels(tempArray)
    } else {
      setLabels([])
    }
  }

  const onChangeTitle = (e) => {
    setTitle(e.target.value)
    setSubmitDisabled(e.target.value === "" ? true : false)
  }

  const onChangeDescription = (e) => {
    setDescription(e.target.value)
  }

  const onChangeDueDate = (e) => {
    setDueDate(e.target.value)
  }

  const onChangeSprintSelect = (e) => {
    setSelectedSprint(e.target.value)
  }

  const onChangeLabelsSelect = (e) => {
    // Newly selected labels
    let newVal = event.target.value
    // Old selected labels
    let stateVal = selectedLabels

    // Filter the labels to get the selected labels and map the values
    let selectedValue = [...e.target.options].filter(o => o.selected).map(o => o.value)

    setSelectedLabels(selectedValue)
  }

  const onDueDateEnabledChange = () => {
    setDueDateEnabled(!dueDateEnabled)
  }

  const onEstimateChange = (e) => {
    setEstimate(e.target.value)
  }

  const sendIssue = async () => {
    // New issue object
    let issue = {
      title: title,
      description: description,
      dueDate: dueDateEnabled ? new Date(dueDate) : null,
      sprint: (sprints.length <= selectedSprint) ? null : (selectedSprint > 0 ? sprints[selectedSprint-1].id : null),
      status: "OPEN",
      timestamp: firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
      lastUpdateTimestamp: firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
      creator: {
        uid: uid,
        firstname: firstname,
        lastname: lastname
      },
      lastEditer: {
        uid: uid,
        firstname: firstname,
        lastname: lastname
      }
    }

    // Check if the estimate is a number or not
    if(estimate && estimate !== "" && !isNaN(estimate)) {
      issue.estimate = Number(estimate)
    }

    // Check if any labels are selected
    if(labels.length > 0) {
      let labels = selectedLabels.map(i => labels[i])
      issue.labels = Object.fromEntries(labels)
    }

    try {
      // Increment the counter (amount of stories) in the stats document
      let incrementValue = await GetDocument(firebase, "products/" + products[selectedProduct].id + "/stories/--STATS--")
      incrementValue = incrementValue ? incrementValue.count : 0
      issue.number = incrementValue

      // add issue to the database
      let snapshot = await AddDocument(firebase, "products/" + products[selectedProduct].id + "/stories", issue)

      console.log("Issue transmittion successfully committed!");
      // Run success function and exit
      props.finished(snapshot.id)
      props.exit()
    } catch(err) {
      // Log and dispatch error alert
      console.log("Issue transmittion failed: ", err);
      dispatch(alertActions.error("Something went wrong. We were unable to save the issue. Please try again!"));
    }

  }

  return (
    <Wrapper>
      <Header>
        <h3>New Issue</h3>
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
        <Options>
          <SprintWrapper>
            <Sprint>Sprint</Sprint>
            <SprintSelect onChange={onChangeSprintSelect} 
                          defaultValue={selectedSprint}>
              <Option></Option>
              {
                sprints && sprints.map((sprint, index) => 
                                        <Option key={index} value={index+1}>{sprint.title}</Option>
                                       )
              }
            </SprintSelect>
          </SprintWrapper>
          <LabelsWrapper>
            <Labels>Labels</Labels>
            <LabelsSelect multiple onChange={onChangeLabelsSelect} defaultValue={selectedLabels}>
              {
                labels && labels.length > 0 ? null : <Option disabled></Option>
              }
              {
                labels && labels.map((label, index) => 
                                      <Option key={index} value={index} backgroundColor={label[1].color}>{label[0]}</Option>
                                     )
              }
            </LabelsSelect>
          </LabelsWrapper>
          <DueDateWrapper>
            <DueDate>Due Date</DueDate>
            <DueDateInputsWrapper>
              <EnableDueDateInput type="checkbox" defaultChecked={dueDateEnabled} onChange={onDueDateEnabledChange} />
              <DateInput disabled={!dueDateEnabled}
                         type="date" 
                         value={dueDate} 
                         onChange={onChangeDueDate} 
                         min={DateToLocalString(new Date())} />
            </DueDateInputsWrapper>
          </DueDateWrapper>
          <EstimateWrapper>
            <Estimate>Estimate</Estimate>
            <EstimateInput type="number" min="0" value={estimate} onChange={onEstimateChange} />
          </EstimateWrapper>
        </Options>
        <Action>
          <Submit disabled={submitDisabled} onClick={(e) => sendIssue()}>
            Submit issue
          </Submit>
          <Cancel onClick={(e) => props.exit()}>
            Cancel
          </Cancel>
        </Action>
      </Body>
    </Wrapper>
  )
}

CreateIssue.proptypes = {
  finished: PropTypes.func.isRequired,
  exit: PropTypes.func.isRequired
}

export { CreateIssue };