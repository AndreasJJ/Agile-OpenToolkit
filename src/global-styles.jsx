import { createGlobalStyle } from 'styled-components'
import { Roboto } from './assets/fonts/Roboto-Bold.ttf'

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    margin: 0;
  }

  body {
    font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Roboto', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
    height: inherit;
    width: inherit;
  }

  p,
  label {
    font-family: 'Roboto', Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }

  #fp-nav ul li:hover a.active span,
  #fp-nav ul li a.active span,
  .fp-slidesNav ul li:hover a.active span,
  .fp-slidesNav ul li a.active span {
    background-color: #02a3d9;
  }
`;

export default GlobalStyle;
