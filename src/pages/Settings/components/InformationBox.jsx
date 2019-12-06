import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

const Box = styled.div`
    background-color: ${
        props => 
            props.importance === "critical" 
            ?
                "rgb(255, 87, 71, 0.6)"
            :
                props.importance === "important"
                ?
                    "rgb(255, 179, 71, 0.6)"
                :
                    "rgb(71, 255, 87, 0.6)"
    };
    width: 100%;
    max-width: 800px;
    padding: 10px;
    box-sizing: border-box;
`

const Title = styled.h3`
    margin-top: 0px;
`

const InformationBox = (props) => {

  return (
    <Box importance={props.importance}>
        <Title>{props.title}</Title>
        <p>
            {props.info}
        </p>
    </Box>
  )
}

InformationBox.proptypes = {

}

export {
    InformationBox
}