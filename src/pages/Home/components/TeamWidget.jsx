import React from 'react';

import JoinTeam from './JoinTeam';
import { CreateNewTeam } from './CreateNewTeam';
import TeamMembers from './TeamMembers';

import Modal from '../../../sharedComponents/Modal';
import Tabs from '../../../sharedComponents/Tabs';

import styled from 'styled-components';
import {People} from 'styled-icons/material/People';
import {Crown} from 'styled-icons/fa-solid/Crown';

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
  box-sizing: border-box;
`

const WidgetHeader = styled.div`
  padding: 10px
  background-color: #00b8fe;
  color: #ffffff;
`

const WidgetBody = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px
`

const TeamList = styled.div`
  flex-grow: 1;
  height: 100%;
  overflow: auto;
`

const TeamCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  border-bottom: 0.5px solid lightgray;
  padding-bottom: 5px;
`

const Left = styled.div`
  display: flex;
  flex-direction: column;
`

const Members = styled.button`
  height: 30px;
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
      showModal: false,
      modalContent: "",
      selectedTeam: 0
    };

    this.addTeamButtonClicked = this.addTeamButtonClicked.bind(this)
    this.showMembersButtonClicked = this.showMembersButtonClicked.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentDidMount() {

  }

  addTeamButtonClicked() {
    this.setState({showModal: true, modalContent: "teamCreation"})
  }

  showMembersButtonClicked(e) {
    if(e.target.tagName == "path") {
      this.setState({selectedTeam: e.target.parentNode.parentNode.parentNode.dataset.teamindex})
    } else if(e.target.tagName == "svg") {
      this.setState({selectedTeam: e.target.parentNode.parentNode.dataset.teamindex})
    } else if(e.target.tagName == "BUTTON") {
     this.setState({selectedTeam: e.target.parentNode.dataset.teamindex})
    }
    this.setState({showModal: true, modalContent: "showMembers"})
  }

  closeModal() {
    this.setState({showModal: false, modalContent: ""})
  }

  static Team = (props) => (
      <TeamCard data-teamindex={props.teamIndex}>
        <Left>
          <b>{props.name}</b>
          <span>
            <Crown size="1em" />
            <i>
              {props.leader.firstname ? (" " + props.leader.firstname.charAt(0).toUpperCase() + props.leader.firstname.slice(1)) : null }{props.leader.lastname ? (" " + props.leader.lastname) : null}
            </i>
          </span>
        </Left>
        <Members onClick={props.onclick}> {props.members.length} <People size="1em" /></Members>
      </TeamCard>
  );

  render () {
    let modal = <Modal />

    if(this.state.modalContent == "teamCreation") {
      modal = <Modal content={<Tabs tabNames={["Create New Team", "Join Team"]} tabComponents={[<CreateNewTeam sendTeam={this.props.sendTeam} onclick={this.closeModal} />, <JoinTeam />]} />} exitModalCallback={this.closeModal} />
    } else if (this.state.modalContent == "showMembers") {
      modal = <Modal content={<TeamMembers teams={this.props.teams} teamIndex={this.state.selectedTeam} /> } minWidth={"400px"} maxWidth={"400px"} exitModalCallback={this.closeModal} />
    }

    return(
    <Widget>
      {
        this.state.showModal
        ?
        modal
        :
        null
      }
      <Content>
        <WidgetHeader>
          Teams
        </WidgetHeader>
        <WidgetBody>
          <TeamList>
            {this.props.teams && this.props.teams.map((team, index) => <TeamWidget.Team key={index} onclick={this.showMembersButtonClicked} teamIndex={index} name={team.name} leader={team.leader} members={team.members} />)}
          </TeamList>
          <AddTeamButton onClick={this.addTeamButtonClicked}>Add Team</AddTeamButton>
        </WidgetBody>
      </Content>
    </Widget>
    )
  }
}