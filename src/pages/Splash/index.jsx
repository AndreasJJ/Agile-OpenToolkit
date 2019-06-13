import React from 'react';
import ReactFullpage from '@fullpage/react-fullpage';

import styled from 'styled-components';

import splash1 from '../../assets/splash1.jpg'
import splash2 from '../../assets/splash2.jpg'

const Section = styled.div`
    height: inherit;
    width: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-image: ${props => "url(" + props.image + ");"}
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover
`

const TextBorder = styled.div`
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.95)
`

const LICENSEKEY = "***REMOVED***"

export default class HomePage extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      
    };
  }

  componentDidMount() {

  }

  render() {

    return (
      <ReactFullpage licenseKey={LICENSEKEY}
        navigation
        anchors={['welcome', 'productBacklog', 'PlanningPoker', 'sprintboard', 'retrospective']}
        parallax
        render={({ state, fullpageApi }) => {
          return (
            <ReactFullpage.Wrapper>
              <div className="section">
                <Section image={splash1}>
                  <TextBorder>
                    <h1>Collaborate with your team, let us take care of Scrum.</h1>
                  </TextBorder>
                </Section>
              </div>
              <div className="section">
                <Section>
                  <TextBorder>
                    <h1>Easily keep track of your issues with a proper product backlog</h1>
                  </TextBorder>
                </Section>
              </div>
              <div className="section">
                <Section image={splash2}>
                  <TextBorder>
                    <h1>Estimate your issue's story points with planning poker</h1>
                  </TextBorder>
                </Section>
              </div>
              <div className="section">
                <Section>
                  <TextBorder>
                    <h1>Keep track of the sprint and your teammates with a sprintboard</h1>
                  </TextBorder>
                </Section>
              </div>
              <div className="section">
                <Section>
                  <TextBorder>
                    <h1>Improve your sprints with our retrospective boards</h1>
                    <button>Get started today</button>
                  </TextBorder>
                </Section>
              </div>
            </ReactFullpage.Wrapper>
          );
        }}
      />
    );
  }
}