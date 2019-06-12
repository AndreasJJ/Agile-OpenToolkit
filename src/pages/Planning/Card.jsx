import React from 'react';

import styled from 'styled-components';

const PlayingCard = styled.div`
  width: 5em;
  height: 7em;
  background-color: #ffffff;
  box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.15);
  border-radius: 0.25em;
  position: relative;
  transition: transform .2s;
  top: -3.5em

  &:hover {
    transform: ${props => props.selectedIndex ? null : "scale(1.5)"};
    z-index: ${props => props.selectedIndex ? null : 100};
  }
  

  &:nth-child(${props => props.selectedIndex}) {
    transform: scale(1.5);
    background-color: gray;
    z-index: 200;
  }

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
     -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
`

const TopLeft = styled.div`
  position: absolute;
  top: 0.5em;
  left: 0.75em;
`

const TopRight = styled.div`
  position: absolute;
  top: 0.5em;
  right: 0.75em;
`

const Middle = styled.div`
  position: absolute;
  Top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  & > span {
    font-size: 2em;
  }
`

const BottomLeft = styled.div`
  position: absolute;
  bottom: 0.5em;
  left: 0.75em;
  transform: rotate(180deg);
`

const BottomRight = styled.div`
  position: absolute;
  bottom: 0.5em;
  right: 0.75em;
  transform: rotate(180deg);
`



export default class Card extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    }
  }

  render () {
    return (
      <PlayingCard selectedIndex={this.props.selectedCard} data-index={this.props.index} onClick={this.props.onclick}>
        <TopLeft data-index={this.props.index} onClick={this.props.onclick}>{this.props.number}</TopLeft>
        <TopRight data-index={this.props.index} onClick={this.props.onclick}>{this.props.number}</TopRight>
        <Middle><span data-index={this.props.index} onClick={this.props.onclick}>{this.props.number}</span></Middle>
        <BottomLeft data-index={this.props.index} onClick={this.props.onclick}>{this.props.number}</BottomLeft>
        <BottomRight data-index={this.props.index} onClick={this.props.onclick}>{this.props.number}</BottomRight>
      </PlayingCard>
    )
  }
}