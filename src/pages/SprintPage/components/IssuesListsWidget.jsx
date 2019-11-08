import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { compose } from 'recompose';
import { withFirebase } from '../../../sharedComponents/Firebase';

import IssueList from './IssueList'

import styled from 'styled-components';

const Wrapper = styled.div`
  display flex;
  box-sizing: border-box;
  margin: 10px 20px 10px 20px;
`

const Content = styled.div`
  
  max-height: 100%;
  width: 100%;
  display: grid;  
  grid-template-columns: Calc(100% / 3) Calc(100% / 3) Calc(100% / 3);
  grid-template-rows: 100%;
`

class IssuesListsWidget extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      unstartedIssues: [],
      ongingIssues: [],
      completedIssues: []
    };

    this.getIssues = this.getIssues.bind(this)
  }

  async componentDidMount() {
    let issues = await this.getIssues()
  }

  async getIssues() {
    let querySnapshot = await this.props.firebase
                                        .db
                                        .collection("products")
                                        .doc(this.props.products[this.props.selectedProduct].id)
                                        .collection("stories")
                                        .where('sprint', '==', this.props.match.params.id)
                                        .get()
    let unstartedIssues = []
    let completedIssues = []
    querySnapshot.docs.forEach(function(doc) {
      let id = doc.id
      doc = doc.data()
      doc.id = id
      if(doc.status == "OPEN") {
        unstartedIssues.push(doc)
      } else if (doc.status == "CLOSED") {
        completedIssues.push(doc)
      }
    }.bind(this));
    this.setState({
      unstartedIssues: unstartedIssues,
      completedIssues: completedIssues
    })
  }

  render () {
    return(
      <Wrapper>
        <Content>
        <IssueList title="Unstarted" issues={this.state.unstartedIssues} margin="0px 10px 0px 0px" />
        <IssueList title="Ongoing" issues={this.state.ongingIssues} margin="0px 10px" />
        <IssueList title="Completed" issues={this.state.completedIssues} margin="0px 0px 0px 10px" />
        </Content>
      </Wrapper>
    )
  }
}

IssuesListsWidget.proptypes = {
  products: PropTypes.array.isRequired,
  selectedProduct: PropTypes.string.isRequired
}

function mapStateToProps(state) {
    const { products, selectedProduct } = state.product;
    return {
      products,
      selectedProduct
    };
}

const connectedIssuesListsWidget = connect(mapStateToProps)(IssuesListsWidget);
const firebaseIssuesListsWidget = withRouter(compose(withFirebase)(connectedIssuesListsWidget))
export { firebaseIssuesListsWidget as IssuesListsWidget };