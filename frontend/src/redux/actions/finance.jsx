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

export const verifyDeposit = (username, amount, authority, status) => ({
  [CALL_API]: {
    types: [
      actionTypes.VERIFY_DEPOSIT_REQUEST,
      actionTypes.VERIFY_DEPOSIT_SUCCESS,
      actionTypes.VERIFY_DEPOSIT_FAILURE,
    ],
    url: `${URLs.VERIFY_DEPOSIT}${username}/${amount}/?Authority=${authority}&Status=${status}`,
    payload: {
      amount,
    },
    fetchOptions: {
      method: 'GET',
    },
  },
});
