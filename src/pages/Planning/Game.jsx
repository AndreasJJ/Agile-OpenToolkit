import React, { useState, useCallback } from 'react';

import styled, {keyframes } from 'styled-components';

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

export default class Game extends React.PureComponent {

   constructor(props) {
    super(props)

    this.state = {
      numbers: [0,0.5,1,2,3,5,8,13,20,40,100,'?', "☕"],
      cards: [],
      selectedCardIndex: null,
      currentStory: "This is a test story"
    };
    this.MakeDeck = this.MakeDeck.bind(this)
    this.clickedCard = this.clickedCard.bind(this)
  }

  componentDidMount() {
    this.MakeDeck()
  }

  MakeDeck() {
    let temp = []
    for (var i =  0; i < this.state.numbers.length; i++) {
      temp.push(<Card number={this.state.numbers[i]} index={i+1} key={i} selectedCard={this.state.selectedCardIndex} onclick={this.clickedCard} />)
    }
    this.setState({cards: temp})
  }

  clickedCard(e) {
    let newIndex = parseInt(e.target.dataset.index)
    if(newIndex === this.state.selectedCardIndex) {
      newIndex = null
    }
    this.setState({selectedCardIndex: newIndex}, () => {
      this.MakeDeck()
    })
  }

  render() {
      return (
        <Wrapper>
          <StoryWrapper>
            {[this.state.currentStory].map(story => <Story key={story}>{story}</Story>)}
          </StoryWrapper>
          <Cards>
            {this.state.cards.length>0 && this.state.cards.map((card, index) => card)}
          </Cards>
        </Wrapper>
      );
  }
}