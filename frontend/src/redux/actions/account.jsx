import * as actionTypes from '../actionTypes';
import * as URLs from './urls';
import { CALL_API } from '../middleware/api';

export const login = (username, password) => ({
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
    afterSuccess: getUserInfo(),
  },
});

export const refresh = (refreshToken, afterRefresh) => ({
  [CALL_API]: {
    types: [
      actionTypes.REFRESH_REQUEST,
      actionTypes.REFRESH_SUCCESS,
      actionTypes.REFRESH_FAILURE,
    ],
    url: URLs.REFRESH,
    fetchOptions: {
      method: 'POST',
      body: {
        refresh: refreshToken,
      },
    },
    afterSuccess: afterRefresh,
  },
});

export const logout = () => ({
  type: actionTypes.LOGOUT,
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

export const getPersonalTherapistInfo = () => ({
  [CALL_API]: {
    types: [
      actionTypes.GET_PERSONAL_THERAPIST_INFO_REQUEST,
      actionTypes.GET_PERSONAL_THERAPIST_INFO_SUCCESS,
      actionTypes.GET_PERSONAL_THERAPIST_INFO_FAILURE,
    ],
    url: URLs.PERSONAL_THERAPIST_INFO,
    fetchOptions: {
      method: 'GET',
    },
  },
});

export const updatePersonalTherapistInfo = (
  description, licenseId,
  expertise, yearsOfExperience,
  pricePerSession, dailyStartTime,
  dailyEndTime, telegramUsername
) => ({
  [CALL_API]: {
    types: [
      actionTypes.UPDATE_PERSONAL_THERAPIST_INFO_REQUEST,
      actionTypes.UPDATE_PERSONAL_THERAPIST_INFO_SUCCESS,
      actionTypes.UPDATE_PERSONAL_THERAPIST_INFO_FAILURE,
    ],
    url: URLs.PERSONAL_THERAPIST_INFO,
    fetchOptions: {
      method: 'PUT',
      body: {
        description: description,
        license_id: licenseId,
        expertise: expertise,
        years_of_experience: yearsOfExperience,
        price_per_session: pricePerSession,
        daily_start_time: dailyStartTime,
        daily_end_time: dailyEndTime,
        telegram_username: telegramUsername,
      },
    },
  },
});

export const removeDocument = (name) => ({
  [CALL_API]: {
    types: [
      actionTypes.REMOVE_THERAPIST_DOCUMENT_REQUEST,
      actionTypes.REMOVE_THERAPIST_DOCUMENT_SUCCESS,
      actionTypes.REMOVE_THERAPIST_DOCUMENT_FAILURE,
    ],
    url: `${URLs.THERAPIST_DOCUMENTS}${name}/`,
    fetchOptions: {
      method: 'DELETE',
    },
    payload: {
      name: name,
    },
  },
});

export const addDocument = (name, document) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('document', document, document.name);

  return {
    [CALL_API]: {
      types: [
        actionTypes.ADD_THERAPIST_DOCUMENT_REQUEST,
        actionTypes.ADD_THERAPIST_DOCUMENT_SUCCESS,
        actionTypes.ADD_THERAPIST_DOCUMENT_FAILURE,
      ],
      url: URLs.THERAPIST_DOCUMENTS,
      fetchOptions: {
        method: 'POST',
        body: formData,
        dontContentType: true,
        dontStringify: true,
      },
    },
  }
};

export const getPersonalClientInfo = () => ({
  [CALL_API]: {
    types: [
      actionTypes.GET_PERSONAL_CLIENT_INFO_REQUEST,
      actionTypes.GET_PERSONAL_CLIENT_INFO_SUCCESS,
      actionTypes.GET_PERSONAL_CLIENT_INFO_FAILURE,
    ],
    url: URLs.PERSONAL_CLIENT_INFO,
    fetchOptions: {
      method: 'GET',
    },
  },
});

export const updatePersonalClientInfo = (telegramUsername) => ({
  [CALL_API]: {
    types: [
      actionTypes.UPDATE_PERSONAL_CLIENT_INFO_REQUEST,
      actionTypes.UPDATE_PERSONAL_CLIENT_INFO_SUCCESS,
      actionTypes.UPDATE_PERSONAL_CLIENT_INFO_FAILURE,
    ],
    url: URLs.PERSONAL_CLIENT_INFO,
    fetchOptions: {
      method: 'PUT',
      body: {
        telegram_username: telegramUsername,
      },
    },
  },
});
