import * as actionTypes from '../actionTypes';
import * as URLs from './urls';
import { CALL_API } from '../middleware/api';
import { getUserInfo } from './account';

export const getReservations = (isTherapist) => ({
  [CALL_API]: {
    types: [
      actionTypes.GET_RESERVATIONS_REQUEST,
      actionTypes.GET_RESERVATIONS_SUCCESS,
      actionTypes.GET_RESERVATIONS_FAILURE,
    ],
    url: (isTherapist ? URLs.THERAPIST_RESERVATIONS : URLs.CLIENT_RESERVATIONS),
    fetchOptions: {
      method: 'GET',
    },
    afterSuccess: getReviews(isTherapist),
  },
});

export const getReviews = (isTherapist) => ({
  [CALL_API]: {
    types: [
      actionTypes.GET_REVIEWS_REQUEST,
      actionTypes.GET_REVIEWS_SUCCESS,
      actionTypes.GET_REVIEWS_FAILURE,
    ],
    url: (isTherapist ? URLs.THERAPIST_REVIEWS : URLs.CLIENT_REVIEWS),
    fetchOptions: {
      method: 'GET',
    },
  },
});

export const createReview = (reservationId, rating, comment) => ({
  [CALL_API]: {
    types: [
      actionTypes.CREATE_REVIEW_REQUEST,
      actionTypes.CREATE_REVIEW_SUCCESS,
      actionTypes.CREATE_REVIEW_FAILURE,
    ],
    url: URLs.CLIENT_REVIEWS,
    fetchOptions: {
      method: 'POST',
      body: {
        reservation: reservationId,
        rating,
        comment,
      },
    },
  },
});

export const updateReview = (reservationId, rating, comment) => ({
  [CALL_API]: {
    types: [
      actionTypes.UPDATE_REVIEW_REQUEST,
      actionTypes.UPDATE_REVIEW_SUCCESS,
      actionTypes.UPDATE_REVIEW_FAILURE,
    ],
    url: `${URLs.CLIENT_REVIEWS}${reservationId}/`,
    fetchOptions: {
      method: 'PATCH',
      body: {
        rating,
        comment,
      },
    },
  },
});

export const cancelReservation = (id, isTherapist) => ({
  [CALL_API]: {
    types: [
      actionTypes.CANCEL_RESERVATION_REQUEST,
      actionTypes.CANCEL_RESERVATION_SUCCESS,
      actionTypes.CANCEL_RESERVATION_FAILURE,
    ],
    url: `${(isTherapist ? URLs.THERAPIST_RESERVATIONS : URLs.CLIENT_RESERVATIONS)}${id}/`,
    payload: {
      id,
    },
    fetchOptions: {
      method: 'DELETE',
    },
    afterSuccess: getUserInfo(),
  },
});

export const attendSession = (id, isTherapist) => ({
  [CALL_API]: {
    types: [
      actionTypes.ATTEND_SESSION_REQUEST,
      actionTypes.ATTEND_SESSION_SUCCESS,
      actionTypes.ATTEND_SESSION_FAILURE,
    ],
    url: `${(isTherapist ? URLs.THERAPIST_RESERVATIONS : URLs.CLIENT_RESERVATIONS)}${id}/attend/`,
    fetchOptions: {
      method: 'GET',
    },
  },
});
