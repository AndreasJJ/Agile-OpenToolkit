import React from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import { history } from '../../state/helpers/history';

import styled from 'styled-components';

import BackgroundImage from '../../assets/splash/background.gif'
import welcomeImage from '../../assets/splash/welcome.svg'
import backlogImage from '../../assets/splash/backlog.svg'
import PlanningPokerImage from '../../assets/splash/PlanningPoker.svg'
import sprintboardImage from '../../assets/splash/sprintboard.svg'
import retrospectiveImage from '../../assets/splash/retrospective.svg'

const Content = styled.div`
    height: inherit;
    width: inherit;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 50% 50%;
    background-image: url(${props => props.image});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover

    @media only screen and (min-width: 768px) {
      grid-template-columns: 40% 60%;
      grid-template-rows: 100%;
    }
`

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px;
  color: white;
`

const Logo = styled.h1`
  font-size: 3em;
  font-weight: bolder;
`

const GetStarted = styled.button`
  padding: 20px;
  width: 150px;
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  border-radius: 5px
  border: none;
`

const Continue = styled.span`
  margin-top: 10px;
  font-family: Georgia,Times,'Times New Roman',serif;
`

const LastChance = styled.button`
  padding: 20px;
  width: 200px;
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  border-radius: 5px
  border: none;
`

const SideImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 30px;
`

const Image = styled.img`
  width: 100%;
  height: 100%;
`

const LICENSEKEY = "***REMOVED***"

export default class HomePage extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      
    };
    this.toRegister = this.toRegister.bind(this)
    this.setCookie = this.setCookie.bind(this)
    this.getCookie = this.getCookie.bind(this)
  }

  componentDidMount() {
    if(this.getCookie("visited")) {
      history.push('/login');
    }

    this.setCookie("visited", true)
  }

  toRegister(e) {
    e.preventDefault();

    history.push('/register');
  }

  setCookie(name,value,days) {
      var expires = "";
      if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days*24*60*60*1000));
          expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }

  getCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
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
                <Content image={BackgroundImage}>
                  <TextContent>
                    <Logo>Agile Toolkit</Logo>
                    <h2>Collaborate with your team, write clean code, and make awesome products. Let us take care of scrum!</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sit amet augue tincidunt, efficitur augue eget, elementum dui. Nam lacinia ligula tellus, eget interdum ipsum dictum vel. Nam cursus, elit eget rhoncus vulputate, odio risus gravida mauris, nec maximus nisl purus nec mi. Morbi id pulvinar elit. Vivamus viverra id eros id egestas. Aliquam purus massa, ornare vel viverra eu.</p>
                    <GetStarted onClick={e => this.toRegister(e)}>Get Started</GetStarted>
                    <Continue>Still not convinced? Scroll down!</Continue>
                  </TextContent>
                  <SideImage>
                    <Image src={welcomeImage} />
                  </SideImage>
                </Content>
              </div>
              <div className="section">
                <Content image={BackgroundImage}>
                  <TextContent>
                    <h2>Easily keep track of your issues with a proper product backlog</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla imperdiet quam et tortor convallis varius. Praesent nisi metus, elementum a lectus non, consequat eleifend sem. Vivamus congue felis at lectus.</p>
                  </TextContent>
                  <SideImage>
                    <Image src={backlogImage} />
                  </SideImage>
                </Content>
              </div>
              <div className="section">
                <Content image={BackgroundImage}>
                  <TextContent>
                    <h2>Estimate your issue's story points with planning poker</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla imperdiet quam et tortor convallis varius. Praesent nisi metus, elementum a lectus non, consequat eleifend sem. Vivamus congue felis at lectus.</p>
                  </TextContent>
                  <SideImage>
                    <Image src={PlanningPokerImage} />
                  </SideImage>
                </Content>
              </div>
              <div className="section">
                <Content image={BackgroundImage}>
                  <TextContent>
                    <h2>Keep track of the sprint and your teammates with a sprintboard</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla imperdiet quam et tortor convallis varius. Praesent nisi metus, elementum a lectus non, consequat eleifend sem. Vivamus congue felis at lectus.</p>
                  </TextContent>
                  <SideImage>
                    <Image src={sprintboardImage} />
                  </SideImage>
                </Content>
              </div>
              <div className="section">
                <Content image={BackgroundImage}>
                  <TextContent>
                    <h2>Improve your sprints with our retrospective boards</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla imperdiet quam et tortor convallis varius. Praesent nisi metus, elementum a lectus non, consequat eleifend sem. Vivamus congue felis at lectus.</p>
                    <LastChance onClick={e => this.toRegister(e)}>Start your journey today</LastChance>
                  </TextContent>
                  <SideImage>
                    <Image src={retrospectiveImage} />
                  </SideImage>
                </Content>
              </div>
            </ReactFullpage.Wrapper>
          );
        }}
      />
    );
  }
}