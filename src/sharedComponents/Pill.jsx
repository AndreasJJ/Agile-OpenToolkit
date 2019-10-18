import React from 'react';

import styled from 'styled-components';

const Wrapper = styled.div`
	display: flex;
	margin-right: 5px;
	padding-top: 10px;
`

const Content = styled.div`
	border-top-left-radius: 20px;
	border-bottom-left-radius: 20px;
	background-color: #32BD36;
	padding: 5px 5px 5px 7px;
	margin-right: 2px;
	display: flex;
	align-items: center;
    justify-content: center;
    color: #ffffff;
`

const X = styled.div`
	border-top-right-radius: 20px;
	border-bottom-right-radius: 20px;
	background-color: #32BD36;
	padding: 5px 7px 5px 5px;
	display: flex;
	align-items: center;
    justify-content: center;
    color: #ffffff;
    -webkit-user-select: none; /* Safari */
   	-khtml-user-select: none; /* Konqueror HTML */
     -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
`

const Pill = (props) => {
  return (
    <Wrapper>
    	<Content>
    		{props.text}
    	</Content>
    	<X onClick={() => props.onClear()}>
    		x
    	</X>
    </Wrapper>
  )
}

export default Pill