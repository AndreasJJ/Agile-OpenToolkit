import React, { useEffect } from 'react';

import { InformationWidget } from './components/InformationWidget';
import { IssuesListsWidget } from './components/IssuesListsWidget';

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 30% 70%;
`;

const SprintPage = (props) => {

  useEffect(() => {
    props.finishLoading()
  })

  return (
      <Wrapper>
        <InformationWidget />
        <IssuesListsWidget />
      </Wrapper>
  );
}

export {
  SprintPage
}