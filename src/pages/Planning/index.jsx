import React from 'react';

import styled from 'styled-components';

import Card from './Card';

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

const Story = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default class Planning extends React.PureComponent {

   constructor(props) {
    super(props)

    this.state = {
      numbers: [0,0.5,1,2,3,5,8,13,20,40,100,'?', "☕"],
      cards: [],
      selectedCardIndex: null,
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
          <Story>
            <h2>This is a test story</h2>
          </Story>
          <Cards>
            {this.state.cards.length>0 && this.state.cards.map((card, index) => card)}
          </Cards>
        </Wrapper>
      );
  }
}