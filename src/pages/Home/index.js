import React from 'react';

import TeamWidget from './TeamWidget';
import DetailsWidget from './DetailsWidget';
import PlaceholderWidget from './PlaceholderWidget';

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
`;

export default class Home extends React.PureComponent {

 constructor(props) {
    super(props)
  }
  componentDidMount() {
    
  }

  render() {
      return (
        <Wrapper>
          <TeamWidget />
          <DetailsWidget />
          <PlaceholderWidget />
        </Wrapper>
      );
  }
}