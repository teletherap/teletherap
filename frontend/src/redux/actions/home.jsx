import * as actionTypes from '../actionTypes';
import * as URLs from './urls';
import { CALL_API } from '../middleware/api';

export const getTherapists = () => ({
  [CALL_API]: {
    types: [
      actionTypes.GET_THERAPISTS_REQUEST,
      actionTypes.GET_THERAPISTS_SUCCESS,
      actionTypes.GET_THERAPISTS_FAILURE,
    ],
    url: URLs.THERAPIST,
    fetchOptions: {
      method: 'GET',
    },
  },
});
