import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {AppProvider} from "@inlet/react-pixi";
import { Application } from 'pixi.js';

const app = new Application();

const App2 = () => {
  return <AppProvider value={app}>
      <App />
  </AppProvider>
}

ReactDOM.render(<App2/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
