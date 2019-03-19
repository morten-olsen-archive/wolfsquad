import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components'
import Desktop from 'components/Desktop';
import { Provider} from 'contexts/WindowManager';

const root = document.createElement('div');
root.id = 'root';
document.body.append(root);

const GlobalStyle = createGlobalStyle`
  @import url('https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.1/mapbox-gl.css');
  @import url('https://fonts.googleapis.com/css?family=Orbitron');

  * {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    margin: 0;
  }

  body {
    font-family: 'Orbitron', sans-serif;
    text-shadow: 0 0 3px rgba(0,0,0,1);
  }
`;


ReactDOM.render(
  <Provider>
    <GlobalStyle />
    <Desktop />
  </Provider>,
  root,
);