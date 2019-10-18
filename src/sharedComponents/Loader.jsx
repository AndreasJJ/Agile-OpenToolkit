import { NProgress } from '@tanem/react-nprogress'
import React from 'react'

import styled from 'styled-components';

const Bar = styled.div`
  background: #29d;
  height: 2;
  left: 0;
  margin-left: ${ props => (-1 + props.progress) * 100 }%;
  position: fixed;
  top: 0;
  transition: margin-left ${props => props.animationDuration}ms linear;
  width: 100%;
  z-index: 1031;
`

const InnerBar = styled.div`
	box-shadow: 0 0 10px #29d, 0 0 5px #29d;
	display: block;
	height: 100%;
	opacity: 1;
	position: absolute;
	right: 0;
	transform: rotate(3deg) translate(0px, -4px);
	width: 100;
`

const Container = styled.div`
	opacity: ${props => props.isFinished ? 0 : 1};
	pointerEvents: none;
	transition: opacity ${props => props.animationDuration}ms linear;
`

const Loader = (props) => {
    return (
		<NProgress isAnimating={props.isLoading} key={props.location.key}>
		{({ isFinished, progress, animationDuration }) => (
		  <Container isFinished={isFinished} animationDuration={animationDuration}>
		    <Bar progress={progress} animationDuration={animationDuration}>
			    <InnerBar />
			</Bar>
		  </Container>
		)}
		</NProgress>
    );
}

export default Loader