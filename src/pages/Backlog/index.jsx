import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from '../../sharedComponents/Firebase';

import { getPrettyCreationDate, FsTsToDate } from '../../sharedComponents/Utility';

import Modal from '../../sharedComponents/Modal';
import { Issue } from './components/Issue';
import { CreateIssue } from '../../sharedComponents/CreateIssue';
import Select from '../../sharedComponents/Select';

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

const LabelSort = styled.select`
  height: 100%;
  width: 200px;
  margin-left: 10px;
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
      loading: true,
      labels: [],
      selectedLabel: 0,
      issues: [],
      originalIssues: [],
      activeTab: 0,
      showModal: false
    };

    this.getIssues = this.getIssues.bind(this)
    this.tabClicked = this.tabClicked.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.getAllLables = this.getAllLables.bind(this)
    this.filterIssues = this.filterIssues.bind(this)
    this.onLabelSelectChange = this.onLabelSelectChange.bind(this)
  }

  async componentDidMount() {
    await this.getIssues()
    await this.props.finishLoading()
    await this.getAllLables()
    await this.setState({loading: false})
  }

  async getIssues() {
    let ref;
    if(this.state.activeTab === 0) {
      ref = this.props.firebase
                      .db
                      .collection("products")
                      .doc(this.props.products[this.props.selectedProduct].id)
                      .collection("stories")
                      .where("status", "==", "OPEN").orderBy("timestamp")
    }else if(this.state.activeTab === 1) {
      ref = this.props.firebase
                      .db.collection("products")
                      .doc(this.props.products[this.props.selectedProduct].id)
                      .collection("stories")
                      .where("status", "==", "CLOSED")
                      .orderBy("timestamp")
    } else {
      ref = this.props.firebase
                      .db.collection("products")
                      .doc(this.props.products[this.props.selectedProduct].id)
                      .collection("stories")
                      .orderBy("timestamp")
    }
    let querySnapshot = await ref.get()
    let issues = querySnapshot.docs.filter((doc) => doc.id != "--STATS--").map((doc) => {
      let obj = doc.data()
      obj.id = doc.id
      return obj
    })
    await this.setState({issues: issues, originalIssues: issues})
    this.filterIssues()
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
        tempArray.push({id: key, color: value.color, description: value.description})
      }
      this.setState({labels: tempArray})
    } else {
      this.setState({labels: []})
    }
  }

  filterIssues() {
    if(this.state.selectedLabel == 0) {
      this.setState({
        issues: this.state.originalIssues
      })
    } else {
      let filtered = this.state.originalIssues.filter((issue) => {
        if(!issue.labels) { return }
        if(Object.keys(issue.labels).includes(this.state.labels[this.state.selectedLabel-1].id)) {
          return issue
        }
      })
      this.setState({issues: filtered})
    }
  }

  async onLabelSelectChange(e) {
    await this.setState({selectedLabel: e.target.value})
    this.filterIssues()
  }

  tabClicked(e) {
    this.setState({activeTab: parseInt(e.target.dataset.index)}, () => this.getIssues())
  }

  closeModal() {
    this.setState({showModal: false})
  }

  render() {
      return (
        <Wrapper>
          {
            this.state.showModal
            ?
              <Modal content={<CreateIssue 
                     exit={this.closeModal} 
                     finished={this.getIssues} />} 
                     minWidth={"800px"} 
                     exitModalCallback={this.closeModal} 
              />
            :
              null
          }
          <Content>
            <Header> 
              <Controls> 
                <StateTabs> 
                  <Tab activeIndex={this.state.activeTab} index={0} data-index={0} onClick={this.tabClicked}>
                    Open
                  </Tab>
                  <Tab activeIndex={this.state.activeTab} index={1} data-index={1} onClick={this.tabClicked}>
                    Closed
                  </Tab>
                  <Tab activeIndex={this.state.activeTab} index={2} data-index={2} onClick={this.tabClicked}>
                    All
                  </Tab>
                </StateTabs>
                <NewIssue onClick={(e) => {this.setState({showModal: true})}}>
                  New Issue
                </NewIssue>
              </Controls>
              <Search> 
                <SearchInput placeholder="Search..." />
                <Select styling="height: 100%; width: 200px; margin-left: 10px;" placeholderText="Select label" list={this.state.labels} value={this.state.selectedLabel} onChange={this.onLabelSelectChange} textName="id" keyName="id" />
              </Search>
            </Header>
            <Body> 
              {
                this.state.loading
                ?
                  (["skeletonIssue1", "skeletonIssue2", "skeletonIssue3", "skeletonIssue4", "skeletonIssue5", "skeletonIssue6"]).map((key, index) => 
                      <Issue skeleton={true} 
                             key={key} 
                             getTasks={() => false} 
                             id={""} 
                             title={"This is a skeleton title"} 
                             number={0} 
                             creationDate={getPrettyCreationDate(new Date())} 
                             creator={"god himself"} 
                             updated={getPrettyCreationDate(new Date())} 
                             status={"OPEN"} />
                    )
                :
                  this.state.issues && this.state.issues.map((issue, index) => 
                      <Issue skeleton={false} 
                             key={issue.id} 
                             issueId={issue.id} 
                             productId={this.props.products[this.props.selectedProduct].id}
                             title={issue.title} 
                             number={issue.number} 
                             creationDate={getPrettyCreationDate(FsTsToDate(issue.timestamp))} 
                             creator={issue.creator ? issue.creator.firstname.charAt(0).toUpperCase() + issue.creator.firstname.slice(1) + " " + issue.creator.lastname : ""} 
                             updated={getPrettyCreationDate(FsTsToDate(issue.lastUpdateTimestamp))} 
                             status={issue.status} />
                    )
              }
            </Body>
          </Content>
        </Wrapper>
      );
  }
}

Backlog.propTypes = {
  finishLoading: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
  selectedProduct: PropTypes.string.isRequired
}

function mapStateToProps(state) {
    const { products, selectedProduct } = state.product;
    return {
        products,
        selectedProduct
    };
}

const connectedBacklog = connect(mapStateToProps)(Backlog);
const firebaseBacklog = compose(withFirebase)(connectedBacklog)
export { firebaseBacklog as Backlog };