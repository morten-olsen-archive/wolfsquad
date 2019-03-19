import React from 'react';
import { App } from 'apps';

const app: App = {
  name: 'home',
  open: async (open) => {
    const {default: Data} = await import(/* webpackPrefetch: true */ './Data');
    await open(<Data />, {
      location: {
        x: window.innerWidth - 400,
        y: 10,
      },
    });
    const {default: Image} = await import(/* webpackPrefetch: true */ './Image');
    await open(<Image />, {
      location: {
        x: window.innerWidth - 500,
        y: 200,
      },
    });
  }
};

export default app;