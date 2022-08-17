import * as actionTypes from '../actionTypes';

const initState = {
  isFetching: false,
  isLoggedIn: false,
  token: '',
  refreshToken: '',
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  isTherapist: false,
  walletBalance: 0,
  therapist: {
    description: '',
    licenseId: '',
    expertise: '',
    yearsOfExperience: '',
    pricePerSession: '',
    dailyStartTime: new Date(),
    dailyEndTime: new Date(),
    telegramUsername: '',
    isApproved: false,
    documents: [],
  }
};

const account = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_REQUEST:
      return {
        ...state,
        isLoggedIn: false,
        isFetching: true,
      };

    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isLoggedIn: true,
        token: action.response.access,
        refreshToken: action.response.refresh,
      };

    case actionTypes.REFRESH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isLoggedIn: true,
        token: action.response.access,
      };

    case actionTypes.LOGIN_FAILURE:
    case actionTypes.REGISTER_SUCCESS:
    case actionTypes.REGISTER_FAILURE:
    case actionTypes.ACTIVATION_SUCCESS:
    case actionTypes.ACTIVATION_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        isFetching: false,
      };

    case actionTypes.LOGOUT:
      return initState;

    case actionTypes.REGISTER_REQUEST:
    case actionTypes.ACTIVATION_REQUEST:
      return {
        ...state,
        isFetching: true,
        isLoggedIn: false,
      };

    case actionTypes.GET_USER_INFO_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case actionTypes.GET_USER_INFO_SUCCESS:
      return {
        ...state,
        isFetching: false,
        username: action.response.username,
        firstName: action.response.first_name,
        lastName: action.response.last_name,
        email: action.response.email,
        isTherapist: action.response.is_therapist,
        walletBalance: action.response.wallet_balance,
      };

    case actionTypes.GET_USER_INFO_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    case actionTypes.VERIFY_DEPOSIT_SUCCESS:
      return {
        ...state,
        walletBalance: state.walletBalance + action.payload.amount,
      };

    case actionTypes.WITHDRAW_SUCCESS:
      return {
        ...state,
        walletBalance: state.walletBalance - action.payload.amount,
      };

    case actionTypes.GET_PERSONAL_THERAPIST_INFO_REQUEST:
    case actionTypes.UPDATE_PERSONAL_THERAPIST_INFO_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case actionTypes.GET_PERSONAL_THERAPIST_INFO_SUCCESS:
    case actionTypes.UPDATE_PERSONAL_THERAPIST_INFO_SUCCESS:
      const [startHour, startMinute, startSecond] = action.response.daily_start_time.split(':').map(Number);
      const startTime = new Date(new Date().setHours(startHour, startMinute, startSecond));

      const [endHour, endMinute, endSecond] = action.response.daily_end_time.split(':').map(Number);
      const endTime = new Date(new Date().setHours(endHour, endMinute, endSecond));

      return {
        ...state,
        isFetching: false,
        therapist: {
          ...state.therapist,
          description: action.response.description,
          licenseId: action.response.license_id,
          expertise: action.response.expertise,
          yearsOfExperience: action.response.years_of_experience,
          pricePerSession: action.response.price_per_session,
          dailyStartTime: startTime,
          dailyEndTime: endTime,
          telegramUsername: action.response.telegram_username,
          isApproved: action.response.is_approved,
          documents: action.response.documents,
        },
      };

    case actionTypes.GET_PERSONAL_THERAPIST_INFO_FAILURE:
      return {
        ...state,
        isFetching: false,
        therapist: initState.therapist,
      };

    case actionTypes.UPDATE_PERSONAL_THERAPIST_INFO_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    case actionTypes.REMOVE_THERAPIST_DOCUMENT_SUCCESS:
      return {
        ...state,
        therapist: {
          ...state.therapist,
          documents: state.documents
            .filter(document => document.name !== action.payload.name),
        },
      };
    
    case actionTypes.ADD_THERAPIST_DOCUMENT_SUCCESS:
      return {
        ...state,
        therapist: {
          ...state.therapist,
          documents: [...state.documents, action.response],
        },
      };

      default:
      return state;
  }
}

export default account;
