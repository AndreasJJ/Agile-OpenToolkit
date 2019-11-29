import React, {useState, useEffect, useContext} from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { FirebaseContext, GetDocuments } from '../../../sharedComponents/Firebase';

import IssueList from './IssueList'

import styled from 'styled-components';

const Wrapper = styled.div`
  display flex;
  box-sizing: border-box;
  margin: 10px 20px 10px 20px;

  @media only screen and (max-width: 800px) {
    margin: 0;
  }
`

const Content = styled.div`
  max-height: 100%;
  width: 100%;
  display: grid;  
  grid-template-columns: Calc(100% / 3) Calc(100% / 3) Calc(100% / 3);
  grid-template-rows: 100%;

  @media only screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }  
`

const IssuesListsWidget = (props) => {
  const firebase = useContext(FirebaseContext)

  const {id} = useParams()

  const products = useSelector(state => state.product.products)
  const selectedProduct = useSelector(state => state.product.selectedProduct)      

  const [unstartedIssues, setUnstartedIssues] = useState([])
  const [ongingIssues, setOngingIssues] = useState([])
  const [completedIssues, setCompletedIssues] = useState([])

  useEffect(() => {
    getIssues()
  }, [])

  const getIssues = async () => {
    let documents = await GetDocuments(firebase, "products/" + products[selectedProduct].id + "/stories", [['sprint', '==', id]])

    let _unstartedIssues = []
    let _completedIssues = []

    documents.forEach((doc) => {
      if(doc.status == "OPEN") {
        _unstartedIssues.push(doc)
      } else if (doc.status == "CLOSED") {
        _completedIssues.push(doc)
      }
    })

    setUnstartedIssues(_unstartedIssues)
    setCompletedIssues(_completedIssues)
  }

  return(
    <Wrapper>
      <Content>
      <IssueList title="Unstarted" issues={unstartedIssues} margin="0px 10px 0px 0px" />
      <IssueList title="Ongoing" issues={ongingIssues} margin="0px 10px" />
      <IssueList title="Completed" issues={completedIssues} margin="0px 0px 0px 10px" />
      </Content>
    </Wrapper>
  )
}

IssuesListsWidget.proptypes = {

}

export { IssuesListsWidget };