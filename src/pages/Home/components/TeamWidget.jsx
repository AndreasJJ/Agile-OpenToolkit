import React from 'react';

import JoinTeam from './JoinTeam';
import { CreateNewTeam } from './CreateNewTeam';

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
  height: 100%;
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

  static Team = (props) => (
      <TeamCard>
        <Left>
          <b>{props.name}</b>
          <span>
            <Crown size="1em" />
            <i>
              {props.leader.firstname ? (" " + props.leader.firstname.charAt(0).toUpperCase() + props.leader.firstname.slice(1)) : null }{props.leader.lastname ? (" " + props.leader.lastname) : null}
            </i>
          </span>
        </Left>
        <Members> {props.members.length} <People size="1em" /></Members>
      </TeamCard>
  );

  render () {
    return(
    <Widget>
      {
        this.state.showModal
        ?
        <Modal content={<Tabs tabNames={["Create New Team", "Join Team"]} tabComponents={[<CreateNewTeam sendTeam={this.props.sendTeam} onclick={this.closeModal} />, <JoinTeam />]} />} exitModalCallback={this.closeModal} />
        :
        null
      }
      <Content>
        <WidgetHeader>
          Teams
        </WidgetHeader>
        <WidgetBody>
          <TeamList>
            {this.props.teams && this.props.teams.map((team, index) => <TeamWidget.Team key={index} name={team.name} leader={team.leader} members={team.members} />)}
          </TeamList>
          <AddTeamButton onClick={this.addTeamButtonClicked}>Add Team</AddTeamButton>
        </WidgetBody>
      </Content>
    </Widget>
    )
  }
}