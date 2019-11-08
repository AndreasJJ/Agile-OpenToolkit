import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin: ${props => props.margin ? props.margin : "none"}
  box-sizing: border-box;
`

const Content = styled.div`
  max-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
  background-color: #ffffff;
`

const Header = styled.div`
  background-color: #fafafa;
  border-bottom: 1px solid #e5e5e5;
  line-height: 1.5;
  padding: 14px 16px;
  display: flex;
`

const Body = styled.div`
  max-height: 100%;
  overflow: auto;
`

const Issue = styled.div`
  padding: 10px 16px;
  border-bottom: 1px solid #eee;
`

const IssueTitle = styled.div`
  margin-bottom: 7px;
`

const ReactLink = styled(Link)`
  font-weight: bold;
  text-decoration: none;
  color: ${props => props.skeleton ? "transparent" : "#000000"};
  background-color: ${props => props.skeleton ? "lightgray" : null}

  &:hover {
    text-decoration: underline;
  }
`

const IssueNumber = styled.div`

`

const IssueList = ({margin, title, issues}) => {
  return(
    <Wrapper margin={margin}>
    <Content>
      <Header>
        {title}
      </Header>
      <Body>
        {
          issues 
          && issues.map((issue, index) => 
             <Issue key={issue.number}>
               <IssueTitle><ReactLink to={"/backlog/issue/" + issue.id}>{issue.title}</ReactLink></IssueTitle>
               <IssueNumber>#{issue.number}</IssueNumber>
             </Issue>
           )
        }
      </Body>
    </Content>
    </Wrapper>
  )
}

IssueList.proptypes = {
  margin: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  issues: PropTypes.array.isRequired
}

export default IssueList