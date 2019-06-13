import React from 'react';

import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Header = styled.h2`
  text-align: center;
`

const Body = styled.form`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 0px;
  overflow: auto;
`

export default class JoinTeam extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {

  }

  render () {
    return(
      <Wrapper>
         <Header>
           Join Team
         </Header>
         <Body>

         </Body>
      </Wrapper>
    )
  }
}