import { combineReducers } from 'redux';
import account from './account';
import notification from './notification';
import finance from './finance';
import home from './home';

const allReducers = combineReducers({
  account: account,
  notification: notification,
  finance: finance,
  home: home,
});

export default allReducers;
