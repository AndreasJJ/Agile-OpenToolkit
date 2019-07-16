import React from 'react';

import styled from 'styled-components';

const Widget = styled.div`
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 3;
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 20px 0px 20px;
  flex-grow: 1;
`

const AAA = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
`

const Content = styled.table`
  height: 100%;
  width: 100%;
  display: table;
  box-sizing: border-box;
  border-spacing: 0px;
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  background-color: #ffffff;
`

const WidgetHeader = styled.thead`
  background-color: #00b8fe;
  color: #ffffff;
  display: flex;
`

const WidgetBody = styled.tbody`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

const Cell = styled.th`
  padding: 10px;
  font-weight: normal;
  text-align: left;
`

const Navigation = styled.div`
  display: flex;
  padding: 5px 0px 5px 0px;
`

const NavElement = styled.div`
  margin-right: 5px;
  
  &:last-child {
    margin-right: 0px;
  }
`

/* eslint-disable react/prefer-stateless-function */
export default class NotificationsWidget extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      pageNumbers: [1,2,3,4,5,6,7]
    };

  }

  componentDidMount() {

  }

  render () {
    return(
      <Widget>
        <Wrapper>
          <AAA>
            <Content>
              <WidgetHeader>
                <tr>
                   <Cell>Type Notification</Cell>
                   <Cell>Time</Cell>
                   <Cell>Status</Cell>
                   <Cell>Descriptions</Cell>
                </tr>
              </WidgetHeader>
              <WidgetBody>

              </WidgetBody>
            </Content>
          </AAA>
          <Navigation>
            <NavElement>First page</NavElement>
            {this.state.pageNumbers && this.state.pageNumbers.map((number) => <NavElement key={number}>{number}</NavElement>)}
            <NavElement>Last page</NavElement>
          </Navigation>
        </Wrapper>
      </Widget>
    )
  }
}