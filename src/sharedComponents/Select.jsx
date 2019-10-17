import React from 'react';

import styled from 'styled-components';

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
      <select onChange={(e) => this.props.onChange(e)} value={this.props.value}>
        <option value={0}></option>
        {
          this.props.list && this.props.list.map((item, index) => <option key={item[this.props.keyName]} value={index+1}>{item[this.props.textName]}</option>)
        }
      </select>
    )
  }
}