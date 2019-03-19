import React from 'react';
import styled from 'styled-components';
import Row from 'components/Row';

const Wrapper = styled.div`

`;

const Data = () => (
  <Wrapper>
    <Row
      description="Name"
      right="Morten Olsen"
    />
    <Row
      description="Location"
      right="Copenhagen, Denmark"
    />
    <Row
      description="Occupation"
      right="Developer"
    />
    <Row
      description="E-mail"
      right="morten@olsen.pro"
    />
  </Wrapper>
);

export default Data;