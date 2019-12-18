import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { InformationWidget } from './components/InformationWidget';
import { IssuesListsWidget } from './components/IssuesListsWidget';

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 30% 70%;

  @media only screen and (max-width: 800px) {
    grid-template-columns: 100%;
    grid-template-rows: 0.4fr 0.6fr;
  }
`;

const SprintPage = ({finishLoading}) => {
  // Constructor
  useEffect(() => {
    finishLoading()
  }, [])

  return (
      <Wrapper>
        <InformationWidget />
        <IssuesListsWidget />
      </Wrapper>
  );
}

SprintPage.propTypes = {
  finishLoading: PropTypes.func.isRequired
}

export {
  SprintPage
}