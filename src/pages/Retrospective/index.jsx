import React from 'react';

import Board from './components/Board'

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`;

export default class Retrospective extends React.PureComponent {

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
          <Board />
        </Wrapper>
      );
  }
}