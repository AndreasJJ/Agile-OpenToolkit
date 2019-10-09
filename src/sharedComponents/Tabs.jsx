import React from 'react'

import styled from 'styled-components'

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const TabMenu = styled.ul`
  list-style: none;
  margin-block-start: 0px;
  margin-block-end: 0px;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 0px;
  display: flex;
  flex-direction:row
  background-color: #e2e5e9;
  padding 5px 5px 0px 5px;
`

const Tab = styled.li`
  &:after {
    content: '';
    border: 0.5px solid #818285;
    margin: 10px;
  }

  padding: 10px 0px 10px 10px;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
     -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */

  &:nth-child(${props => props.indexNumber}) {
      border: none;
      border-top-left-radius: 5px;
      background-color: white;
      border-right: none;
      border-top-right-radius: 5px;
      padding: 10px;

      &:after {
        content: '';
        border: none;
        margin: 0px;
      }
  }

  &:nth-child(${props => props.indexNumber - 1}) {
      border: none;
      padding: 10px;

      &:after {
        content: '';
        border: none;
        margin: 0px;
      }
  }
`

const ActiveTab = styled.li`
  border-top-left-radius: 5px;
  background-color: white;
  border-right: none;
  border-top-right-radius: 5px;
  padding: 10px;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
     -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently
                                supported by Chrome and Opera */
`

const ActiveTabComponent = styled.div`
  display: flex;
  flex-grow: 1;
`

/* eslint-disable react/prefer-stateless-function */
export default class Tabs extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      activeTabIndex: 0
    }

    this.tabClicked = this.tabClicked.bind(this)
  }

  componentDidMount () {

  }

  tabClicked (e) {
    this.setState({ activeTabIndex: parseInt(e.target.dataset.index) })
  }

  render () {
    return (
      <Wrapper>
        <TabMenu>
          {
            this.props.tabNames.map((item, index) => {
              if (index === this.state.activeTabIndex) {
                return (<Tab indexNumber={this.state.activeTabIndex + 1} key={index}>{item}</Tab>)
              } else {
                return (<Tab onClick={this.tabClicked} 
                             indexNumber={this.state.activeTabIndex + 1} 
                             key={index} data-index={index}
                        >
                          {item}
                        </Tab>
                        )
              }
            })
          }
        </TabMenu>
        <ActiveTabComponent>
          {
            this.props.tabComponents[this.state.activeTabIndex]
          }
        </ActiveTabComponent>
      </Wrapper>
    )
  }
}
