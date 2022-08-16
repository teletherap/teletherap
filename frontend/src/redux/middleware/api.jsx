import fetchApi from './fetchApi';
import * as actionTypes from '../actionTypes';
import { logout, refresh } from '../actions/account';

export const CALL_API = 'Call API';

const api = ({ getState, dispatch }) => (next) => async (action) => {
  const callAPI = action[CALL_API];
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  const actionWith = (data) => {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  }

  const { fetchOptions, url, types, payload, afterSuccess } = callAPI;
  const [requestType, successType, failureType] = types;

  next(actionWith({ payload, type: requestType }));

  try {
    if (!fetchOptions.dontStringify) {
      fetchOptions.body = JSON.stringify(fetchOptions.body);
    }

    if (!fetchOptions.dontContentType) {
      fetchOptions.headers = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      };
    }

    const account = getState().account;
    if (!!account && !!account.token) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        Authorization: 'Bearer ' + account.token,
      };
    }

    const response = await fetchApi(url, fetchOptions);
    const successAction = actionWith({
      payload,
      response,
      type: successType,
    });

    if (afterSuccess) {
      return dispatch(successAction)
        .then(() => dispatch(afterSuccess));
    }

    return next(successAction);
  } catch (error) {
    if (error.message === 'TOKEN EXPIRED' && getState().account.isLoggedIn) {
      if (requestType === actionTypes.REFRESH_REQUEST) {
        return dispatch(logout());
      }
      if (fetchOptions.body !== undefined) {
        fetchOptions.body = JSON.parse(fetchOptions.body);
      }
      return dispatch(refresh(getState().account.refreshToken, action));
    }
    return next(
      actionWith({
        payload,
        type: failureType,
        error: error.message || 'Something bad happened!',
      })
    );
  }
};

export default api;
