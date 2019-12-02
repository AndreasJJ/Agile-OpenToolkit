import React from 'react';
import PropTypes from 'prop-types';

import Burndown from './charts/Burndown'

import styled from 'styled-components';

const Widget = styled.div`
  grid-column-start: 1;
  grid-column-end: 1;
  grid-row-start: 1;
  grid-row-end: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 20px 0px 20px;
  flex-grow: 1;
`

const Content = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  border-radius: 5px;
  background-color: #ffffff;
`

const Header = styled.div`
  background-color: #00b8fe;
  color: #ffffff;
  display: flex;
  padding: 10px;
`

const Body = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`

const GraphWidget = (props) => {
  return(
    <Widget>
      <Wrapper>
          <Content>
              <Header>
                Graph
              </Header>
              <Body>
                <Burndown />
              </Body>
          </Content>
      </Wrapper>
    </Widget>
  )
}

GraphWidget.proptypes = {
  
}

export default GraphWidget