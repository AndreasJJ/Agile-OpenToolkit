/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';

/* eslint-disable react/prefer-stateless-function */
export default class Error404 extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  render() {

    return (
      <div>
        404
      </div>
    );
  }
}