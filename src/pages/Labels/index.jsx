import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from '../../sharedComponents/Firebase';

import Modal from '../../sharedComponents/Modal';
import { CreateLabel } from './components/CreateLabel';

import LabelCard from './components/LabelCard';

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
  background-color: #ffffff;
`

const Header = styled.div`
  background-color: white;
  width: 100%;
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

const List = styled.div`
  width: 100%;
  flex-grow: 1;
  overflow: scroll;
  padding: 5px;
  box-sizing: border-box;
`

class Labels extends React.PureComponent {

 constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      loading: true,
      activeTab: 0,
      labels: [],
      subscribedLabels: []
    };
    this.tabClicked = this.tabClicked.bind(this)
    this.getLabels = this.getLabels.bind(this)
    this.getSubscribedLabels = this.getSubscribedLabels.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.deleteLabel = this.deleteLabel.bind(this)
    this.subscribeToLabel = this.subscribeToLabel.bind(this)
    this.unsubscribeToLabel = this.unsubscribeToLabel.bind(this)
  }

 async componentDidMount() {
    await this.getSubscribedLabels()
    await this.getLabels()
    this.props.finishLoading()
  }

  async getLabels() {
    let ref;
    if(this.state.activeTab === 0) {
      ref = this.props.firebase
                      .db.collection("products")
                      .doc(this.props.products[this.props.selectedProduct].id)
                      .collection("labels")
                      .doc("list")
    } else {
      ref = this.props.firebase
                      .db
                      .collection("products")
                      .doc(this.props.products[this.props.selectedProduct].id)
                      .collection("labels")
                      .doc("list")
    }
    let docSnapshot = await ref.get()
    if(docSnapshot.data()) {
      let tempArray = []
      for (const [key, value] of Object.entries(docSnapshot.data().list)) {
        tempArray.push([key, value])
      }
      this.setState({labels: tempArray, loading: false})
    } else {
      this.setState({labels: [], loading: false})
    }
  }

  async getSubscribedLabels() {
    let memberInfo = await this.props.firebase
              .db
              .collection("products")
              .doc(this.props.products[this.props.selectedProduct].id)
              .collection("members")
              .doc(this.props.uid)
              .get()
    await this.setState({subscribedLabels: memberInfo.data().subscribedLabels});
  }

  tabClicked(e) {
    this.setState({activeTab: parseInt(e.target.dataset.index)})
  }

  closeModal() {
    this.setState({showModal: false})
  }

  async deleteLabel(name) {
    await this.props.firebase
              .db
              .collection("products")
              .doc(this.props.products[this.props.selectedProduct].id)
              .collection("labels")
              .doc("list")
              .update({["list." + name] : this.props.firebase.db.app.firebase_.firestore.FieldValue.delete()})
    this.getLabels()
  }

  async subscribeToLabel(name) {
   await this.props.firebase
            .db
            .collection("products")
            .doc(this.props.products[this.props.selectedProduct].id)
            .collection("members")
            .doc(this.props.uid)
            .update({
              subscribedLabels: this.props.firebase.db.app.firebase_.firestore.FieldValue.arrayUnion(name)
            })
    await this.getSubscribedLabels()

  }

  async unsubscribeToLabel(name) {
    await this.props.firebase
              .db
              .collection("products")
              .doc(this.props.products[this.props.selectedProduct].id)
              .collection("members")
              .doc(this.props.uid)
              .update({
                subscribedLabels: this.props.firebase.db.app.firebase_.firestore.FieldValue.arrayRemove(name)
              })
    await this.getSubscribedLabels()
  }

  render() {
      let labels = this.state.labels
      if(this.state.activeTab == 1) {
        labels = this.state.labels.filter((label) => this.state.subscribedLabels.indexOf(label[0]) > -1)
      }
      return (
        <Wrapper>
        {
            this.state.showModal
            ?
              <Modal content={<CreateLabel 
                                exit={this.closeModal}
                                finished={this.getLabels}
                              />
                              } 
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
                    All
                  </Tab>
                  <Tab activeIndex={this.state.activeTab} index={1} data-index={1} onClick={this.tabClicked}>
                    Subscribed
                  </Tab>
                </StateTabs>
                <NewIssue onClick={(e) => {this.setState({showModal: true})}}>
                  New Label
                </NewIssue>
              </Controls>
            </Header>
            <List>
            {
              this.state.loading
                ?
                  <LabelCard name={"skeleton"} skeleton={true}/>
                :
                  labels && labels.map((label, index) =>
                    <LabelCard key={label[0]} 
                               name={label[0]} 
                               description={label[1].description} 
                               bgc={label[1].color}
                               subscribed={this.state.subscribedLabels ? this.state.subscribedLabels.indexOf(label[0]) > -1 : false}
                               subscribe={this.subscribeToLabel}
                               unsubscribe={this.unsubscribeToLabel}
                               deleteLabel={this.deleteLabel}
                     />
                  )
            }
            </List>
          </Content>
        </Wrapper>
      );
  }
}

function mapStateToProps(state) {
    const { uid} = state.authentication.user;
    return {
        uid
    };
}

const connectedLabels = connect(mapStateToProps)(Labels);
const firebaseLabels = compose(withFirebase)(connectedLabels)
export { firebaseLabels as Labels };