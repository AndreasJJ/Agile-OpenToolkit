import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from '../../sharedComponents/Firebase';
import { withRouter } from 'react-router-dom';

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

const SideBar = styled.div`
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

const TaskWrapper = styled.div`
  min-height: 100px;
  padding: 5px;
  display: flex;
  flex-direction: column;
`

const Tasks = styled.div`
  overflow: scroll;
`

const Task = styled.div`

`

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const TaskTitle = styled.h3`
  font-size: 1.17em;
  margin-block-start: 0em;
  margin-block-end: 0em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
`

const TaskAssignee = styled.span`

`

const TaskDescription = styled.div`

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
      status: "OPEN",
      creationTimestamp: "1 day ago",
      editedTimestamp: "1 day ago",
      creator: "Andreas Jonassen",
      lastEditer: "Andreas Jonassen",
      title: "Test issue",
      description: "This is a test description",
      tasks: [],
      sprint: 1,
      dueDate: 0,
      labels: [],
      editingIssue: false
    };

    this.getData = this.getData.bind(this)
    this.getTasks = this.getTasks.bind(this)
    this.issueStatusChange = this.issueStatusChange.bind(this)
    this.changeToEditMode = this.changeToEditMode.bind(this)
    this.saveEdit = this.saveEdit.bind(this)
    this.getPrettyCreationDate = this.getPrettyCreationDate.bind(this)
  }

  componentDidMount() {
    this.getData()
    this.getTasks()
  }

  getData() {
    this.props.firebase.db.collection("products").doc(this.props.products[this.props.selectedProduct].id).collection("stories").doc(this.props.match.params.id).onSnapshot(function(doc) {
      let issue = doc.data()
      this.setState({status: issue.status, creationTimestamp: issue.timestamp, editedTimestamp: issue.lastUpdateTimestamp, creator: issue.creator, lastEditer: issue.lastEditer, title: issue.title, description: issue.description, sprint: issue.sprint, dueDate: issue.dueDate, labels: issue.labels});
    }.bind(this))
  }

  getTasks() {
    this.props.firebase.db.collection("products").doc(this.props.products[this.props.selectedProduct].id).collection("stories").doc(this.props.match.params.id).collection("tasks").onSnapshot(function(querySnapshot) {
      let tempArray = [];
      querySnapshot.forEach(function (doc) {
        let obj = doc.data()
        obj.id = doc.id
        tempArray.push(obj)
      });
      this.setState({tasks: tempArray})
    }.bind(this))
  }

  issueStatusChange() {
    this.props.firebase.db.collection("products").doc(this.props.products[this.props.selectedProduct].id).collection("stories").doc(this.props.match.params.id).update({
      status: this.state.status.toLowerCase() == "open" ? "CLOSED" : "OPEN"
    })
  }
  
  changeToEditMode() {
    this.setState({editingIssue: true})
  }

  saveEdit() {
    this.setState({editingIssue: false})
  }

  discardEdit() {
    this.setState({editingIssue: false})
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

  static Task = (props) => (
    <Task>
      <TaskHeader>
        <TaskTitle>
          {props.title}
        </TaskTitle>
        <TaskAssignee>
          {props.assignee ? "Assigned: " + props.assignee.firstname.charAt(0).toUpperCase() + props.assignee.firstname.slice(1) + " " + props.assignee.lastname : ""}
        </TaskAssignee>
      </TaskHeader>
      <TaskDescription>
        {props.description}
      </TaskDescription>
    </Task>
  );

  render() {
    return (
        <Wrapper>
          <Issue>
            <IssueContent>
              <Header>
                <Left>
                  <Status status={this.state.status}>{this.state.status}</Status>
                  <span>Edited {this.getPrettyCreationDate(new Date(this.state.editedTimestamp.nanoseconds/1000000 + this.state.editedTimestamp.seconds*1000))} by</span> <b>{this.state.lastEditer ? this.state.lastEditer.firstname + " " + this.state.lastEditer.lastname : ""}</b>
                </Left>
                <Right>
                  <Button backgroundColor={"#fc9403"} borderColor={"#de7e00"} onClick={(e) => this.issueStatusChange()}>{this.state.status.toLowerCase() == "open" ? "Close" : "Reopen"}</Button>
                  <Button backgroundColor={"#1aaa55"} borderColor={"#168f48"}>New Issue</Button>
                </Right>
              </Header>
              <InfoBody>
                <TitleWrapper>
                  {this.state.editingIssue ? <TitleEdit value={this.state.title} /> : <Title>{this.state.title}</Title>}
                  {this.state.status.toLowerCase() == "open" ? this.state.editingIssue ? <EditButton><Button onClick={(e) => this.saveEdit()} backgroundColor={"#1f78d1"} borderColor={"#16528e"}>Save</Button> <Button onClick={(e) => this.discardEdit()} backgroundColor={"#dc0011"} borderColor={"#b0000e"}>Discard</Button></EditButton> : <Edit onClick={(e) => this.changeToEditMode()} size="1em" /> : null}
                </TitleWrapper>
                {
                  this.state.editingIssue 
                  ?
                    <DescriptionEdit value={this.state.description} />
                  :
                  <Description>
                    {this.state.description}
                  </Description>
                }
              </InfoBody>
              <TaskWrapper>
                <h2>Tasks</h2>
                <Tasks>
                  {
                    this.state.tasks && this.state.tasks.map((task, index) => <IssuePage.Task key={task.id} title={task.title} description={task.description} status={task.status} assignee={task.assignee} />)
                  }
                </Tasks>
              </TaskWrapper>
              <Comment>
                <TextArea />
                <SubmitButton>Comment</SubmitButton>
              </Comment>
            </IssueContent>
          </Issue>
          <SideBar>

          </SideBar>
        </Wrapper>
    );
  }
}

function mapStateToProps(state) {
    const { products, selectedProduct } = state.product;
    return {
      products,
      selectedProduct
    };
}

const connectedIssuePage = withRouter(connect(mapStateToProps)(IssuePage));
const firebaseIssuePage = compose(withFirebase)(connectedIssuePage)
export { firebaseIssuePage as IssuePage };
