import { combineReducers } from 'redux';
import account from './account';
import notification from './notification';
import finance from './finance';

const allReducers = combineReducers({
  account: account,
  notification: notification,
  finance: finance,
});

export default allReducers;
