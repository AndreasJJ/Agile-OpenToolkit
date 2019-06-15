import React from 'react';

import styled from 'styled-components';
import {AngleDoubleDown} from 'styled-icons/fa-solid/AngleDoubleDown';

const Wrapper = styled.div`
  width: 100%;
  height: 60px;
  background-color: #F4F4F4;
  display: flex;
  padding: 5px;
  box-sizing: border-box;
  border-top: 1px solid #e8e8e8;

`

export default class Task extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    }

  }

  componentDidMount() {

  }

  render () {
    return (
      <Wrapper>
        {this.props.title}
      </Wrapper>
    )
  }
}