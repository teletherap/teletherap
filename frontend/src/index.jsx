import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import configureStore from './redux/store/configureStore';

const persistedState = localStorage.getItem('Teletherap')
  ? JSON.parse(localStorage.getItem('Teletherap'))
  : undefined;

const store = configureStore(persistedState);

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem(
    'Teletherap',
    JSON.stringify(state)
  );
});

const Toast = () => (
  <ToastContainer
    position="top-right"
    autoClose={4000}
    transition={Slide}
    hideProgressBar={false}
    pauseOnHover={false}
    pauseOnFocusLoss={false}
    closeOnClick
    limit={3}
  />
);


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toast />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
