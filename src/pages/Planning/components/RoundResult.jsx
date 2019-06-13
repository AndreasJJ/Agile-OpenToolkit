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

const AverageEstimate = styled.div`

`

const PeopleList = styled.div`

`


export default class RoundResult extends React.PureComponent {

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
          <AverageEstimate> 

          </AverageEstimate>
          <PeopleList>

          </PeopleList>
        </Wrapper>
      );
  }
}