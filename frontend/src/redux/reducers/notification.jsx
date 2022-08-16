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

    case actionTypes.LOGOUT:
      toast.info('Logged out');
      return { ...state };

    case actionTypes.REGISTER_SUCCESS:
      toast.success('Account created. Check your email to verify your account');
      return { ...state };

    case actionTypes.ACTIVATION_SUCCESS:
      toast.success('Account activated');
      return { ...state };
    
    case actionTypes.UPDATE_PERSONAL_THERAPIST_INFO_SUCCESS:
      toast.success('Personal info updated');
      return { ...state };

    case actionTypes.REMOVE_THERAPIST_DOCUMENT_SUCCESS:
      toast.success('Document removed successfully');
      return { ...state };
    
    case actionTypes.REMOVE_THERAPIST_DOCUMENT_FAILURE:
      toast.error('Error removing document');
      return { ...state };

    case actionTypes.ADD_THERAPIST_DOCUMENT_SUCCESS:
      toast.success('Document added successfully');
      return { ...state };
    
    case actionTypes.ADD_THERAPIST_DOCUMENT_FAILURE:
      toast.error('Error adding document');
      return { ...state };

    case actionTypes.DEPOSIT_SUCCESS:
      toast.success('Redirecting to payment page');
      return { ...state };

    case actionTypes.ACTIVATION_FAILURE:
    case actionTypes.GET_USER_INFO_FAILURE:
    case actionTypes.REGISTER_FAILURE:
    case actionTypes.GET_PERSONAL_THERAPIST_INFO_FAILURE:
    case actionTypes.UPDATE_PERSONAL_THERAPIST_INFO_FAILURE:
    case actionTypes.DEPOSIT_FAILURE:
      toast.error(action.error);
      return { ...state };

    default:
      return state;
  }
}

export default notification;
