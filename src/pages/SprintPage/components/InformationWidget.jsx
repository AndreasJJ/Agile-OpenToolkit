import React, {useState, useEffect, useContext} from 'react';
import { useParams, useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { FirebaseContext, GetDocument, UpdateDocument, DeleteDocument } from '../../../sharedComponents/Firebase';

import { FsTsToDate, DateToLocalString } from '../../../sharedComponents/Utility'

import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 20px 0px 20px;
  flex-grow: 1;

  @media only screen and (max-width: 800px) {
    margin: 0;
  }
`

const Content = styled.div`
  height: 100%;
  width: 100%;
  padding: 0.83em;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  background-color: #ffffff;
`

const Header = styled.div`
  display: flex;
  margin: 0 0 0.83em 0;
  padding: 0 0 0.3em;
  border-bottom: 1px solid #eaeaea;
`

const Controllers = styled.div`

`

const Button = styled.button`
  background-color: ${props => props.backgroundColor};
  border: 1px solid ${props => props.borderColor};
  padding: 6px 10px 6px 10px;
  color: #ffffff;
  font-size: inherit;
  border-radius: 3px;
  margin-left: 5px;
`

const Title = styled.h2`
  flex: 1;
  margin: 0;
`

const TitleInput = styled.input`
  flex: 1;
`

const Description = styled.div`
  margin: 0 0 0.83em 0;
  padding: 0 0 0.3em;
  border-bottom: 1px solid #eaeaea;
  overflow: auto;
`

const DescriptionTextArea = styled.textarea`
  margin: 0 0 0.83em 0;
  padding: 0 0 0.3em;
  border-bottom: 1px solid #eaeaea;
  flex: 1;
  resize: none;
`

const Dates = styled.div`
  flex: ${props => (!props.description || props.description == "" ) && !props.editing ? 1 : null};
  display: flex;
  flex-direction: ${props => (!props.description || props.description == "") && !props.editing ? "column" : "row"};
  align-items: flex-start;
`

const DatesInputWrapper = styled.div`
  display: ${props => (!props.description || props.description == "") && !props.editing ? "flex" : null};
  flex-direction: ${props => (!props.description || props.description == "") && !props.editing ? "column" : null};

  &:nth-child(2) {
    margin-left: ${props => (!props.description || props.description == "") && !props.editing ? null : "10px"};
  }
`

const DateLabel = styled.label`
  font-family: 'Helvetica Neue';
  margin-right: 5px;
`

const DateInput = styled.input`
  margin-bottom: 10px;
  height: 34px;
`

const DateText = styled.span`
  margin-bottom: 20px;
`

const InformationWidget = (props) => {
  const firebase = useContext(FirebaseContext)

  const {id} = useParams()
  const history = useHistory()

  const uid = useSelector(state => state.authentication.user.uid)
  const firstname = useSelector(state => state.authentication.user.firstname)
  const lastname = useSelector(state => state.authentication.user.lastname)
  const products = useSelector(state => state.product.products)
  const selectedProduct = useSelector(state => state.product.selectedProduct)  

  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState(new Date())
  const [dueDate, setDueDate] = useState(new Date())
  const [originalTitle, setOriginalTitle] = useState("")
  const [originalDescription, setOriginalDescription] = useState("")
  const [originalStartDate, setOriginalStartDate] = useState(new Date())
  const [originalDueDate, setOriginalDueDate] = useState(new Date())

  useEffect(() => {
    getSprint()
  }, [])

  const getSprint = async () => {
    let sprint = await GetDocument(firebase, "products/" + products[selectedProduct].id + "/sprints/" + id)

    if(sprint) {
      setTitle(sprint.title)
      setDescription(sprint.description)
      setStartDate(FsTsToDate(sprint.startDate))
      setDueDate(FsTsToDate(sprint.dueDate))
      setOriginalTitle(sprint.title)
      setOriginalDescription(sprint.description)
      setOriginalStartDate(FsTsToDate(sprint.startDate))
      setOriginalDueDate(FsTsToDate(sprint.dueDate))
    }
  }

  const saveSprint = async () => {
    if(title === originalTitle && 
      description === originalDescription &&
      startDate.getTime() === originalStartDate.getTime() &&
      dueDate.getTime() === originalDueDate.getTime()) 
    {
      return
    }

    let data = {
      title: title,
      description: description,
      startDate: startDate,
      dueDate: dueDate,
      lastUpdateTimestamp: firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
      lastEditer: {
        uid: uid,
        firstname: firstname,
        lastname: lastname
      }
    }

    await UpdateDocument(firebase, "products/" + products[selectedProduct].id + "/sprints/" + id, data)
  }

  const deleteSprint = async () => {
    await DeleteDocument(firebase, "products/" + products[selectedProduct].id + "/sprints/" + id)

    history.push('/sprints')
  }

  const onEditButtonClick = () => {
    setEditing(true)
  }

  const onDeleteButtonClick = () => {
    deleteSprint()
  }

  const onSaveButtonClick = async () => {
    await saveSprint()
    setEditing(false)
  }

  const onChange = (e) => {
    let val = e.target.value

    if(e.target.name === "startDate" || e.target.name === "dueDate") {
      val = new Date(val)
    }

    if(e.target.name === "title") {
      setTitle(val)
    } else if (e.target.name === "description") {
      setDescription(val)
    } else if (e.target.name === "startDate") {
      setStartDate(val)
    } else if (e.target.name === "dueDate") {
      setDueDate(val)
    }
  }

  return(
    <Wrapper>
      <Content>
            <Header>
            {
              editing
              ?
                <TitleInput name="title" type="text" value={title} onChange={onChange} />
              :
                <Title>{title}</Title>
            }
            <Controllers>
              {
                editing
                ?
                  <Button backgroundColor={"#1aaa55"} borderColor={"#168f48"} onClick={onSaveButtonClick}> Save </Button>
                :
                  <Button backgroundColor={"#fc9403"} borderColor={"#de7e00"} onClick={onEditButtonClick}> Edit </Button>
              }
              <Button backgroundColor={"#ff6961"} borderColor={"#bf4f49"} onClick={onDeleteButtonClick}> Delete </Button>
            </Controllers>
            </Header>
          {
            editing
            ?
              <DescriptionTextArea name="description" defaultValue={description} onChange={onChange} />
            :
              description
              ?
                <Description>{description}</Description>
              :
                null
          }
          <Dates description={description} editing={editing}>
            <DatesInputWrapper description={description} editing={editing}>
              <DateLabel>Start Date:</DateLabel>
              {
                editing
                ?
                  <DateInput name="startDate" type="date" value={DateToLocalString(startDate)} onChange={onChange} />
                :
                  <DateText>{DateToLocalString(startDate)}</DateText>
              }
            </DatesInputWrapper>
            <DatesInputWrapper description={description} editing={editing}>
              <DateLabel>Due Date:</DateLabel>
              {
                editing
                ?
                  <DateInput name="dueDate" type="date" value={DateToLocalString(dueDate)} min={DateToLocalString(new Date(new Date().setDate((startDate).getDate() + 1)))} onChange={onChange} />
                :
                  <DateText>{DateToLocalString(dueDate)}</DateText>
              }    
            </DatesInputWrapper>
          </Dates>
      </Content>
    </Wrapper>
  )
}

InformationWidget.proptypes = {
}

export { InformationWidget };