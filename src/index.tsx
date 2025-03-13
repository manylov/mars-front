import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ToastProvider } from 'react-toast-notifications';
import { store } from '@redux/store';
import GlobalStyle from '@root/features/global/styles/global.styles';
import { AppRouter } from '@root/router';

// Enabling the debug mode flag is useful during implementation,
// but it's recommended you remove it for production
const ROOT_ID = 'root';

ReactDOM.render(
  <ToastProvider
    autoDismiss
    autoDismissTimeout={10000}
    placement="bottom-right"
  >
    <Provider store={store}>
      <Fragment>
        <AppRouter />
        <GlobalStyle />
      </Fragment>
    </Provider>
  </ToastProvider>,
  document.getElementById(ROOT_ID)
);
