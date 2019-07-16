import React from 'react';
import { connect } from 'react-redux';

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

const NoSprints = styled.div`
  width: 100%;
  min-height: 90px;
  background-color: #f2f2f2;
  display: flex;
  justify-content: center;
  align-items: center;
`

class Sprints extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      activeTab: 1,
      showModal: false,
      sprints: [{id: 1, title: "Test sprint 1", startDate: "21-06-2019", dueDate: "31-06-2019", totalIssues: 5, finishedIssues: 3}, {id: 2, title: "Test sprint 2", startDate: "19-06-2019", dueDate: "27-06-2019", totalIssues: 8, finishedIssues: 1}]
    };

    this.tabClicked = this.tabClicked.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentDidMount() {
  }

  tabClicked(e) {
    this.setState({activeTab: parseInt(e.target.dataset.index)})
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
            <Modal content={<CreateSprint />} minWidth={"800px"} exitModalCallback={this.closeModal} />
            :
            null
          }
          <Content>
            <Header> 
              <Controls> 
                <StateTabs> 
                  <Tab activeIndex={this.state.activeTab} index={0} data-index={0} onClick={this.tabClicked}>Past</Tab>
                  <Tab activeIndex={this.state.activeTab} index={1} data-index={1} onClick={this.tabClicked}>Current</Tab>
                  <Tab activeIndex={this.state.activeTab} index={2} data-index={2} onClick={this.tabClicked}>Future</Tab>
                </StateTabs>
                <NewSprint onClick={(e) => {this.setState({showModal: true})}}>New Sprint</NewSprint>
              </Controls>
            </Header>
            <Body>
              {
                this.state.sprints && this.state.sprints.length > 0
                ?
                  this.state.sprints.map((sprint, index) =>
                    <SprintCard key={index} sprintId={sprint.id} title={sprint.title} startDate={sprint.startDate} dueDate={sprint.dueDate} totalIssues={sprint.totalIssues} finishedIssues={sprint.finishedIssues} />
                  )
                :
                  <NoSprints>No sprints to show</NoSprints>
              }
            </Body>
          </Content>
        </Wrapper>
    );
  }
}

function mapStateToProps(state) {
    const { user} = state.authentication;
    const { selectedProduct } = state.product
    return {
        user,
        selectedProduct
    };
}

const connectedSprints = connect(mapStateToProps)(Sprints);
export { connectedSprints as Sprints };
