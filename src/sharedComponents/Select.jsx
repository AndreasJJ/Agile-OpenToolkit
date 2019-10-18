import React from 'react';

import styled from 'styled-components';

const Select = (props) => {
  return (
    <select onChange={(e) => props.onChange(e)} value={props.value}>
      <option value={0}></option>
      {
        props.list && props.list.map((item, index) => <option key={item[props.keyName]} value={index+1}>{item[props.textName]}</option>)
      }
    </select>
  )
}

export default Select