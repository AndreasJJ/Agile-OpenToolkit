import React from 'react';
import PropTypes from 'prop-types';

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

const Card =({selectedCard, index, onClick, number}) => {
  return (
    <PlayingCard selectedIndex={selectedCard} data-index={onclick} onClick={onclick}>
      <TopLeft data-index={index} onClick={onclick}>{number}</TopLeft>
      <TopRight data-index={index} onClick={onclick}>{number}</TopRight>
      <Middle><span data-index={index} onClick={onclick}>{number}</span></Middle>
      <BottomLeft data-index={index} onClick={onclick}>{number}</BottomLeft>
      <BottomRight data-index={index} onClick={onclick}>{number}</BottomRight>
    </PlayingCard>
  )
}

Card.proptypes = {
  selectedCard: PropTypes.string.isRequired,
  index: PropTypes.string.isRequired,
  onclick: PropTypes.func.isRequired,
  number: PropTypes.string.isRequired
}

export default Card