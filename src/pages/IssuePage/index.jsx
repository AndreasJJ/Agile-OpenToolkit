import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { compose } from 'recompose';
import { withFirebase } from '../../sharedComponents/Firebase';

import SideBar from './components/Sidebar';
import { Body } from './components/Body';

import { getPrettyCreationDate, FsTsToDate } from '../../sharedComponents/Utility';
import Modal from '../../sharedComponents/Modal';
import { CreateIssue } from '../../sharedComponents/CreateIssue';
import { CreateTask } from './components/CreateTask';

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: calc(100% - 200px) 200px;
  grid-template-rows: 100%;

  @media only screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
`;


class IssuePage extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      modalContent: null,
      status: "OPEN",
      creationTimestamp: new Date(),
      editedTimestamp: new Date(),
      creator: "",
      lastEditer: {},
      title: "",
      description: "",
      tasks: [],
      sprints: [],
      sprint: "",
      dueDate: null,
      estimate: null,
      labels: [],
      selectedLabels: [],
      editingIssue: false,
      originalTitle: "",
      originalDescription: ""
    };

    this.getData = this.getData.bind(this)
    this.getTasks = this.getTasks.bind(this)
    this.getAllSprints = this.getAllSprints.bind(this)
    this.getAllLables = this.getAllLables.bind(this)
    this.showNewIssueModal = this.showNewIssueModal.bind(this)
    this.showNewTaskModal = this.showNewTaskModal.bind(this)
    this.changeToEditMode = this.changeToEditMode.bind(this)
    this.saveEdit = this.saveEdit.bind(this)
    this.updateSprint = this.updateSprint.bind(this)
    this.updateDueDate = this.updateDueDate.bind(this)
    this.updateLabels = this.updateLabels.bind(this)
    this.updateEstimate = this.updateEstimate.bind(this)
    this.discardEdit = this.discardEdit.bind(this)
    this.onChangeTitle = this.onChangeTitle.bind(this)
    this.onChangeDescription = this.onChangeDescription.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.goToCreatedIssue = this.goToCreatedIssue.bind(this)
  }

  async componentDidMount() {
    await this.getData()
    await this.getTasks()
    await this.getAllLables()
    await this.getAllSprints()
    this.props.finishLoading()
  }

  async componentDidUpdate(prevProps, prevState) {
  if (this.props.match.params.id !== prevProps.match.params.id) { 
      await this.setState({
        showModal: false,
        status: "OPEN",
        creationTimestamp: new Date(),
        editedTimestamp: new Date(),
        creator: "",
        lastEditer: "",
        title: "",
        description: "",
        tasks: [],
        sprints: [],
        sprint: "",
        dueDate: new Date(),
        estimate: null,
        labels: [],
        selectedLabels: [],
        editingIssue: false,
        originalTitle: "",
        originalDescription: ""
      })
      await this.getData()
      await this.getTasks()
      await this.getAllLables()
      await this.getAllSprints()
      this.props.finishLoading()
    }
  }

  componentWillUnmount() {
    this.DataListener()
    this.TasksListener()
  }

  getData() {
    this.DataListener = this.props.firebase
                                  .db
                                  .collection("products")
                                  .doc(this.props.products[this.props.selectedProduct].id)
                                  .collection("stories")
                                  .doc(this.props.match.params.id)
                                  .onSnapshot(function(doc) {
                                    let issue = doc.data()
                                    issue.creationTimestamp = issue.creationTimestamp == null ? new Date() : FsTsToDate(issue.timestamp)
                                    issue.lastUpdateTimestamp = issue.lastUpdateTimestamp == null ? new Date() : FsTsToDate(issue.lastUpdateTimestamp)
                                    issue.dueDate = issue.dueDate == null ? null : FsTsToDate(issue.dueDate)
                                    let tempArray = []
                                    for (const [key, value] of Object.entries(issue.labels)) {
                                      tempArray.push([key, value])
                                    }
                                    issue.labels = tempArray
                                    this.setState({status: issue.status, 
                                                   creationTimestamp: issue.timestamp, 
                                                   editedTimestamp: issue.lastUpdateTimestamp, 
                                                   creator: issue.creator, 
                                                   lastEditer: issue.lastEditer, 
                                                   title: issue.title, 
                                                   description: issue.description, 
                                                   originalTitle: issue.title, 
                                                   originalDescription: issue.description, 
                                                   sprint: issue.sprint,
                                                   selectedLabels: issue.labels,
                                                   dueDate: issue.dueDate,
                                                   estimate: issue.estimate
                                                 });
                                  }.bind(this))
  }

  getTasks() {
    this.TasksListener = this.props.firebase
                                   .db.collection("products")
                                   .doc(this.props.products[this.props.selectedProduct].id)
                                   .collection("stories")
                                   .doc(this.props.match.params.id)
                                   .collection("tasks")
                                   .orderBy("title")
                                   .onSnapshot(function(querySnapshot) {
                                      let tempArray = querySnapshot.docs.map((doc) => {
                                        let obj = doc.data()
                                        obj.id = doc.id
                                        return obj
                                      })
                                      this.setState({tasks: tempArray})
                                    }.bind(this))
  }

  async getAllLables() {
    let docSnapshot = await this.props.firebase
                     .db
                     .collection("products")
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

  async getAllSprints() {
    let querySnapshot = await this.props.firebase
                     .db.collection("products")
                     .doc(this.props.products[this.props.selectedProduct].id)
                     .collection("sprints")
                     .where('dueDate','>',new Date())
                     .get()
    let sprints = querySnapshot.docs.map((doc) => {
      let obj = doc.data()
      obj.id = doc.id
      return obj
    })
    await this.setState({sprints: sprints})
  }

  showNewIssueModal() {
    this.setState({showModal: true, modalContent: "CreateIssue"})
  }

  showNewTaskModal() {
    this.setState({showModal: true, modalContent: "CreateTask"})
  }
  
  changeToEditMode() {
    this.setState({editingIssue: true})
  }

  saveEdit() {
    if(this.state.title == this.state.originalTitle && 
       this.state.description == this.state.originalDescription) 
    {
      this.setState({editingIssue: false})
      return
    }
    this.props.firebase
              .db
              .collection("products")
              .doc(this.props.products[this.props.selectedProduct].id)
              .collection("stories")
              .doc(this.props.match.params.id)
              .update({
                title: this.state.title,
                description: this.state.description,
                lastUpdateTimestamp: this.props.firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
                lastEditer: {
                  uid: this.props.uid,
                  firstname: this.props.firstname,
                  lastname: this.props.lastname
                }
              })
              .then(function() {
                  this.setState({editingIssue: false})
              }.bind(this))
              .catch(function(err) {
                this.setState({editingIssue: false, 
                               title: this.state.originalTitle, 
                               description: this.state.originalDescription
                             })
              }.bind(this))
  }

  updateSprint(sprintId) {
    this.props.firebase
              .db
              .collection("products")
              .doc(this.props.products[this.props.selectedProduct].id)
              .collection("stories")
              .doc(this.props.match.params.id)
              .update({
                sprint: sprintId,
                lastUpdateTimestamp: this.props.firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
                lastEditer: {
                  uid: this.props.uid,
                  firstname: this.props.firstname,
                  lastname: this.props.lastname
                }
              })
  }

  updateDueDate(dueDate) {
    this.props.firebase
              .db.collection("products")
              .doc(this.props.products[this.props.selectedProduct].id)
              .collection("stories")
              .doc(this.props.match.params.id)
              .update({
                dueDate: new Date(dueDate),
                lastUpdateTimestamp: this.props.firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
                lastEditer: {
                  uid: this.props.uid,
                  firstname: this.props.firstname,
                  lastname: this.props.lastname
                }
              })
  }

  updateLabels(labels) {
    this.props.firebase
              .db
              .collection("products")
              .doc(this.props.products[this.props.selectedProduct].id)
              .collection("stories")
              .doc(this.props.match.params.id)
              .update({
                labels: labels,
                lastUpdateTimestamp: this.props.firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
                lastEditer: {
                  uid: this.props.uid,
                  firstname: this.props.firstname,
                  lastname: this.props.lastname
                }
              })
  }

  updateEstimate(estimate) {
    this.props.firebase
              .db
              .collection("products")
              .doc(this.props.products[this.props.selectedProduct].id)
              .collection("stories")
              .doc(this.props.match.params.id)
              .update({
                estimate: estimate,
                lastUpdateTimestamp: this.props.firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
                lastEditer: {
                  uid: this.props.uid,
                  firstname: this.props.firstname,
                  lastname: this.props.lastname
                }
              })
  }

  discardEdit() {
    this.setState({editingIssue: false, 
                   title: this.state.originalTitle, 
                   description: this.state.originalDescription
                 })
  }

  onChangeTitle(e) {
    this.setState({title: e.target.value})
  }

  onChangeDescription(e) {
    this.setState({description: e.target.value})
  }

  closeModal() {
    this.setState({showModal: false})
  }

  goToCreatedIssue(issueId) {
    this.props.history.push('/backlog/issue/'+issueId)
  }

  render() {
    let modalContent;
    if(this.state.modalContent == "CreateIssue") {
      modalContent = <CreateIssue exit={this.closeModal} finished={this.goToCreatedIssue} />
    } else if (this.state.modalContent == "CreateTask") {
      modalContent = <CreateTask exit={this.closeModal} issueId={this.props.match.params.id} />
    }
    return (
        <Wrapper>
          {
            this.state.showModal
            ?
              <Modal content={modalContent} 
                     minWidth={"500px"} 
                     exitModalCallback={this.closeModal} 
              />
            :
              null
          }
          <Body
            status={this.state.status}
            editedTimestamp={this.state.editedTimestamp}
            lastEditer={this.state.lastEditer}
            editingIssue={this.state.editingIssue}
            title={this.state.title}
            description={this.state.description}
            issueId={this.props.match.params.id}
            productId={this.props.products[this.props.selectedProduct].id}
            tasks={this.state.tasks}
            showNewIssueModal={this.showNewIssueModal}
            showNewTaskModal={this.showNewTaskModal}
            onChangeTitle={this.onChangeTitle}
            saveEdit={this.saveEdit}
            discardEdit={this.discardEdit}
            changeToEditMode={this.changeToEditMode}
            onChangeDescription={this.onChangeDescription}
          />
          <SideBar status={this.state.status} 
                   sprints={this.state.sprints} 
                   selectedSprint={this.state.sprint} 
                   dueDate={this.state.dueDate}
                   estimate={this.state.estimate}
                   labels={this.state.labels} 
                   selectedLabels={this.state.selectedLabels} 
                   updateSprint={this.updateSprint} 
                   updateDueDate={this.updateDueDate} 
                   updateLabels={this.updateLabels}
                   updateEstimate={this.updateEstimate}
          />
        </Wrapper>
    );
  }
}

IssuePage.propTypes = {
  finishLoading: PropTypes.func.isRequired,
  uid: PropTypes.string.isRequired,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
  selectedProduct: PropTypes.string.isRequired,
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

const connectedIssuePage = connect(mapStateToProps)(IssuePage);
const firebaseIssuePage = withRouter(compose(withFirebase)(connectedIssuePage))
export { firebaseIssuePage as IssuePage };
