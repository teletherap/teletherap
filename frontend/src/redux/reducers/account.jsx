import * as actionTypes from '../actionTypes';

const initState = {
  isFetching: false,
  isLoggedIn: false,
  token: '',
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  isTherapist: false,
};

const account = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_REQUEST:
      return {
        ...state,
        isLoggedIn: false,
        isFetching: true,
      };

    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isLoggedIn: true,
        token: action.response.access,
      };

    case actionTypes.LOGIN_FAILURE:
    case actionTypes.REGISTER_SUCCESS:
    case actionTypes.REGISTER_FAILURE:
    case actionTypes.ACTIVATION_SUCCESS:
    case actionTypes.ACTIVATION_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        isFetching: false,
      };

    case actionTypes.LOGOUT_REQUEST:
      return initState;

    case actionTypes.REGISTER_REQUEST:
    case actionTypes.ACTIVATION_REQUEST:
      return {
        ...state,
        isFetching: true,
        isLoggedIn: false,
      };

    case actionTypes.GET_USER_INFO_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case actionTypes.GET_USER_INFO_SUCCESS:
      return {
        ...state,
        isFetching: false,
        username: action.response.username,
        firstName: action.response.first_name,
        lastName: action.response.last_name,
        email: action.response.email,
        isTherapist: action.response.is_therapist,
      };

    case actionTypes.GET_USER_INFO_FAILURE:
      console.log(action.error);
      return {
        ...state,
        isFetching: false,
      };

    default:
      return state;
  }
}

export default account;
