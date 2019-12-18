import React from 'react';
import PropTypes from 'prop-types';

import {SecretKey} from './SecretKey';
import {InformationBox} from './InformationBox';

import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`

const H2 = styled.h2`
  margin-top: 0px;
`

const GitLab = (props) => {

  return (
    <Wrapper>
        <H2>GitLab</H2>
        <InformationBox 
          title="Limitations"
          info="Because of the differences between GitLab and Agile toolkit we are currently
          only supporting the webhooks 'issues' and 'comment on issue'."
          importance="critical"
        />
        <div>
          <h3>Webook url</h3>
          <a href={"https://agiletoolkit.io/api/endpoint-gitlab?productId=" + props.productId}>https://agiletoolkit.io/api/endpoint-gitlab?productId={props.productId}</a>
        </div>
        <div>
          <h3>Config</h3>
          <SecretKey type="gitlab" />
        </div>
    </Wrapper>
  )
}

GitLab.proptypes = {

}

export {
    GitLab
}