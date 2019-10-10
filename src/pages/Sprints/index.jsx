import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from '../../sharedComponents/Firebase';

import Modal from '../../sharedComponents/Modal';
import CreateSprint from './components/CreateSprint';
import SprintCard from './components/SprintCard';

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
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  border-bottom: 1px solid #e8e8e8;
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

const NewSprint = styled.button`
  width: 88px;
  height: 35px;
  background-color: #1aaa55;
  border-color: #168f48;
  color: #ffffff;
  border-radius: 3px;
`

const Body = styled.div`
  width: 100%;
  flex-grow: 1;
  background-color: #ffffff;
  overflow: scroll;
  padding: 5px;
  box-sizing: border-box;
`

class Sprints extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      activeTab: 1,
      showModal: false,
      sprints: []
    };

    this.getSprints = this.getSprints.bind(this)
    this.tabClicked = this.tabClicked.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.createSprint = this.createSprint.bind(this)
  }

  async componentDidMount() {
    await this.getSprints()
    await this.props.finishLoading()
    this.setState({loading: false})
  }

  async getSprints() {
    let ref;
    if(this.state.activeTab === 0) {
      ref = this.props.firebase
                      .db
                      .collection("products")
                      .doc(this.props.products[this.props.selectedProduct].id)
                      .collection("sprints")
                      .where("dueDate", "<", new Date())
                      .orderBy("dueDate", 'desc')
    }else if(this.state.activeTab === 1) {
      ref = this.props.firebase
                      .db
                      .collection("products")
                      .doc(this.props.products[this.props.selectedProduct].id)
                      .collection("sprints")
                      .where("dueDate", ">=", new Date())
                      .orderBy("dueDate", 'asc')
    } else {
      ref = this.props.firebase
                      .db
                      .collection("products")
                      .doc(this.props.products[this.props.selectedProduct].id)
                      .collection("sprints")
                      .where("startDate", ">", new Date())
                      .orderBy("startDate", 'asc')
    }
    let querySnapshot = await ref.get()
    let sprints = querySnapshot.docs.map((doc) => {
      let obj = doc.data()
      obj.id = doc.id
      return obj
    })

    if(this.state.activeTab === 1) {
      sprints = sprints.filter((obj) => new Date(obj.startDate.nanoseconds/1000000 + obj.startDate.seconds*1000) <= new Date())
    } 

    this.setState({sprints: sprints})
  }

  async tabClicked(e) {
    await this.setState({activeTab: parseInt(e.target.dataset.index)})
    this.getSprints()
  }

  closeModal() {
    this.setState({showModal: false})
  }

  async createSprint(sprint) {
    await this.props.firebase
                     .db
                     .collection("products")
                     .doc(this.props.products[this.props.selectedProduct].id)
                     .collection("sprints")
                     .add(sprint)
    await this.getSprints()
  }

  render() {
    return (
        <Wrapper>
          {
            this.state.showModal
            ?
              <Modal content={<CreateSprint exit={this.closeModal} 
                                            createSprint={this.createSprint} />
                              } 
                      minWidth={"800px"} 
                      exitModalCallback={this.closeModal} />
            :
              null
          }
          <Content>
            <Header> 
              <Controls> 
                <StateTabs> 
                  <Tab activeIndex={this.state.activeTab} index={0} data-index={0} onClick={this.tabClicked}>
                    Past
                  </Tab>
                  <Tab activeIndex={this.state.activeTab} index={1} data-index={1} onClick={this.tabClicked}>
                    Current
                  </Tab>
                  <Tab activeIndex={this.state.activeTab} index={2} data-index={2} onClick={this.tabClicked}>
                    Future
                  </Tab>
                </StateTabs>
                <NewSprint onClick={(e) => {this.setState({showModal: true})}}>
                  New Sprint
                </NewSprint>
              </Controls>
            </Header>
            <Body>
              {
                this.state.loading
                ?
                  <SprintCard skeleton={true} 
                              key={"skeletonSprintCard"} 
                              sprintId={""} 
                              title={"This is a skeleton sprint title"} 
                              startDate={new Date().toLocaleString("en-GB", {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, year: "numeric", month: "2-digit", day: "2-digit"}).split("/").reverse().join("-")} 
                              dueDate={new Date().toLocaleString("en-GB", {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, year: "numeric", month: "2-digit", day: "2-digit"}).split("/").reverse().join("-")} 
                              totalIssues={1} 
                              finishedIssues={0} />
                :
                  this.state.sprints && this.state.sprints.map((sprint, index) =>
                    <SprintCard key={index} 
                                sprintId={sprint.id} 
                                title={sprint.title} 
                                startDate={new Date(sprint.startDate.nanoseconds/1000000 + sprint.startDate.seconds*1000).toLocaleString("en-GB", {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, year: "numeric", month: "2-digit", day: "2-digit"}).split("/").reverse().join("-")} 
                                dueDate={new Date(sprint.dueDate.nanoseconds/1000000 + sprint.dueDate.seconds*1000).toLocaleString("en-GB", {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, year: "numeric", month: "2-digit", day: "2-digit"}).split("/").reverse().join("-")} 
                                totalIssues={sprint.totalIssues} 
                                finishedIssues={sprint.finishedIssues} />
                  )
              }
            </Body>
          </Content>
        </Wrapper>
    );
  }
}

function mapStateToProps(state) {
    const { user} = state.authentication;
    const { products, selectedProduct } = state.product
    return {
        user,
        products,
        selectedProduct
    };
}

const connectedSprints = connect(mapStateToProps)(Sprints);
const firebaseSprints = compose(withFirebase)(connectedSprints)
export { firebaseSprints as Sprints };
