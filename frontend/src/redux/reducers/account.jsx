import * as actionTypes from '../actionTypes';

const initState = {
  isFetching: false,
  isLoggedIn: false,
  token: '',
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
      return {
        ...state,
        isLoggedIn: false,
        isFetching: false,
      };

    case actionTypes.LOGOUT_REQUEST:
      return initState;

    case actionTypes.REGISTER_REQUEST:
      return {
        ...state,
        isFetching: true,
        isLoggedIn: false,
      };

    default:
      return state;
  }
}

export default account;
