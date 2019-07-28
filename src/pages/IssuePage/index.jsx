import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from '../../sharedComponents/Firebase';

import { Task } from './components/Task';
import SideBar from './components/Sidebar';

import Modal from '../../sharedComponents/Modal';
import { CreateIssue } from '../../sharedComponents/CreateIssue';

import styled from 'styled-components';

import { EditAlt } from 'styled-icons/boxicons-regular/EditAlt';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: calc(100% - 200px) 200px;
  grid-template-rows: 100%;
`;

const Issue = styled.div`
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 50px;
  box-sizing: border-box
`

const IssueContent = styled.div`
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  padding: 10px 5px 10px 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e8e8e8;
`

const Left = styled.div`

`

const Right = styled.div`

`

const Button = styled.button`
  background-color: ${props => props.backgroundColor};
  border: 1px solid ${props => props.borderColor};
  padding: 6px 10px 6px 10px;
  color: #ffffff;
  border-radius: 3px;
  margin-left: 5px;
`

const EditButton = styled.div`
  display: flex;
  flex-direction: row;
`

const Status = styled.div`
  background-color: ${props => props.status === "Open" ? "#1aaa55" : "#1f78d1"};
  display: inline-block;
  height: auto;
  align-self: center;
  padding: 4px;
  border-radius: 3px;
  margin-right: 10px;
  color: white;
`

const InfoBody = styled.div`
  padding: 0px 5px 0px 5px;
  border-bottom: 1px solid #e8e8e8;
`

const TitleWrapper = styled.div`
  margin-top: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Title = styled.h2`
  margin-block-start: 0em;
  margin-block-end: 0em;
`

const TitleEdit = styled.input`
  width: 100%;
`

const Edit = styled(EditAlt)`
  padding: 5px;
  border: 1px solid #e8e8e8;
  border-radius: 3px;
`

const Description = styled.div`
  margin-bottom: 5px;
  margin-top: 5px;
`

const DescriptionEdit = styled.textarea`
  margin-bottom: 5px;
  margin-top: 5px;
  resize: none;
  width: 100%;
  min-height: 80px;
`

const TasksWrapper = styled.div`
  min-height: 100px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #e8e8e8;
`

const Tasks = styled.div`
  overflow: scroll;
`

const TasksHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Comment = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  flex-grow: 1;
`

const TextArea = styled.textarea`
  resize: none;
  width: 100%;
  min-height: 140px;
  flex-grow: 1;
`

const SubmitButton = styled.button`
  padding: 6px 10px 6px 10px;
  color: #ffffff;
  border-radius: 3px;
  background-color: #1aaa55;
  margin-top: 5px;
  width: fit-content;
`


class IssuePage extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      status: "OPEN",
      creationTimestamp: new Date(),
      editedTimestamp: new Date(),
      creator: "Andreas Jonassen",
      lastEditer: "Andreas Jonassen",
      title: "",
      description: "",
      tasks: [],
      sprint: "",
      dueDate: new Date(),
      labels: [],
      editingIssue: false,
      originalTitle: "",
      originalDescription: ""
    };

    this.getData = this.getData.bind(this)
    this.getTasks = this.getTasks.bind(this)
    this.getAllSprints = this.getAllSprints.bind(this)
    this.getAllLables = this.getAllLables.bind(this)
    this.issueStatusChange = this.issueStatusChange.bind(this)
    this.changeToEditMode = this.changeToEditMode.bind(this)
    this.saveEdit = this.saveEdit.bind(this)
    this.updateSprint = this.updateSprint.bind(this)
    this.updateDueDate = this.updateDueDate.bind(this)
    this.updateLabels = this.updateLabels.bind(this)
    this.discardEdit = this.discardEdit.bind(this)
    this.onChangeTitle = this.onChangeTitle.bind(this)
    this.onChangeDescription = this.onChangeDescription.bind(this)
    this.getPrettyCreationDate = this.getPrettyCreationDate.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.goToCreatedIssue = this.goToCreatedIssue.bind(this)
  }

  async componentDidMount() {
    await this.getData()
    await this.getTasks()
    this.props.finishLoading()
  }

  componentDidUpdate(prevProps, prevState) {
  if (this.props.match.params.id !== prevProps.match.params.id) { 
      this.setState({
        showModal: false,
        status: "OPEN",
        creationTimestamp: new Date(),
        editedTimestamp: new Date(),
        creator: "Andreas Jonassen",
        lastEditer: "Andreas Jonassen",
        title: "",
        description: "",
        tasks: [],
        sprint: "",
        dueDate: new Date(),
        labels: [],
        editingIssue: false,
        originalTitle: "",
        originalDescription: ""
      }, function() {
        this.getData()
        this.getTasks()
      })
    }
  }

  componentWillUnmount() {
    this.DataListener()
    this.TasksListener()
  }

  getData() {
    this.DataListener = this.props.firebase.db.collection("products").doc(this.props.products[this.props.selectedProduct].id).collection("stories").doc(this.props.match.params.id).onSnapshot(function(doc) {
      let issue = doc.data()
      issue.creationTimestamp = issue.creationTimestamp == null ? new Date() : new Date(issue.timestamp.nanoseconds/1000000 + issue.timestamp.seconds*1000)
      issue.lastUpdateTimestamp = issue.lastUpdateTimestamp == null ? new Date() : new Date(issue.lastUpdateTimestamp.nanoseconds/1000000 + issue.lastUpdateTimestamp.seconds*1000)
      this.setState({status: issue.status, creationTimestamp: issue.timestamp, editedTimestamp: issue.lastUpdateTimestamp, creator: issue.creator, lastEditer: issue.lastEditer, title: issue.title, description: issue.description, originalTitle: issue.title, originalDescription: issue.description, sprint: issue.sprint, dueDate: new Date(issue.dueDate.nanoseconds/1000000 + issue.dueDate.seconds*1000), labels: issue.labels});
    }.bind(this))
  }

  getTasks() {
    this.TasksListener = this.props.firebase.db.collection("products").doc(this.props.products[this.props.selectedProduct].id).collection("stories").doc(this.props.match.params.id).collection("tasks").orderBy("title").onSnapshot(function(querySnapshot) {
      let tempArray = [];
      querySnapshot.forEach(function (doc) {
        let obj = doc.data()
        obj.id = doc.id
        tempArray.push(obj)
      });
      this.setState({tasks: tempArray})
    }.bind(this))
  }

  getAllLables() {
    return this.props.firebase.db.collection("products").doc(this.props.products[this.props.selectedProduct].id).collection("labels").doc("list").get().then(function(doc) {
      return doc.data().list
    });
  }

  getAllSprints() {
    return this.props.firebase.db.collection("products").doc(this.props.products[this.props.selectedProduct].id).collection("sprints").get().then(function(querySnapshot) {
      let tempArray = [];
      querySnapshot.forEach(function (doc) {
        let tempObj = doc.data()
        tempObj.id = doc.id
        tempArray.push(tempObj)
      });
      return tempArray
    });
  }

  issueStatusChange() {
    this.props.firebase.db.collection("products").doc(this.props.products[this.props.selectedProduct].id).collection("stories").doc(this.props.match.params.id).update({
      status: this.state.status.toLowerCase() == "open" ? "CLOSED" : "OPEN",
      lastUpdateTimestamp: this.props.firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
      lastEditer: {
        uid: this.props.uid,
        firstname: this.props.firstname,
        lastname: this.props.lastname
      }
    })
  }
  
  changeToEditMode() {
    this.setState({editingIssue: true})
  }

  saveEdit() {
    if(this.state.title == this.state.originalTitle && this.state.description == this.state.originalDescription) {
      this.setState({editingIssue: false})
      return
    }
    this.props.firebase.db.collection("products").doc(this.props.products[this.props.selectedProduct].id).collection("stories").doc(this.props.match.params.id).update({
      title: this.state.title,
      description: this.state.description,
      lastUpdateTimestamp: this.props.firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
      lastEditer: {
        uid: this.props.uid,
        firstname: this.props.firstname,
        lastname: this.props.lastname
      }
    }).then(function() {
      this.setState({editingIssue: false})
    }.bind(this)).catch(function(err) {
      this.setState({editingIssue: false, title: this.state.originalTitle, description: this.state.originalDescription})
    }.bind(this))
  }

  updateSprint(sprintId) {
    this.props.firebase.db.collection("products").doc(this.props.products[this.props.selectedProduct].id).collection("stories").doc(this.props.match.params.id).update({
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
    this.props.firebase.db.collection("products").doc(this.props.products[this.props.selectedProduct].id).collection("stories").doc(this.props.match.params.id).update({
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
    this.props.firebase.db.collection("products").doc(this.props.products[this.props.selectedProduct].id).collection("stories").doc(this.props.match.params.id).update({
      labels: labels,
      lastUpdateTimestamp: this.props.firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
      lastEditer: {
        uid: this.props.uid,
        firstname: this.props.firstname,
        lastname: this.props.lastname
      }
    })
  }

  discardEdit() {
    this.setState({editingIssue: false, title: this.state.originalTitle, description: this.state.originalDescription})
  }

  onChangeTitle(e) {
    this.setState({title: e.target.value})
  }

  onChangeDescription(e) {
    this.setState({description: e.target.value})
  }

  getPrettyCreationDate(date) {
    let deltaTime = ((new Date()).getTime() - date.getTime())
    // less than 1 second
    if(deltaTime < 1000) {
      return "less than 1 second"
    // less than 1 minute ago
    } else if(deltaTime < 60000) {
      return Math.floor(deltaTime/1000) + " seconds ago"
    // less than 1 hour ago
    } else if(deltaTime < 3600000) {
      return Math.floor(deltaTime/60000) + " minutes ago"
    // less than 1 day
    } else if(deltaTime < 86400000) {
      return Math.floor(deltaTime/3600000) + " hours ago"
    // less than 1 week ago
    } else if(deltaTime < 604800000) {
      return Math.floor(deltaTime/86400000) + " days ago"
    // less than 1 month ago
    } else if(deltaTime < 2628000000) {
      return Math.floor(deltaTime/604800000) + " weeks ago"
    // less than 1 year ago
    } else if(deltaTime < 31540000000) {
      return Math.floor(deltaTime/2628000000) + " months ago"
    // more than a year ago
    } else {
      return Math.floor(deltaTime/31540000000) + " years ago"
    }
  }

  closeModal() {
    this.setState({showModal: false})
    console.log(this.context.history)
  }

  goToCreatedIssue(issueId) {
    this.props.history.push('/backlog/issue/'+issueId)
  }

  render() {
    return (
        <Wrapper>
          {
            this.state.showModal
            ?
            <Modal content={<CreateIssue exit={this.closeModal} finished={this.goToCreatedIssue} />} minWidth={"800px"} exitModalCallback={this.closeModal} />
            :
            null
          }
          <Issue>
            <IssueContent>
              <Header>
                <Left>
                  <Status status={this.state.status}>{this.state.status}</Status>
                  <span>Edited {this.getPrettyCreationDate(this.state.editedTimestamp)} by</span> <b>{this.state.lastEditer ? this.state.lastEditer.firstname + " " + this.state.lastEditer.lastname : ""}</b>
                </Left>
                <Right>
                  <Button backgroundColor={"#fc9403"} borderColor={"#de7e00"} onClick={(e) => this.issueStatusChange()}>{this.state.status.toLowerCase() == "open" ? "Close" : "Reopen"}</Button>
                  <Button backgroundColor={"#1aaa55"} borderColor={"#168f48"} onClick={(e) => this.setState({showModal: true})}>New Issue</Button>
                </Right>
              </Header>
              <InfoBody>
                <TitleWrapper>
                  {this.state.editingIssue ? <TitleEdit value={this.state.title} onChange={this.onChangeTitle} /> : <Title>{this.state.title}</Title>}
                  {this.state.status.toLowerCase() == "open" ? this.state.editingIssue ? <EditButton><Button onClick={(e) => this.saveEdit()} backgroundColor={"#1f78d1"} borderColor={"#16528e"}>Save</Button> <Button onClick={(e) => this.discardEdit()} backgroundColor={"#dc0011"} borderColor={"#b0000e"}>Discard</Button></EditButton> : <Edit onClick={(e) => this.changeToEditMode()} size="1em" /> : null}
                </TitleWrapper>
                {
                  this.state.editingIssue 
                  ?
                    <DescriptionEdit value={this.state.description} onChange={this.onChangeDescription} />
                  :
                  <Description>
                    {this.state.description}
                  </Description>
                }
              </InfoBody>
              <TasksWrapper>
                <TasksHeader>
                  <h2>Tasks</h2>
                  {
                    this.state.status.toLowerCase() === "open"
                    ?
                      <Button backgroundColor={"#1aaa55"} borderColor={"#168f48"}>New Task</Button>
                    :
                      null
                  }
                </TasksHeader>
                <Tasks>
                  {
                    this.state.tasks && this.state.tasks.map((task, index) => <Task issueStatus={this.state.status} key={task.id} issueId={this.props.match.params.id} taskId={task.id} title={task.title} description={task.description} status={task.status} assignee={task.assignee} />)
                  }
                </Tasks>
              </TasksWrapper>
              <Comment>
                <TextArea />
                <SubmitButton>Comment</SubmitButton>
              </Comment>
            </IssueContent>
          </Issue>
          <SideBar status={this.state.status} sprints={this.getAllSprints} selectedSprint={this.state.sprint} dueDate={this.state.dueDate} labels={this.getAllLables} selectedLabels={this.state.labels} updateSprint={this.updateSprint} updateDueDate={this.updateDueDate} updateLabels={this.updateLabels} />
        </Wrapper>
    );
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

const connectedIssuePage = connect(mapStateToProps)(IssuePage);
const firebaseIssuePage = withRouter(compose(withFirebase)(connectedIssuePage))
export { firebaseIssuePage as IssuePage };
