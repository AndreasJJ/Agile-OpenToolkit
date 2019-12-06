import React from 'react';
import PropTypes from 'prop-types';

import {InformationBox} from './InformationBox'

import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`

const Integration = (props) => {

  return (
    <Wrapper>
      <InformationBox 
        title="Currently supported 3rd party applications"
        info="Github and Gitlab"
        importance="important"
        />
    </Wrapper>
  )
}

Integration.proptypes = {

}

export {
    Integration
}