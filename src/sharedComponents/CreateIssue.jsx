import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from './Firebase';

import { DateToLocalString } from './Utility'
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
  margin-right: 5px;
`

const SprintSelect = styled.select`
  min-width: 80px;
`

const LabelsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const Labels = styled.label`
  margin-right: 5px;
`

const LabelsSelect = styled.select`
  min-width: 80px;
`

const Option = styled.option`
  width: 100%;
  background-color: ${props => props.backgroundColor ? props.backgroundColor : "none"}
`

const DueDateWrapper = styled.div`

`

const DueDate = styled.label`
  margin-right: 5px;
`

const DateInput = styled.input`

`

const EnableDueDateInput = styled.input`

`

const EstimateWrapper = styled.div`

`

const Estimate = styled.label`

`

const EstimateInput = styled.input`

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
      dueDateEnabled: false,
      dueDate: DateToLocalString(new Date()),
      estimate: "",
      selectedSprint: 0,
      selectedLabels: [],
      submitDisabled: true,
      labels: [],
      sprints: []
    }
    this.getSprints = this.getSprints.bind(this)
    this.getLabels = this.getLabels.bind(this)
    this.onChangeTitle = this.onChangeTitle.bind(this)
    this.onChangeDescription = this.onChangeDescription.bind(this)
    this.onChangeDueDate = this.onChangeDueDate.bind(this)
    this.onChangeSprintSelect = this.onChangeSprintSelect.bind(this)
    this.onChangeLabelsSelect = this.onChangeLabelsSelect.bind(this)
    this.onDueDateEnabledChange = this.onDueDateEnabledChange.bind(this)
    this.sendIssue = this.sendIssue.bind(this)
    this.onEstimateChange = this.onEstimateChange.bind(this)
  }

  componentDidMount() {
    this.getLabels()
    this.getSprints()
  }

  async getSprints() {
    let querySnapshot = await this.props.firebase
                            .db.collection("products")
                            .doc(this.props.products[this.props.selectedProduct].id)
                            .collection("sprints")
                            .where('dueDate','>',new Date())
                            .get()
    let sprints = querySnapshot.docs.map((doc) => doc.data())
    this.setState({sprints: sprints})
  }

  async getLabels() {
    let docSnapshot = await this.props.firebase
                            .db.collection("products")
                            .doc(this.props.products[this.props.selectedProduct].id)
                            .collection("labels")
                            .doc("list")
                            .get()
    if(docSnapshot.data()) {
      let tempArray = []
      for (const [key, value] of Object.entries(docSnapshot.data().list)) {
        tempArray.push([key, value])
      }
      this.setState({labels: tempArray})
    } else {
      this.setState({labels: []})
    }
  }

  onChangeTitle(e) {
    let isSubmitDisabled = e.target.value === "" ? true : false

    this.setState({title: e.target.value, 
                   submitDisabled: isSubmitDisabled
                 })
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

  onDueDateEnabledChange() {
    this.setState({dueDateEnabled: !this.state.dueDateEnabled})
  }

  onEstimateChange(e) {
    this.setState({estimate: e.target.value})
  }

  sendIssue() {
    let issue = {
      title: this.state.title,
      description: this.state.description,
      dueDate: this.state.dueDateEnabled ? new Date(this.state.dueDate) : null,
      sprint: (this.state.sprints.length <= this.state.selectedSprint) ? null : (this.state.selectedSprint > 0 ? this.state.sprints[this.state.selectedSprint-1].id : null),
      status: "OPEN",
      timestamp: this.props.firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
      lastUpdateTimestamp: this.props.firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
      creator: {
        uid: this.props.uid,
        firstname: this.props.firstname,
        lastname: this.props.lastname
      },
      lastEditer: {
        uid: this.props.uid,
        firstname: this.props.firstname,
        lastname: this.props.lastname
      }
    }

    if(this.state.estimate && this.state.estimate !== "" && !isNaN(this.state.estimate)) {
      issue.estimate = Number(this.state.estimate)
    }

    if(this.state.labels.length > 0) {
      let labels = this.state.selectedLabels.map(i => this.state.labels[i])
      issue.labels = Object.fromEntries(labels)
    }

    var incrementRef = this.props.firebase
                                 .db.collection("products")
                                 .doc(this.props.products[this.props.selectedProduct].id)
                                 .collection("stories")
                                 .doc("--STATS--")

    incrementRef.get().then(function(incrementValueDoc) {
          var incrementValue = incrementValueDoc.exists ? incrementValue = incrementValueDoc.data().count : 0

          issue.number = incrementValue

          return this.props.firebase
                    .db.collection("products")
                    .doc(this.props.products[this.props.selectedProduct].id)
                    .collection("stories")
                    .add(issue)
    }.bind(this)).then(function(snapshot) {
        console.log("Issue transmittion successfully committed!");
        this.props.finished(snapshot.id)
        this.props.exit()
    }.bind(this)).catch(function(error) {
        console.log("Issue transmittion failed: ", error);
        this.props.dispatch(alertActions.error("Something went wrong. We were unable to save the issue. Please try again!"));
    }.bind(this));
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
              <TitleInput placeholder="Title" 
                          value={this.state.title} 
                          onChange={this.onChangeTitle} />
            </TitleWrapper>
            <DescriptionWrapper>
              <Description>Description</Description>
              <DescriptionArea placeholder="Write a comment..." 
                               value={this.state.description} 
                               onChange={this.onChangeDescription} />
            </DescriptionWrapper>
          </Info>
          <Options>
            <SprintWrapper>
              <Sprint>Sprint</Sprint>
              <SprintSelect onChange={this.onChangeSprintSelect} 
                            defaultValue={this.state.selectedSprint}>
                <Option></Option>
                {
                  this.state.sprints && this.state.sprints.map((sprint, index) => 
                                                                <Option key={index} value={index+1}>{sprint.title}</Option>
                                                               )
                }
              </SprintSelect>
            </SprintWrapper>
            <LabelsWrapper>
              <Labels>Labels</Labels>
              <LabelsSelect multiple onChange={this.onChangeLabelsSelect} defaultValue={this.state.selectedLabels}>
                {
                  this.state.labels && this.state.labels.length > 0 ? null : <Option disabled></Option>
                }
                {
                  this.state.labels && this.state.labels.map((label, index) => 
                                                              <Option key={index} value={index} backgroundColor={label[1].color}>{label[0]}</Option>
                                                             )
                }
              </LabelsSelect>
            </LabelsWrapper>
            <DueDateWrapper>
              <DueDate>Due Date</DueDate>
              <EnableDueDateInput type="checkbox" defaultChecked={this.state.dueDateEnabled} onChange={this.onDueDateEnabledChange} />
              <DateInput disabled={!this.state.dueDateEnabled}
                         type="date" 
                         value={this.state.dueDate} 
                         onChange={this.onChangeDueDate} 
                         min={DateToLocalString(new Date())} />
            </DueDateWrapper>
            <EstimateWrapper>
              <Estimate>Estimate</Estimate>
              <EstimateInput type="number" min="0" value={this.state.estimate} onChange={this.onEstimateChange} />
            </EstimateWrapper>
          </Options>
          <Action>
            <Submit disabled={this.state.submitDisabled} onClick={(e) => this.sendIssue()}>
              Submit issue
            </Submit>
            <Cancel onClick={(e) => this.props.exit()}>
              Cancel
            </Cancel>
          </Action>
        </Body>
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

const connectedCreateIssue = connect(mapStateToProps)(CreateIssue);
const firebaseCreateIssue = compose(withFirebase)(connectedCreateIssue)
export { firebaseCreateIssue as CreateIssue };