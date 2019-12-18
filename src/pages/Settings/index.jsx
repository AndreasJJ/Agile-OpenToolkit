import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { useHistory } from 'react-router-dom';

import styled from 'styled-components';

import {NavBar} from './components/NavBar';
import {Integration} from './components/Integration';
import {Github} from './components/Github';
import {GitLab} from './components/GitLab';
import {Roles} from './components/Roles';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 50px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: 800px) {
    padding: 0;
  }
`;

const Content = styled.div`
  -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 15px;
  box-sizing: border-box;

  @media only screen and (max-width: 800px) {
    flex-direction: column;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    border-radius: 0px;
    padding: 15px 15px 0px 15px;
  }
`

const SubPageContainer = styled.div`
  margin-left: 10px;
  flex: 1;
  overflow: auto;

  @media only screen and (max-width: 800px) {
    margin-left: 0px;
    margin-top 10px;
  }
`

const Settings = (props) => {
  // History object
  const history = useHistory()

  // Previous location keys
  const prevKey = useRef(history.location.key)

  // Redux state
  const products = useSelector(state => state.product.products)
  const selectedProduct = useSelector(state => state.product.selectedProduct)

  // Constructor
  useEffect(() => {
    props.finishLoading()
  }, [])

  // Stop progressbar if the location key changes
  useEffect(() => {
    if(prevKey.current !== history.location.key) {
      props.finishLoading()
      prevKey.current = history.location.key
    }
  })

  // Set component depending on location hash
  let SubPage = <Integration />
  switch(history.location.hash) {
    case "#Github": {
        SubPage = <Github productId={products[selectedProduct].id} />
        break
    }
    case "#GitLab": {
        SubPage = <GitLab productId={products[selectedProduct].id} />
        break
    }
    case "#Roles": {
        SubPage = <Roles />
        break
    }
}

  return (
    <Wrapper>
        <Content>
          <NavBar />
          <SubPageContainer>
            {SubPage}
          </SubPageContainer>
        </Content>
    </Wrapper>
  )
}

Settings.proptypes = {
  finishLoading: PropTypes.func.isRequired
}

export {
    Settings
}