import React from 'react';

import styled from 'styled-components';

const StyledSelect = styled.select`
  ${props => props.styling ? props.styling : ""}
`

export default class Select extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {

  }

  render () {
    return (
      <StyledSelect styling={this.props.styling} onChange={(e) => this.props.onChange(e)} value={this.props.value}>
        <option value={0}>{this.props.placeholderText}</option>
        {
          this.props.list && this.props.list.map((item, index) => <option key={item[this.props.keyName]} value={index+1}>{item[this.props.textName]}</option>)
        }
      </StyledSelect>
    )
  }
}