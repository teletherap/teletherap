import * as actionTypes from '../actionTypes';

const initState = {
  paymentUrl: '',
}

const finance = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.DEPOSIT_SUCCESS:
      return {
        ...state,
        paymentUrl: action.response.redirect_url,
      };

    case actionTypes.DEPOSIT_FAILURE:
      return {
        ...state,
        paymentUrl: '',
      };

    case actionTypes.REDIRECT_TO_PAYMENT_PAGE:
      window.location.assign(state.paymentUrl);
      return {
        ...state,
        paymentUrl: '',
      };

    default:
      return state;
  }
};

export default finance;
