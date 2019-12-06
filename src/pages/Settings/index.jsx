import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

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
`

const SubPageContainer = styled.div`
  margin-left: 10px;
  flex: 1;
`

const Settings = (props) => {

  const history = useHistory()

  const prevKey = useRef(history.location.key)

  useEffect(() => {
    props.finishLoading()
  }, [])

  useEffect(() => {
    if(prevKey.current !== history.location.key) {
      props.finishLoading()
      prevKey.current = history.location.key
    }
  })

  let SubPage = <Integration />
  switch(history.location.hash) {
    case "#Github": {
        SubPage = <Github />
        break
    }
    case "#GitLab": {
        SubPage = <GitLab />
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