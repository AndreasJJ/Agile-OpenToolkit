import React, {useEffect} from 'react';
import PropTypes from 'prop-types';

import Board from './components/Board'

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`;

const Retrospective = (props) => {
  useEffect(() => {
    props.finishLoading()
  }, [])

  return (
    <Wrapper>
      <Board />
    </Wrapper>
  )
}

Retrospective.proptypes = {
  finishLoading: PropTypes.func.isRequired
}

export default Retrospective