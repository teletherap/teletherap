import fetchApi from './fetchApi';

export const CALL_API = 'Call API';

export default ({ getState }) =>
  (next) => async (action) => {
    const callAPI = action[CALL_API];
    if (typeof callAPI === 'undefined') {
      return next(action);
    }

    const actionWith = (data) => {
      const finalAction = Object.assign({}, action, data);
      delete finalAction[CALL_API];
      return finalAction;
    }

    const { fetchOptions, url, types, payload } = callAPI;
    const [requestType, successType, failureType] = types;

    next(actionWith({ payload, type: requestType }));

    try {
      if (!fetchOptions.formData) {
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

      return next(
        actionWith({
          payload,
          response,
          type: successType,
        })
      );
    } catch (error) {
      return next(
        actionWith({
          payload,
          type: failureType,
          error: error.message || 'Something bad happened!',
        })
      );
    }
  }
