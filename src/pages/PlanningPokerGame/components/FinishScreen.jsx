import React, { useState, useCallback } from 'react';

import styled, { keyframes } from 'styled-components';


const keyframe = keyframes`

`

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;


export default class FinishScreen extends React.PureComponent {

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

        </Wrapper>
      );
  }
}