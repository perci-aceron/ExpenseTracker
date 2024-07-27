//src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'SuisseIntl.ttf';
    src: url('../assets/fonts/SuisseIntl.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  body {
    font-family: 'SuisseIntl.ttf', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Add other global styles here */
`;

export default GlobalStyles;
