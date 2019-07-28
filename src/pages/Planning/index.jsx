import React, { useState, useCallback } from 'react';

import styled, {keyframes } from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 50px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
`

export default class Planning extends React.PureComponent {

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
          <Content>

          </Content>
        </Wrapper>
      );
  }
}