import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from '../../../sharedComponents/Firebase';

import { FsTsToDate, DateToLocalString } from '../../../sharedComponents/Utility'

import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 20px 0px 20px;
  flex-grow: 1;
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

class InformationWidget extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      editing: false,
      title: "",
      description: "",
      startDate: new Date(),
      dueDate: new Date(),
      originalTitle: "",
      originalDescription: "",
      originalStartDate: new Date(),
      originalDueDate: new Date()
    };

    this.getSprint = this.getSprint.bind(this)
    this.saveSprint = this.saveSprint.bind(this)
    this.deleteSprint = this.deleteSprint.bind(this)
    this.onEditButtonClick = this.onEditButtonClick.bind(this)
    this.onDeleteButtonClick = this.onDeleteButtonClick.bind(this)
    this.onSaveButtonClick = this.onSaveButtonClick.bind(this)
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onDescriptionChange = this.onDescriptionChange.bind(this)
    this.onStartDateChange = this.onStartDateChange.bind(this)
    this.onDueDateChange = this.onDueDateChange.bind(this)
  }

  async componentDidMount() {
    await this.getSprint()
  }

  async getSprint() {
    let docSnapshot = await this.props.firebase
                                      .db
                                      .collection("products")
                                      .doc(this.props.products[this.props.selectedProduct].id)
                                      .collection("sprints")
                                      .doc(this.props.match.params.id)
                                      .get()
    let sprint = docSnapshot.data()
    if(sprint) {
      this.setState({
        title: sprint.title,
        description: sprint.description,
        startDate: FsTsToDate(sprint.startDate),
        dueDate: FsTsToDate(sprint.dueDate),
        originalTitle: sprint.title,
        originalDescription: sprint.description,
        originalStartDate: FsTsToDate(sprint.startDate),
        originalDueDate: FsTsToDate(sprint.dueDate)
      })
    }
  }

  async saveSprint() {
    if(this.state.title === this.state.originalTitle && 
      this.state.description === this.state.originalDescription &&
      this.state.startDate.getTime() === this.state.originalStartDate.getTime() &&
      this.state.dueDate.getTime() === this.state.originalDueDate.getTime()) 
    {
      return
    }
    await this.props.firebase
                    .db
                    .collection("products")
                    .doc(this.props.products[this.props.selectedProduct].id)
                    .collection("sprints")
                    .doc(this.props.match.params.id)
                    .update({
                      title: this.state.title,
                      description: this.state.description,
                      startDate: this.state.startDate,
                      dueDate: this.state.dueDate,
                      lastUpdateTimestamp: this.props.firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
                      lastEditer: {
                        uid: this.props.uid,
                        firstname: this.props.firstname,
                        lastname: this.props.lastname
                      }
                    })
  }

  async deleteSprint() {
    await this.props.firebase
                    .db
                    .collection("products")
                    .doc(this.props.products[this.props.selectedProduct].id)
                    .collection("sprints")
                    .doc(this.props.match.params.id)
                    .delete()
    this.props.history.push('/sprints')
  }

  onEditButtonClick() {
    this.setState({editing: true})
  }

  onDeleteButtonClick() {
    this.deleteSprint()
  }

  async onSaveButtonClick() {
    await this.saveSprint()
    this.setState({editing: false})
  }

  onTitleChange(e) {
    this.setState({title: e.target.value})
  }

  onDescriptionChange(e) {
    this.setState({description: e.target.value})
  }

  onStartDateChange(e) {
    this.setState({startDate: new Date(e.target.value)})
  }

  onDueDateChange(e) {
    this.setState({dueDate: new Date(e.target.value)})
  }

  render () {
    return(
      <Wrapper>
        <Content>
              <Header>
              {
                this.state.editing
                ?
                  <TitleInput type="text" value={this.state.title} onChange={this.onTitleChange} />
                :
                  <Title>{this.state.title}</Title>
              }
              <Controllers>
                {
                  this.state.editing
                  ?
                    <Button backgroundColor={"#1aaa55"} borderColor={"#168f48"} onClick={this.onSaveButtonClick}> Save </Button>
                  :
                    <Button backgroundColor={"#fc9403"} borderColor={"#de7e00"} onClick={this.onEditButtonClick}> Edit </Button>
                }
                <Button backgroundColor={"#ff6961"} borderColor={"#bf4f49"} onClick={this.onDeleteButtonClick}> Delete </Button>
              </Controllers>
              </Header>
            {
              this.state.editing
              ?
                <DescriptionTextArea defaultValue={this.state.description} onChange={this.onDescriptionChange} />
              :
                this.state.description
                ?
                  <Description>{this.state.description}</Description>
                :
                  null
            }
            <Dates description={this.state.description} editing={this.state.editing}>
              <DatesInputWrapper description={this.state.description} editing={this.state.editing}>
                <DateLabel>Start Date:</DateLabel>
                {
                  this.state.editing
                  ?
                    <DateInput type="date" value={DateToLocalString(this.state.startDate)} onChange={this.onStartDateChange} />
                  :
                    <DateText>{DateToLocalString(this.state.startDate)}</DateText>
                }
              </DatesInputWrapper>
              <DatesInputWrapper description={this.state.description} editing={this.state.editing}>
                <DateLabel>Due Date:</DateLabel>
                {
                  this.state.editing
                  ?
                    <DateInput type="date" value={DateToLocalString(this.state.dueDate)} min={DateToLocalString(new Date(new Date().setDate((this.state.startDate).getDate() + 1)))} onChange={this.onDueDateChange} />
                  :
                    <DateText>{DateToLocalString(this.state.dueDate)}</DateText>
                }    
              </DatesInputWrapper>
            </Dates>
        </Content>
      </Wrapper>
    )
  }
}

function mapStateToProps(state) {
    const { uid, firstname, lastname } = state.authentication.user;
    const { products, selectedProduct } = state.product;
    return {
      uid,
      firstname,
      lastname,
      products,
      selectedProduct
    };
}

const connectedInformationWidget = connect(mapStateToProps)(InformationWidget);
const firebaseInformationWidget = withRouter(compose(withFirebase)(connectedInformationWidget))
export { firebaseInformationWidget as InformationWidget };