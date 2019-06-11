/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';

import styled from 'styled-components';

const Container = styled.div`
  
`

/* eslint-disable react/prefer-stateless-function */
export class Content extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
    };
  }

  componentDidMount() {

  }

  render() {

    return (
      <Container>

      </Container>
    );
  }
}