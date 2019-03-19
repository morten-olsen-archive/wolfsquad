import React from 'react';
import styled from 'styled-components';
import { Body } from 'typography';

export interface Props {
  description?: string,
  right?: string,
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
`;

const Main = styled.div`
  flex: 1;
  padding: 0 10px;
`;

const Right = styled.div`
  padding-right: 10px;
`;

const Row = ({
  description,
  right,
}: Props) => (
  <Wrapper>
    <Main>
      {description && <Body>{description}</Body>}
    </Main>
    {right && (
      <Right>
        {right}
      </Right>
    )}
  </Wrapper>
);

export default Row;