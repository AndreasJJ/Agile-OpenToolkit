import React, {useEffect} from 'react';
import PropTypes from 'prop-types';

import { ProductWidget } from './components/ProductWidget';
import { DetailsWidget } from './components/DetailsWidget';
import { SettingsWidget } from './components/SettingsWidget';
import { NewsWidget } from './components/NewsWidget';

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 50% 50%;

  @media only screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 100% 100% 100% 100%;
  }
`;

const Home = (props) => {

  // Constructor
  useEffect(() => {
    props.finishLoading()
  }, [])

  return (
    <Wrapper>
      <ProductWidget />
      <DetailsWidget />
      <SettingsWidget />
      <NewsWidget />
    </Wrapper>
  );
}

Home.propTypes = {
  finishLoading: PropTypes.func.isRequired
}

export {
  Home
}