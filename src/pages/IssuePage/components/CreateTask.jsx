import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from './../../../sharedComponents/Firebase';

import styled from 'styled-components';

class Task extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {

    }

  }

  componentDidMount() {

  }

  render () {
    return(
      "hi"
    )
  }
}

function mapStateToProps(state) {
    const { user } = state.authentication;
    const { products, selectedProduct } = state.product
    return {
        user,
        products,
        selectedProduct
    };
}

const connectedTask = connect(mapStateToProps)(Task);
const firebaseTask = compose(withFirebase)(connectedTask)
export { firebaseTask as Task }; 