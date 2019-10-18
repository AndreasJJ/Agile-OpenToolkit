import React from 'react';
import { Line } from 'react-chartjs-2';

import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`

const Burndown = (props) => {
  return(
    <Wrapper>
      <Line
        options={{responsive: true, 
                  maintainAspectRatio: false,
                  scales: {
                    yAxes: [{
                      scaleLabel: {
                        display: true,
                        labelString: 'Story Points'
                      },
                      ticks: {
                          suggestedMin: 0,
                          suggestedMax: 100
                      }
                    }]
                  }  
                }}
       />
    </Wrapper>
  )
}

export default Burndown