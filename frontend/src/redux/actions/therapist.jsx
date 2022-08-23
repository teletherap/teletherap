import * as actionTypes from '../actionTypes';
import * as URLs from './urls';
import { CALL_API } from '../middleware/api';
import { getUserInfo } from './account';

export const getTherapist = (id) => ({
  [CALL_API]: {
    types: [
      actionTypes.GET_THERAPIST_REQUEST,
      actionTypes.GET_THERAPIST_SUCCESS,
      actionTypes.GET_THERAPIST_FAILURE,
    ],
    url: `${URLs.THERAPIST}${id}/`,
    fetchOptions: {
      method: 'GET',
    },
  },
});

export const reserve = (therapistId, datetime, communicationType) => ({
  [CALL_API]: {
    types: [
      actionTypes.RESERVE_REQUEST,
      actionTypes.RESERVE_SUCCESS,
      actionTypes.RESERVE_FAILURE,
    ],
    url: URLs.CLIENT_RESERVATIONS,
    fetchOptions: {
      method: 'POST',
      body: {
        therapist: therapistId,
        datetime,
        communication_type: communicationType,
      },
    },
    afterSuccess: getUserInfo(),
  },
});
