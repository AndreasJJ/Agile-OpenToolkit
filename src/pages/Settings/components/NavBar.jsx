import React, {useEffect} from 'react';
import PropTypes from 'prop-types';

import { useHistory } from 'react-router-dom';

import styled from 'styled-components';

const NavBox = styled.nav`
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
    height: min-content;
    min-width 150px;
    max-width: 200px;

    @media only screen and (max-width: 800px) {
        width: 100%;
        max-width: 100%;
    }
`

const InnerNav = styled.div`
    border-bottom: 1px solid #e8e8e8;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`

const InnerBox = styled.div`
    height: min-content;
    min-width 100px;
    max-width: 150px;
    flex: auto;
    display: flex;
    flex-direction: column;
    width: 70%;
    min-width: min-content;

    @media only screen and (max-width: 800px) {
        max-width: none;
    }
`

const Item = styled.div`
    padding: 8px 10px;
    border-bottom: 1px solid #e8e8e8;
    ${props => props.location ? "border-left: 2px solid #00b8fe;" : "border-left: 1px solid #e8e8e8;" }
    width: 100%;
    box-sizing: border-box;

    &:hover {
        background-color: #e8e8e8;
        cursor: pointer
    }

    &:last-child {
        border-bottom: none;
    }

    & > span {
        pointer-events:none
    }
`

const NavBar = (props) => {

    const history = useHistory()

    const onclick = (e) => {
        switch(e.target.dataset.name) {
            case "Integration": {
                history.push({ hash: 'Integration' })
                break
            }
            case "Github": {
                history.push({ hash: 'Github' })
                break
            }
            case "GitLab": {
                history.push({ hash: 'GitLab' })
                break
            }
            case "Roles": {
                history.push({ hash: 'Roles' })
                break
            }
        }
    }

  return (
    <NavBox>
        <InnerNav>
            <Item  data-name="Integration" location={history.location.hash === "#Integration"} onClick={onclick}>
                Third party integration
            </Item>
            <InnerBox>
                <Item data-name="Github" location={history.location.hash === "#Github"} onClick={onclick}>
                    <span>GitHub</span>
                </Item>
                <Item data-name="GitLab" location={history.location.hash === "#GitLab"} onClick={onclick}>
                    <span>GitLab</span>
                </Item>
            </InnerBox>
        </InnerNav>
        <Item data-name="Roles" location={history.location.hash === "#Roles"} onClick={onclick}>
            <span>Roles</span>
        </Item>
    </NavBox>
  )
}

NavBar.proptypes = {
  finishLoading: PropTypes.func.isRequired
}

export {
    NavBar
}