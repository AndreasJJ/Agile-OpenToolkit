import React from 'react';
import { connect } from 'react-redux';

import { ProductWidget } from './components/ProductWidget';
import { DetailsWidget } from './components/DetailsWidget';

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 100%;
`;

export class Home extends React.PureComponent {

 constructor(props) {
    super(props)
    this.state = {
    };
  }

  componentDidMount() {
    this.props.finishLoading()
  }


  render() {
      return (
        <Wrapper>
          <ProductWidget />
          <DetailsWidget />
        </Wrapper>
      );
  }
}