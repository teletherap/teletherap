import * as actionTypes from '../actionTypes';

const initState = {
  therapists: [],
};

const therapist = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.GET_THERAPISTS_SUCCESS:
      return {
        ...state,
        therapists: action.response,
      };

    default:
      return state;
  }
}

export default therapist;
