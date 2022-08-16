import { combineReducers } from 'redux';
import account from './account';
import notification from './notification';
import therapist from './therapist';
import finance from './finance';

const allReducers = combineReducers({
  account: account,
  notification: notification,
  therapist: therapist,
  finance: finance,
});

export default allReducers;
