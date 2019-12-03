import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import {Crown} from 'styled-icons/fa-solid/Crown';
import {People} from 'styled-icons/material/People';

const ProductCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  border-bottom: 0.5px solid lightgray;
  padding-bottom: 5px;
`

const Left = styled.div`
  display: flex;
  flex-direction: column;

  & > span {
    margin-bottom: 2px;
    color: ${props => props.skeleton ? "transparent" : null} !important;
    background-color: ${props => props.skeleton ? "lightgray" : null};
  }
`

const Members = styled.button`
  height: 30px;
`

const Product = ({productIndex, skeleton, name, owner, onclick}) => {
  return(
      <ProductCard data-productindex={productIndex}>
        <Left skeleton={skeleton}>
          <span><b>{name}</b></span>
          <span>
            <Crown size="1em" />
            <i>
              {
                owner.firstname 
                ? 
                  (" " + owner.firstname.charAt(0).toUpperCase() + owner.firstname.slice(1)) 
                : 
                  null 
              }
              {
                owner.lastname 
                ? 
                  (" " + owner.lastname) 
                : 
                  null
              }
            </i>
          </span>
        </Left>
        <Members onClick={onclick}> <People size="1em" /></Members>
      </ProductCard>
  )
}

Product.proptypes = {
    productIndex: PropTypes.number.isRequired,
    skeleton: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    owner: PropTypes.object.isRequired,
    onclick: PropTypes.func.isRequired
}

export default Product