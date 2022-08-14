import * as actionTypes from '../actionTypes';
import * as URLs from './urls';
import { CALL_API } from '../middleware/api';

export const login = (username, password) => {
  return {
    [CALL_API]: {
      types: [
        actionTypes.LOGIN_REQUEST,
        actionTypes.LOGIN_SUCCESS,
        actionTypes.LOGIN_FAILURE,
      ],
      url: URLs.LOGIN,
      payload: {
        username,
      },
      fetchOptions: {
        method: 'POST',
        body: { username, password },
      },
    },
  };
}

export const logout = () => ({
  [CALL_API]: {
    types: [
      actionTypes.LOGOUT_REQUEST,
      actionTypes.LOGOUT_SUCCESS,
      actionTypes.LOGOUT_FAILURE,
    ],
    url: URLs.LOGOUT,
    fetchOptions: {
      method: 'POST',
    },
  },
});

export const register = (type, username, password, password2, email, firstName, lastName) => ({
  [CALL_API]: {
    types: [
      actionTypes.REGISTER_REQUEST,
      actionTypes.REGISTER_SUCCESS,
      actionTypes.REGISTER_FAILURE,
    ],
    url: `${URLs.REGISTER}${type}/`,
    fetchOptions: {
      method: 'POST',
      body: {
        username,
        password,
        password2,
        email,
        first_name: firstName,
        last_name: lastName,
      },
    },
  },
});

export const activate = (username, token) => ({
  [CALL_API]: {
    types: [
      actionTypes.ACTIVATION_REQUEST,
      actionTypes.ACTIVATION_SUCCESS,
      actionTypes.ACTIVATION_FAILURE,
    ],
    url: `${URLs.ACTIVATE}${username}/${token}/`,
    fetchOptions: {
      method: 'GET',
    },
  },
});

export const getUserInfo = () => ({
  [CALL_API]: {
    types: [
      actionTypes.GET_USER_INFO_REQUEST,
      actionTypes.GET_USER_INFO_SUCCESS,
      actionTypes.GET_USER_INFO_FAILURE,
    ],
    url: URLs.GET_USER_INFO,
    fetchOptions: {
      method: 'GET',
    },
  },
});
