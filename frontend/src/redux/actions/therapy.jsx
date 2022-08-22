import * as actionTypes from '../actionTypes';
import * as URLs from './urls';
import { CALL_API } from '../middleware/api';
import { getUserInfo } from './account';

export const getReservations = (is_therapist) => ({
  [CALL_API]: {
    types: [
      actionTypes.GET_RESERVATIONS_REQUEST,
      actionTypes.GET_RESERVATIONS_SUCCESS,
      actionTypes.GET_RESERVATIONS_FAILURE,
    ],
    url: (is_therapist ? URLs.THERAPIST_RESERVATIONS : URLs.CLIENT_RESERVATIONS),
    fetchOptions: {
      method: 'GET',
    },
  },
});

export const cancelReservation = (id, is_therapist) => ({
  [CALL_API]: {
    types: [
      actionTypes.CANCEL_RESERVATION_REQUEST,
      actionTypes.CANCEL_RESERVATION_SUCCESS,
      actionTypes.CANCEL_RESERVATION_FAILURE,
    ],
    url: `${(is_therapist ? URLs.THERAPIST_RESERVATIONS : URLs.CLIENT_RESERVATIONS)}${id}/`,
    payload: {
      id,
    },
    fetchOptions: {
      method: 'DELETE',
    },
    afterSuccess: getUserInfo(),
  },
});

export const attendSession = (id, is_therapist) => ({
  [CALL_API]: {
    types: [
      actionTypes.ATTEND_SESSION_REQUEST,
      actionTypes.ATTEND_SESSION_SUCCESS,
      actionTypes.ATTEND_SESSION_FAILURE,
    ],
    url: `${(is_therapist ? URLs.THERAPIST_RESERVATIONS : URLs.CLIENT_RESERVATIONS)}${id}/attend/`,
    fetchOptions: {
      method: 'GET',
    },
  },
});
