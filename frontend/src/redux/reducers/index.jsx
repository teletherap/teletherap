import { combineReducers } from 'redux';
import account from './account';
import notification from './notification';
import therapist from './therapist';

const allReducers = combineReducers({
  account: account,
  notification: notification,
  therapist: therapist,
});

export default allReducers;
