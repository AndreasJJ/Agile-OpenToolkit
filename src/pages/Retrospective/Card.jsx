import React from 'react';

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

export default class Card extends React.PureComponent {

 constructor(props) {
    super(props)

    this.state = {
    };

  }
  componentDidMount() {
    
  }


  render() {
      return (
        <Wrapper color={this.props.color}>
          {this.props.content}
        </Wrapper>
      );
  }
}