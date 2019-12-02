import React, {useEffect, useRef} from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import { history } from '../../state/helpers/history';

import LogoSrc from '../../assets/Logo.png'

import styled, { keyframes } from 'styled-components';

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
    grid-template-columns: 40% 60%;
    grid-template-rows: Calc(100% - 100px);
    background-color: #2ECEFE;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover
    @media only screen and (max-width: 768px) {
      grid-template-columns: 100%;
      grid-template-rows: Calc(100% - 100px);
    }
`

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px;
  color: white;
`

const LogoWrapper = styled.div`
  display: flex;
  align-content: center;
  height: auto;
`

const Logo = styled.div`
  display: block;
  height: 100%;
  width: 100%;
`

const LogoImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
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

const WaveBox = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`

const Waves = styled.svg`
  position: relative;
  width: 100%;
  height: 15vh;
  margin-bottom: -7px;
  min-height: 100px;
  max-height: 150px;

  @media (max-width: 768px) {
    height: 40px;
    min-height: 40px;
  }
`

const MoveForever = keyframes`
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
`

const Parallax = styled.g`
  &>use {
      animation: ${MoveForever} 25s cubic-bezier(.55, .5, .45, .5) infinite;
  }

  &>use:nth-child(1) {
    animation-delay: -2s;
    animation-duration: 7s;
  }

  &>use:nth-child(2) {
    animation-delay: -3s;
    animation-duration: 10s;
  }

  &>use:nth-child(3) {
    animation-delay: -4s;
    animation-duration: 13s;
  }

  &>use:nth-child(4) {
    animation-delay: -5s;
    animation-duration: 20s;
  }
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

  @media only screen and (max-width: 768px) {
    display: none;
  }
`

const Image = styled.img`
  width: 100%;
  height: 100%;
`

const LICENSEKEY = "***REMOVED***"

const HomePage = (props) => {

  const prevProps = useRef(props)

  useEffect(() => {
    if(getCookie("visited")) {
      history.push('/login');
    }
  }, [])

  useEffect(() => {
    props.finishLoading()
  })

  const toRegister = (e) => {
    e.preventDefault();

    history.push('/register');
  }

  const getCookie = (name) => {
      let nameEQ = name + "=";
      let ca = document.cookie.split(';');
      for(let i=0;i < ca.length;i++) {
          let c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
  }

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
                  <LogoWrapper>
                    <Logo><LogoImage src={LogoSrc} /></Logo>
                  </LogoWrapper>
                  <h2>Collaborate with your team, write clean code, and make awesome products. Let us take care of scrum!</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sit amet augue tincidunt, efficitur augue eget, elementum dui. Nam lacinia ligula tellus, eget interdum ipsum dictum vel. Nam cursus, elit eget rhoncus vulputate, odio risus gravida mauris, nec maximus nisl purus nec mi. Morbi id pulvinar elit. Vivamus viverra id eros id egestas. Aliquam purus massa, ornare vel viverra eu.</p>
                  <GetStarted onClick={e => toRegister(e)}>Get Started</GetStarted>
                  <Continue>Still not convinced? Scroll down!</Continue>
                </TextContent>
                <SideImage>
                  <Image src={welcomeImage} />
                </SideImage>
              </Content>
              <WaveBox>
                <Waves xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
                    <defs>
                        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                    </defs>
                    <Parallax>
                        <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
                        <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
                        <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
                        <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
                    </Parallax>
                </Waves>
              </WaveBox>
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
              <WaveBox>
                <Waves xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
                    <defs>
                        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                    </defs>
                    <Parallax>
                        <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
                        <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
                        <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
                        <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
                    </Parallax>
                </Waves>
              </WaveBox>
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
              <WaveBox>
                <Waves xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
                    <defs>
                        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                    </defs>
                    <Parallax>
                        <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
                        <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
                        <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
                        <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
                    </Parallax>
                </Waves>
              </WaveBox>
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
              <WaveBox>
                <Waves xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
                    <defs>
                        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                    </defs>
                    <Parallax>
                        <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
                        <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
                        <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
                        <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
                    </Parallax>
                </Waves>
              </WaveBox>
            </div>
            <div className="section">
              <Content image={BackgroundImage}>
                <TextContent>
                  <h2>Improve your sprints with our retrospective boards</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla imperdiet quam et tortor convallis varius. Praesent nisi metus, elementum a lectus non, consequat eleifend sem. Vivamus congue felis at lectus.</p>
                  <LastChance onClick={e => toRegister(e)}>Start your journey today</LastChance>
                </TextContent>
                <SideImage>
                  <Image src={retrospectiveImage} />
                </SideImage>
              </Content>
              <WaveBox>
                <Waves xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
                    <defs>
                        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                    </defs>
                    <Parallax>
                        <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
                        <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
                        <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
                        <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
                    </Parallax>
                </Waves>
              </WaveBox>
            </div>
          </ReactFullpage.Wrapper>
        );
      }}
    />
  )
}

export default HomePage