import React from 'react';

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  flex-direction: column;
  display: flex;
`

const Content = styled.div`
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  flex: 1;
`

const ResetApp = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const ResetText = styled.span`
  color: #000000;
  opacity: 60%;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Button = styled.button`
  min-width: 88px;
  height: 35px;
  background-color: #ff6961;
  border-color: #bf4f49;
  color: #ffffff;
  border-radius: 3px;
  margin-top: 10px;
`

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };

    this.resetState = this.resetState.bind(this)
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true, error: error, errorInfo: info });
  }

  resetState() {
    // Clear redux state and reload application
    localStorage.clear();
    window.location.href = '/';
  }

  render() {
    return(
      this.state.hasError
      ?
        <Wrapper>
          <Content>
          <Info>
            <h1>Something went wrong.</h1>
            <p>If this is the first time you see this page, please try to reload.</p>
            <div>

            </div>
          </Info>
          <ResetApp>
            <ResetText>If the problem is persistent, click here to restart the application (you might have to log in again).</ResetText>
            <Button onClick={this.resetState}>
              Reset Application
            </Button>
          </ResetApp>
          </Content>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </Wrapper>
      :
        this.props.children
    )
  }
}

export {
  ErrorBoundary
}