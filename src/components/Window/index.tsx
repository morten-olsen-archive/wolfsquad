import React, { useState, useEffect, useRef, ReactNode } from 'react';
import styled from 'styled-components';
import { Titlebar } from 'typography';

interface Props {
  rotationX?: number;
  rotationY?: number;
  initialX?: number;
  initialY?: number;
  openX?: number;
  openY?: number;
  children: ReactNode;
  close?: () => void;
}

const Wrapper = styled.div`
  background: #000;
  color: #fff;
  position: absolute;
  display: flex;
  flex-direction: column;
  opacity: .85;
  border: solid 1px red;
  border-radius: 5px;
`;

const TopBar = styled.div`
  display: flex;
  user-select: none;
  align-items: center;
  padding: 5px;
  border-bottom: solid 1px red;
`;

const Title = styled(Titlebar)`
  flex: 1;
  margin-right: 10px;
`;

const Close = styled.div`
  &::after {
    content: 'x';
  }
`;

interface Dragging {
  elementX: number;
  mouseX: number;
  elementY: number;
  mouseY: number;
}

const Window = ({
  rotationX = 10,
  initialX = 0,
  initialY = 0,
  openX = 0,
  openY = 0,
  close,
  children,
}: Props) => {
  const container = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean | Dragging>(false);
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [centers, setCenters] = useState({ x: 0, y: 0 });
  const [initialized, setInitialized] = useState(false);
  const [animated, setAnimated] = useState(true);
  
  useEffect(() => {
    const onMouseUp = () => {
      setIsDragging(false);
    }
    const updateCenters = () => {
      const { clientWidth = 0, clientHeight = 0 } = container.current || {}
      const x = ((position.x + (clientWidth / 2)) / window.innerWidth - 0.5) * 2;
      const y = ((position.y + (clientHeight / 2)) / window.innerHeight - 0.5) * 2;
      setCenters({
        x,
        y,
      });
    }
    const onMouseMove = (evt: React.MouseEvent) => {
      if (typeof isDragging === 'object') {
        
        const dragX = evt.screenX - isDragging.mouseX;
        const dragY = evt.screenY - isDragging.mouseY;
        const x = isDragging.elementX + dragX
        const y = isDragging.elementY + dragY;
        setPosition({
          x,
          y,
        });
        updateCenters();
      }
    }
    document.documentElement.addEventListener('mouseup', onMouseUp as any);
    document.documentElement.addEventListener('mousemove', onMouseMove as any);

    if (!initialized) {
      if (container.current) {
        updateCenters();
        setInitialized(true);
        container.current.addEventListener('transitionend', () => {
          setAnimated(false);
        });
        setTimeout(() => {
          setAnimated(false);
        }, 15000);
      }
    }

    return () => {
      document.documentElement.removeEventListener('mouseup', onMouseUp as any);
      document.documentElement.removeEventListener('mousemove', onMouseMove as any);
    }
  });

  const initTransform = [
    `translate(${-position.x}px, ${-position.y}px)`,
    `translate(${openX}px, ${openY}px)`,
    `scale(0.1, 0.1)`,
    'rotateX(50deg)',
  ];

  const transforms = [
    `translate(${position.x}px, ${position.y}px)`,
    `rotateY(${-centers.x * rotationX}deg)`,
    // `rotateX(${centers.y * rotationY}deg)`,
    ...(!initialized ? initTransform : []),
  ];

  return (
    <Wrapper
      ref={container}
      style={{
        transform: transforms.join(' '),
        transition: animated ? 'transform .5s' : undefined,
      }}
    >
      <TopBar
        onMouseDown={(evt) => {
          setIsDragging({
            mouseX: evt.screenX,
            elementX: position.x,
            mouseY: evt.screenY,
            elementY: position.y,
          })
        }}
      >
        <Title>Hello</Title>
        {close && <Close onClick={close} />}
      </TopBar>
      {children}
    </Wrapper>
  )
};

export default Window;