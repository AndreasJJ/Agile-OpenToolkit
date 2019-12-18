import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import styled, { keyframes } from 'styled-components';

import Card from './Card';

const keyframe = keyframes`
  0% {
    letter-spacing: 1em;
    -webkit-filter: blur(12px);
            filter: blur(12px);
    opacity: 0;
  }
  100% {
    -webkit-filter: blur(0px);
            filter: blur(0px);
    opacity: 1;
  }
`

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Cards = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-wrap: wrap;
`

const StoryWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Story = styled.h2`
  -webkit-animation: ${keyframe} 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  animation: ${keyframe} 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
`

const Game = (props) => {
  // State
  const [numbers, setNumbers] = useState([0,0.5,1,2,3,5,8,13,20,40,100,'?', "☕"])
  const [cards, setCards] = useState([])
  const [selectedCardIndex, setSelectedCardIndex] = useState(null)
  const [currentStory, setCurrentStory] = useState("This is a test story")

  // Constructor
  useEffect(() => {
    // Create the deck
    MakeDeck()
  }, [])

  // Create the deck when selected card is changed
  useEffect(() => {
    MakeDeck()
  }, [selectedCardIndex])

  // Creates dec by making an array of cards with the given numbers
  const MakeDeck = () => {
    let temp = []
    for (let i =  0; i < numbers.length; i++) {
      temp.push(<Card number={numbers[i]} index={i+1} key={i} selectedCard={selectedCardIndex} onclick={clickedCard} />)
    }
    setCards(temp)
  }

  // User select card
  const clickedCard = (e) => {
    let newIndex = parseInt(e.target.dataset.index)
    if(newIndex === selectedCardIndex) {
      newIndex = null
    }

    setSelectedCardIndex(newIndex)
  }

  return (
    <Wrapper>
      <StoryWrapper>
        {[currentStory].map(story => <Story key={story}>{story}</Story>)}
      </StoryWrapper>
      <Cards>
        {cards.length>0 && cards.map((card, index) => card)}
      </Cards>
    </Wrapper>
  )
}

Game.proptypes = {
  
}

export default Game