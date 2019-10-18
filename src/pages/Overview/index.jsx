import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import NotificationsWidget from './components/NotificationsWidget';
import GraphWidget from './components/GraphWidget';

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 60% 40%;
`;

const Overview = (props) => {

  useEffect(() => {
    props.finishLoading()
  })

  return (
    <Wrapper>
      <GraphWidget />
      <NotificationsWidget />
    </Wrapper>
  );
}

export {
  Overview
}