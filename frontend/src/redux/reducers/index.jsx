import { combineReducers } from 'redux';
import account from './account';
import notification from './notification';

const allReducers = combineReducers({
  account: account,
  notification: notification,
});

export default allReducers;
