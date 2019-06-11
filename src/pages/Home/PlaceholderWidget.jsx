import React from 'react';

import styled from 'styled-components';

const Widget = styled.div`
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 3;
  display: flex;
  margin: 20px;
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  background-color: #ffffff;
`

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
`

const WidgetHeader = styled.div`
  border-bottom: 1px black solid
`

const WidgetBody = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

/* eslint-disable react/prefer-stateless-function */
export default class DetailsWidget extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
    };

  }

  componentDidMount() {

  }

  render () {
    return(
      <Widget>
        <Content>
          <WidgetHeader>
             Placeholder
          </WidgetHeader>
          <WidgetBody>

          </WidgetBody>
        </Content>
      </Widget>
    )
  }
}