import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

const Card = styled.div`
  width: 100%;
  height: 60px;
  background-color: #F4F4F4;
  display: flex;
  padding: 5px;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e8e8e8;

  &:last-child {
    border-bottom: 1px solid #e8e8e8;
`

const Name = styled.span`

`

const Estimate = styled.span`

`


const PersonCard = ({name, estimate}) => {
    return(
        <Card>
            <Name>{name}</Name>
            <Estimate>{estimate}</Estimate>
        </Card>
    )
}

PersonCard.proptypes = {
    name: PropTypes.string.isRequired,
    estimate: PropTypes.number.isRequired
}

export default PersonCard
