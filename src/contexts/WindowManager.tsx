import React, { createContext, ReactNode, Component } from 'react';
import uuid from 'uuid';
import Window from '../components/Window';

interface Props {
  children: ReactNode,
}

interface Options {
  openFrom?: {
    x: number;
    y: number;
  };
  location?: {
    x: number;
    y: number;
  }
}

export type Open = (content: ReactNode, options?: Options) => Promise<void>;

interface ContextProps {
  windows: ReactNode[];
  open: Open;
}

let windowsCache: ReactNode[] = [];

const { Consumer, Provider: InnerProvider } = createContext<ContextProps>(undefined as any);

class Provider extends Component<Props, { windows: ReactNode[] }> {
  state = {
    windows: [],
  }

  render() {
    const { windows = [] } = this.state || {};
    const open: Open = (content, { openFrom, location }: Options = {}) => new Promise((resolve, reject) => {
      const id = uuid.v4();
      const window = (
        <Window
          key={id}
          openX={openFrom ? openFrom.x : undefined}
          openY={openFrom ? openFrom.y : undefined}
          initialX={location ? location.x : undefined}
          initialY={location ? location.y : undefined}
          close={() => {
            const { windows = [] } = this.state;
            this.setState({
              windows: windows.filter(w => w !== window),
            });
          }}
        >
          {content}
        </Window>
      )
      windowsCache = [
        ...windowsCache,
        window,
      ]
      this.setState({
        windows: [
          ...this.state.windows,
          window,
        ],
      }, () => {
        resolve();
      });
    });
    return (
      <InnerProvider
        value={{
          windows,
          open,
        }}
      >
        {this.props.children}
      </InnerProvider>
    );
  }
}

export {
  Provider,
};

export default Consumer;