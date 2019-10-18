import React from 'react';

import styled from 'styled-components';

const StyledSelect = styled.select`
  ${props => props.styling ? props.styling : ""}
`

const Select = (props) => {
  return (
    <StyledSelect styling={props.styling} onChange={(e) => props.onChange(e)} value={props.value}>
      <option value={0}>{props.placeholderText}</option>
      {
        props.list && props.list.map((item, index) => <option key={item[props.keyName]} value={index+1}>{item[props.textName]}</option>)
      }
    </StyledSelect>
  )
}

export default Select