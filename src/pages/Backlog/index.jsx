import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from '../../sharedComponents/Firebase';

import Modal from '../../sharedComponents/Modal';
import Issue from './components/Issue'
import CreateIssue from './components/CreateIssue'

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 50px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const Header = styled.div`
  background-color: white;
  width: 100%;
  height: 90px;
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`

const StateTabs = styled.div`
  display: flex;
  flex-direction: row;
`

const Tab = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;

  ${props => props.activeIndex == props.index ? "border-bottom: 2px solid #000000;" : null}
  ${props => props.activeIndex == props.index ? "font-weight: bold;" : null}

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
     -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
`

const NewIssue = styled.button`
  width: 88px;
  height: 35px;
  background-color: #1aaa55;
  border-color: #168f48;
  color: #ffffff;
  border-radius: 3px;
`

const Search = styled.div`
  flex-grow: 1;
  display: flex;
`

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  flex-grow: 1;
`

const Body = styled.div`
  width: 100%;
  flex-grow: 1;
  background-color: #ffffff;
  overflow: scroll;
  padding: 5px;
  box-sizing: border-box;
`

class Backlog extends React.PureComponent {

 constructor(props) {
    super(props)

    this.state = {
      issues: [],
      labels: [],
      sprints: [],
      activeTab: 0,
      showModal: false
    };

    this.tabClicked = this.tabClicked.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.sendIssue = this.sendIssue.bind(this)
    this.getIssues = this.getIssues.bind(this)
    this.getLabels = this.getLabels.bind(this)
    this.getSprints = this.getSprints.bind(this)
    this.getPrettyCreationDate = this.getPrettyCreationDate.bind(this)
    this.getTasks = this.getTasks.bind(this)
  }

  componentDidMount() {
    this.getIssues()
    this.getLabels()
    this.getSprints()
  }

  getIssues() {
    let ref;
    if(this.state.activeTab === 0) {
      ref = this.props.firebase.db.collection("products").doc(this.props.products[this.props.selectedProduct].id).collection("stories").where("status", "==", "OPEN")
    }else if(this.state.activeTab === 1) {
      ref = this.props.firebase.db.collection("products").doc(this.props.products[this.props.selectedProduct].id).collection("stories").where("status", "==", "CLOSED")
    } else {
      ref = this.props.firebase.db.collection("products").doc(this.props.products[this.props.selectedProduct].id).collection("stories")
    }
    let issues = ref.get().then(function(querySnapshot) {
      let tempArray = [];
      querySnapshot.forEach(function (doc) {
        if(doc.id == "--STATS--") {
          return
        }
        let obj = doc.data()
        obj.id = doc.id
        tempArray.push(obj)
      });
      return tempArray
    });
    issues.then(data => this.setState({issues: data}))
  }

  getTasks(id) {
    return this.props.firebase.db.collection("products").doc(this.props.products[this.props.selectedProduct].id).collection("stories").doc(id).collection("tasks").get().then(function(querySnapshot) {
      let tempArray = []
      querySnapshot.forEach(function (doc) {
        tempArray.push(doc.data())
      });
      return tempArray
    })
  }

  getLabels() {
    let labels = this.props.firebase.db.collection("products").doc(this.props.products[this.props.selectedProduct].id).collection("labels").get().then(function(querySnapshot) {
      let tempArray = [];
      querySnapshot.forEach(function (doc) {
        tempArray.push(doc.id)
      });
      return tempArray
    });
    labels.then(data => this.setState({labels: data}))
  }

  getSprints() {
    let sprints = this.props.firebase.db.collection("products").doc(this.props.products[this.props.selectedProduct].id).collection("sprints").get().then(function(querySnapshot) {
      let tempArray = [];
      querySnapshot.forEach(function (doc) {
        tempArray.push(doc.data())
      });
      return tempArray
    });
    sprints.then(data => this.setState({sprints: data}))
  }

  tabClicked(e) {
    this.setState({activeTab: parseInt(e.target.dataset.index)}, function() {
      this.getIssues()
    }.bind(this))
  }

  closeModal() {
    this.setState({showModal: false})
  }

  sendIssue(issue) {
    issue.timestamp = this.props.firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp()
    issue.lastUpdateTimestamp = this.props.firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp()
    issue.creator = {
      uid: this.props.uid,
      firstname: this.props.firstname,
      lastname: this.props.lastname
    }
    issue.lastEditer = {
      uid: this.props.uid,
      firstname: this.props.firstname,
      lastname: this.props.lastname
    }

    var issueRef = this.props.firebase.db.collection("products").doc(this.props.products[this.props.selectedProduct].id).collection("stories").doc();

    var incrementRef = this.props.firebase.db.collection("products").doc(this.props.products[this.props.selectedProduct].id).collection("stories").doc("--STATS--");

    return this.props.firebase.db.runTransaction(function(transaction) {
      return transaction.get(incrementRef).then(function(incrementValueDoc) {
          var incrementValue;
          if (!incrementValueDoc.exists) {
            incrementValue = 0;
          } else {
            incrementValue = incrementValueDoc.data().count;
          }

          issue.number = incrementValue

          transaction.set(issueRef, issue)
          transaction.set(incrementRef, {count: this.props.firebase.db.app.firebase_.firestore.FieldValue.increment(1)}, {merge: true})
      }.bind(this));
    }.bind(this)).then(function() {
        console.log("Transaction successfully committed!");
    }).catch(function(error) {
        console.log("Transaction failed: ", error);
    });
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

  render() {
      return (
        <Wrapper>
          {
            this.state.showModal
            ?
            <Modal content={<CreateIssue labels={this.state.labels} sprints={this.state.sprints} exit={this.closeModal} sendIssue={this.sendIssue} />} minWidth={"800px"} exitModalCallback={this.closeModal} />
            :
            null
          }
          <Content>
            <Header> 
              <Controls> 
                <StateTabs> 
                  <Tab activeIndex={this.state.activeTab} index={0} data-index={0} onClick={this.tabClicked}>Open</Tab>
                  <Tab activeIndex={this.state.activeTab} index={1} data-index={1} onClick={this.tabClicked}>Closed</Tab>
                  <Tab activeIndex={this.state.activeTab} index={2} data-index={2} onClick={this.tabClicked}>All</Tab>
                </StateTabs>
                <NewIssue onClick={(e) => {this.setState({showModal: true})}}>New Issue</NewIssue>
              </Controls>
              <Search> 
                <SearchInput placeholder="Search..." />
              </Search>
            </Header>
            <Body>
              {
                this.state.issues && this.state.issues.map((issue, index) => <Issue key={issue.id} getTasks={this.getTasks} id={issue.id} title={issue.title} number={issue.number} creationDate={this.getPrettyCreationDate(new Date(issue.timestamp.nanoseconds/1000000 + issue.timestamp.seconds*1000))} creator={issue.creator ? issue.creator.firstname.charAt(0).toUpperCase() + issue.creator.firstname.slice(1) + " " + issue.creator.lastname : ""} updated={this.getPrettyCreationDate(new Date(issue.lastUpdateTimestamp.nanoseconds/1000000 + issue.lastUpdateTimestamp.seconds*1000))} status={issue.status} />)
              }
            </Body>
          </Content>
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

const connectedBacklog = connect(mapStateToProps)(Backlog);
const firebaseBacklog = compose(withFirebase)(connectedBacklog)
export { firebaseBacklog as Backlog };