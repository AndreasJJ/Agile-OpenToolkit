import React from 'react';

import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 20px 0px 20px;
  flex-grow: 1;
`

const Content = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  background-color: #ffffff;
`

export default class InformationWidget extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
    };

  }

  componentDidMount() {

  }

  render () {
    return(
      <Wrapper>
        <Content>
            
        </Content>
      </Wrapper>
    )
  }
}