import React from 'react';

import AddTeam from './AddTeam';
import CreateNewTeam from './CreateNewTeam';

import Modal from '../../components/Modal';
import Tabs from '../../components/Tabs';

import styled from 'styled-components';

const Widget = styled.div`
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 2;
  display: flex;
  margin: 20px;
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  background-color: #ffffff;
`

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
`

const WidgetHeader = styled.div`
  border-bottom: 1px black solid
`

const WidgetBody = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

const TeamList = styled.div`
  flex-grow: 1;
`

const AddTeamButton = styled.button`
  min-width: 200px;
  min-height: 60px;
  background-color: #3272bc;
  color: #ffffff;
  border: none;
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
`

/* eslint-disable react/prefer-stateless-function */
export default class TeamWidget extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      showModal: false
    };

    this.addTeamButtonClicked = this.addTeamButtonClicked.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentDidMount() {

  }

  addTeamButtonClicked() {
    this.setState({showModal: true})
  }

  closeModal() {
    this.setState({showModal: false})
  }

  render () {
    return(
    <Widget>
      {
        this.state.showModal
        ?
        <Modal content={<Tabs tabNames={["Join Team", "Create New Team"]} tabComponents={[<AddTeam />, <CreateNewTeam />]} />} exitModalCallback={this.closeModal} />
        :
        null
      }
      <Content>
        <WidgetHeader>
          Teams
        </WidgetHeader>
        <WidgetBody>
          <TeamList>
          </TeamList>
          <AddTeamButton onClick={this.addTeamButtonClicked}>Add Team</AddTeamButton>
        </WidgetBody>
      </Content>
    </Widget>
    )
  }
}