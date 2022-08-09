import * as actionTypes from '../actionTypes';
import { toast } from 'react-toastify';

const initState = {}

const notification = (state = initState, action) => {

  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      toast.success('Welcome back!');
      return { ...state };

    case actionTypes.LOGIN_FAILURE:
      toast.error('Wrong username or password');
      return { ...state };

    case actionTypes.LOGOUT_REQUEST:
      toast.info('Logged out');
      return { ...state };

    default:
      return state;
  }
}

export default notification;
