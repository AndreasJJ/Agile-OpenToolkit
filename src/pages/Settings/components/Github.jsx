import React from 'react';
import PropTypes from 'prop-types';

import {SecretKey} from './SecretKey';
import {InformationBox} from './InformationBox';

import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`

const H2 = styled.h2`
  margin-top: 0px;
`

const Github = (props) => {

  return (
    <Wrapper>
        <H2>Github</H2>
        <InformationBox 
          title="Limitations"
          info="Because of the differences between Github and Agile toolkit we are currently
          only supporting the webhooks 'issues', 'labels' (no description), and 'milestones'."
          importance="critical"
        />
        <div>
          <h3>Config</h3>
          <SecretKey type="github" />
        </div>
    </Wrapper>
  )
}

Github.proptypes = {

}

export {
    Github
}