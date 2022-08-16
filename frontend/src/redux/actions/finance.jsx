import * as actionTypes from '../actionTypes';
import * as URLs from './urls';
import { CALL_API } from '../middleware/api';

export const deposit = (amount) => ({
  [CALL_API]: {
    types: [
      actionTypes.DEPOSIT_REQUEST,
      actionTypes.DEPOSIT_SUCCESS,
      actionTypes.DEPOSIT_FAILURE,
    ],
    url: URLs.DEPOSIT,
    fetchOptions: {
      method: 'POST',
      body: {
        amount,
        callback: `${window.location.origin}/user/deposit/verify/:username/:amount/`,
      },
    },
    afterSuccess: redirectToPaymentPage(),
  },
});

export const redirectToPaymentPage = () => ({
  type: actionTypes.REDIRECT_TO_PAYMENT_PAGE,
});
