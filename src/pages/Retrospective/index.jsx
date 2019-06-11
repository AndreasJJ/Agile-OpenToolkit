import React from 'react';

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 40% 60%;
  grid-template-rows: 50% 50%;
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

        </Wrapper>
      );
  }
}