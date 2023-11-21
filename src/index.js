import React from 'react';
import ReactDOM from 'react-dom';
import store from './app/store';
import {Provider} from 'react-redux';
import App from './App';
import StyledEngineProvider from '@mui/styled-engine/StyledEngineProvider';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <App />
      </StyledEngineProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);