import React, { useState, useCallback } from 'react';

import styled, {keyframes } from 'styled-components';

import Game from './Game';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`;

export default class Planning extends React.PureComponent {

   constructor(props) {
    super(props)

    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
      return (
        <Wrapper>
          <Game />
        </Wrapper>
      );
  }
}