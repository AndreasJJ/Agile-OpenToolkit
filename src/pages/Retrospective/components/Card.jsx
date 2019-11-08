import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  min-height: 80px;
  width: 100%;
  background-color: ${props => props.color};
  -webkit-box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.15);
  box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.15);
  margin-top: 5px;
  padding: 5px;
  box-sizing: border-box;
`;

const Card = ({color, content}) => {
  return (
    <Wrapper color={color}>
      {content}
    </Wrapper>
  );
}

Card.proptypes = {
  color: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired
}

export default Card