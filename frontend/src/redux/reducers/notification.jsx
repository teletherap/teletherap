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

    case actionTypes.REGISTER_SUCCESS:
      toast.success('Account created. Check your email to verify your account');
      return { ...state };

    case actionTypes.ACTIVATION_SUCCESS:
      toast.success('Account activated');
      return { ...state };

    case actionTypes.ACTIVATION_FAILURE:
    case actionTypes.GET_USER_INFO_FAILURE:
    case actionTypes.REGISTER_FAILURE:
      toast.error(action.error);
      return { ...state };

    default:
      return state;
  }
}

export default notification;
