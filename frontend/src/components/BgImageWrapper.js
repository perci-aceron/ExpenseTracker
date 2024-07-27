// src/components/BgImageWrapper.js
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  /* Add your styles for the decorative background image here */
  background-image: url('/path-to-background-image.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh; /* Adjust as needed */
`;

const BgImageWrapper = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default BgImageWrapper;
