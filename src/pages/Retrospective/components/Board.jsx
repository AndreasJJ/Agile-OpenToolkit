import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Card from './Card';
import AddCard from './AddCard'

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, calc(100%/3)));
  grid-template-rows: 100%;
  grid-column-gap: 15px;
  padding: 20px;
  box-sizing: border-box;

  @media only screen and (max-width: 800px) {
    grid-template-columns: 100%;
    grid-template-rows: 1fr 1fr 1fr;
    grid-row-gap: 15px;
    padding: 10px;
  }
`;

const BoardHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
`

const HeaderTitle = styled.h3`
  width: 100%;
  background-color: ${props => props.color};
  margin: 0;
  padding: 1em;
  box-sizing: border-box;
  text-align: center;
  color: white;
`

const BoardBody = styled.div`
  flex-grow: 1;
  overflow: auto;
  padding: 5px;
`

const BoardList = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  border-radius: 5px;
`

const AddButton = styled.button`
  min-height: 60px;
  width: 100%;
`

const Board = (props) => {
  const [wellCards, setWellCards] = useState([])
  const [improvementCards, setImprovementCards] = useState([])
  const [actionCards, setActionCards] = useState([])

  const clickedAddButton = (e) => {
    switch(e.target.parentNode.parentNode.dataset.name) {
      case "well":
        setWellCards([...wellCards, <Card color={"#77dd77"} content={<AddCard />} />])
        break;
      case "improvements":
        setImprovementCards([...improvementCards, <Card color={"#ff6961"} content={<AddCard />} />])
        break;
      case "actions":
        setActionCards([...actionCards, <Card color={"#aec6cf"} content={<AddCard />} />])
        break;
    }
  }

  return (
    <Wrapper>
      <BoardList data-name={"well"}>
        <BoardHeader> 
          <HeaderTitle color={"#77dd77"}>Went Well</HeaderTitle>
          <AddButton onClick={clickedAddButton}><b>+</b></AddButton>
        </BoardHeader>
        <BoardBody>
          {wellCards.length > 0 && wellCards.map((card, index) => card)}
        </BoardBody>
      </BoardList>
      <BoardList data-name={"improvements"}>
        <BoardHeader>
          <HeaderTitle color={"#ff6961"}>Could've Been Better</HeaderTitle>
          <AddButton onClick={clickedAddButton}><b>+</b></AddButton>
        </BoardHeader>
        <BoardBody>
          {improvementCards.length > 0 && improvementCards.map((card, index) => card)}
        </BoardBody>
      </BoardList>
      <BoardList data-name={"actions"}>
        <BoardHeader>
          <HeaderTitle color={"#aec6cf"}>Actions For Improvements</HeaderTitle>
          <AddButton onClick={clickedAddButton}><b>+</b></AddButton>
        </BoardHeader>
        <BoardBody>
          {actionCards.length > 0 && actionCards.map((card, index) => card)}
        </BoardBody>
      </BoardList>
    </Wrapper>
  );
}

Board.proptypes = {

}

export default Board