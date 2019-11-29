import React, {useEffect} from 'react';
import PropTypes from 'prop-types';

import { ProductWidget } from './components/ProductWidget';
import { DetailsWidget } from './components/DetailsWidget';

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 100%;

  @media only screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 100% 100%;
  }
`;

const Home = (props) => {

  useEffect(() => {
    props.finishLoading()
  }, [])

  return (
    <Wrapper>
      <ProductWidget />
      <DetailsWidget />
    </Wrapper>
  );
}

Home.propTypes = {
  finishLoading: PropTypes.func.isRequired
}

export {
  Home
}