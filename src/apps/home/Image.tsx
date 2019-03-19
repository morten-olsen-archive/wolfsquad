import React from 'react';
import styled from 'styled-components';
import Row from 'components/Row';

const image = require('./me.jpg');

const Image = styled.img`

`;

const ImageApp = () => (
  <Image src={image} />
);

export default ImageApp;