import React, { ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';
import WindowManager from 'contexts/WindowManager';
import Wallpaper from 'components/Wallpaper';
import apps from 'apps';

const logo = require('assets/WolfLogo.gif');

const rotate = keyframes`
  from {
    transform: 
      translate(-50%, -50%)
      rotateY(0deg);
  }

  to {
    transform: 
      translate(-50%, -50%)
      rotateY(360deg);
  }
`;


const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Background = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -100;
`;

const Logo = styled.img`
  border-radius: 50%;
  position: absolute;
  width: 250px;
  height: 250px;
  top: 50%;
  left: 50%;
  animation: ${rotate} 10s linear infinite;
  transform: translate(-50%, -50%);
  box-shadow: 0px 0px 34px #000;
    background-color: #000;
  opacity: .8;
`;

const Pattern = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background:
    repeating-linear-gradient(45deg, rgba(0,0,0,0), rgba(0,0,0,0) 6px, rgba(255,255,255,0.3) 6px, rgba(0,0,0,0) 7px, rgba(0,0,0,0) 12px);
  background-size: 11px 11px;
`

const Icons = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  perspective: 300px;
  position: absolute;
`;

const Desktop = () => {
  return (
    <WindowManager>
      {({ windows, open }) => (
        <Wrapper>
          <Background>
            <Wallpaper />
            <Pattern />
            <Logo src={logo} />
          </Background>
          <Icons>
            {apps.map(({ name, open: appOpen }) => (
              <button
                key={name}
                onClick={(evt) => {
                  const x = evt.pageX;
                  const y = evt.pageY;
                  const openFn = async (component: ReactNode, options: any = {}) => {
                    open(component, {
                      ...options,
                      openFrom: { x, y },
                    });
                  };
                  appOpen(openFn);
                }}
              >
                {name}
              </button>
            ))}
            {windows}
          </Icons>
        </Wrapper>
      )}
    </WindowManager>
  )
};

export default Desktop;