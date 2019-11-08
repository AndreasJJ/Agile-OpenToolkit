import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import ImageSrc from '../../assets/error/404.svg'

const Image = styled.img`
  width: 100%;
  height: 100%;
`

export default class Error404 extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.finishLoading()
  }

  render() {

    return (
      <div>
        <Image src={ImageSrc} />
      </div>
    );
  }
}

Error404.propTypes = {
  finishLoading: PropTypes.func.isRequired,
}