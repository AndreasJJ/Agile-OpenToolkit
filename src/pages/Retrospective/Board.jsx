import React from 'react';

import Card from './Card';
import AddCard from './AddCard'

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, calc(100%/3)));
  grid-template-rows: 100%
  grid-column-gap: 10px;
  padding: 5px;
  box-sizing: border-box;
`;

const BoardHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
`

const BoardBody = styled.div`
  flex-grow: 1;
  overflow: auto;
  padding: 5px;
`

const WellBoard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
`

const ImprovementsBoard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
`

const ActionsBoard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
`

const AddButton = styled.button`
  min-height: 60px;
  width: 100%;
`

export default class Board extends React.PureComponent {

 constructor(props) {
    super(props)

    this.state = {
      wellCards: [],
      improvementCards: [],
      actionCards: []
    };

    this.clickedAddButton = this.clickedAddButton.bind(this)
  }
  componentDidMount() {
    
  }

  clickedAddButton(e) {
    switch(e.target.parentNode.parentNode.dataset.name) {
      case "well":
        this.setState({wellCards: [...this.state.wellCards, <Card color={"#77dd77"} content={<AddCard />} />]})
        break;
      case "improvements":
        this.setState({improvementCards: [...this.state.improvementCards, <Card color={"#ff6961"} content={<AddCard />} />]})
        break;
      case "actions":
        this.setState({actionCards: [...this.state.actionCards, <Card color={"#aec6cf"} content={<AddCard />} />]})
        break;
    }
  }

  render() {
      const {wellCards, improvementCards, actionCards} = this.state;
      return (
        <Wrapper>
          <WellBoard data-name={"well"}>
            <BoardHeader> 
              <h3>Went Well</h3>
              <AddButton onClick={this.clickedAddButton}><b>+</b></AddButton>
            </BoardHeader>
            <BoardBody>
              {wellCards.length > 0 && wellCards.map((card, index) => card)}
            </BoardBody>
          </WellBoard>
          <ImprovementsBoard data-name={"improvements"}>
            <BoardHeader>
              <h3>Could've Been Better</h3>
              <AddButton onClick={this.clickedAddButton}><b>+</b></AddButton>
            </BoardHeader>
            <BoardBody>
              {improvementCards.length > 0 && improvementCards.map((card, index) => card)}
            </BoardBody>
          </ImprovementsBoard>
          <ActionsBoard data-name={"actions"}>
            <BoardHeader>
              <h3>Actions For Improvements</h3>
              <AddButton onClick={this.clickedAddButton}><b>+</b></AddButton>
            </BoardHeader>
            <BoardBody>
              {actionCards.length > 0 && actionCards.map((card, index) => card)}
            </BoardBody>
          </ActionsBoard>
        </Wrapper>
      );
  }
}