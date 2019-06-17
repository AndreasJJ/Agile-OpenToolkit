import React from 'react';

import Issue from './components/Issue'

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 50px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const Header = styled.div`
  background-color: white;
  width: 100%;
  height: 90px;
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`

const StateTabs = styled.div`
  display: flex;
  flex-direction: row;
`

const Tab = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;

  ${props => props.activeIndex == props.index ? "border-bottom: 1px solid #000000;" : null}
  ${props => props.activeIndex == props.index ? "font-weight: bold;" : null}

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
     -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
`

const NewIssue = styled.button`
  width: 88px;
  height: 35px;
  background-color: #1aaa55;
  border-color: #168f48;
  color: #ffffff;
  border-radius: 3px;
`

const Search = styled.div`
  flex-grow: 1;
  display: flex;
`

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  flex-grow: 1;
`

const Body = styled.div`
  width: 100%;
  flex-grow: 1;
  background-color: #ffffff;
  overflow: scroll;
  padding: 5px;
  box-sizing: border-box;
`

export default class Backlog extends React.PureComponent {

 constructor(props) {
    super(props)

    this.state = {
      activeTab: 0
    };

    this.tabClicked = this.tabClicked.bind(this)
  }
  componentDidMount() {
    
  }

  tabClicked(e) {
    this.setState({activeTab: parseInt(e.target.dataset.index)})
  }


  render() {
      return (
        <Wrapper>
          <Content>
            <Header> 
              <Controls> 
                <StateTabs> 
                  <Tab activeIndex={this.state.activeTab} index={0} data-index={0} onClick={this.tabClicked}>Open</Tab>
                  <Tab activeIndex={this.state.activeTab} index={1} data-index={1} onClick={this.tabClicked}>Closed</Tab>
                  <Tab activeIndex={this.state.activeTab} index={2} data-index={2} onClick={this.tabClicked}>All</Tab>
                </StateTabs>
                <NewIssue>New Issue</NewIssue>
              </Controls>
              <Search> 
                <SearchInput placeholder="Search..." />
              </Search>
            </Header>
            <Body>
              <Issue title={"A test issue created to show the issue card"} id={1} creationDate={"2 months ago"} creator={"Andreas"} updated={"1 day ago"} status={"CLOSED"} tasks={[{'title': "Test 1", 'assigne': {'firstname': 'Andreas', 'lastname': 'Jonassen', 'profilePicture': null}}, {'title': "Test 2", 'assigne': {'firstname': 'Andreas', 'lastname': 'Jonassen', 'profilePicture': null}}, {'title': "Test 3", 'assigne': {'firstname': 'Andreas', 'lastname': 'Jonassen', 'profilePicture': null}}, {'title': "Test 4"}, {'title': "Test 5"}]} />
              <Issue title={"Another test issue created to show the issue card"} id={2} creationDate={"2 months ago"} creator={"Andreas"} updated={"1 day ago"} status={"OPEN"} />
            </Body>
          </Content>
        </Wrapper>
      );
  }
}