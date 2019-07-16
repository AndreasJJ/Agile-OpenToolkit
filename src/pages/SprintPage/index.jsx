import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import styled from 'styled-components';


class SprintPage extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {

    };

  }

  componentDidMount() {
    console.log(this.props.match.params.id)
  }

  render() {
    return (
        <div></div>
    );
  }
}

function mapStateToProps(state) {
    return {
    };
}

const connectedSprintPage = withRouter(connect(mapStateToProps)(SprintPage));
export { connectedSprintPage as SprintPage };
