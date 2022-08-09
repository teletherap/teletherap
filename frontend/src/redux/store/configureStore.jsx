import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import api from '../middleware/api';
import rootReducer from '../reducers';

const configureStoreProd = (preloadedState) => {
  if (preloadedState === undefined) {
    return createStore(rootReducer, applyMiddleware(thunk, api));
  }
  return createStore(rootReducer, preloadedState, applyMiddleware(thunk, api));
}

export default configureStoreProd;
