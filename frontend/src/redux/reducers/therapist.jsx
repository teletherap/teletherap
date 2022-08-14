import * as actionTypes from '../actionTypes';

const initState = {
    isFetching: false,
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

const therapist = (state = initState, action) => {
  switch (action.type) {
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

      console.log(`is approved: ${action.response.is_approved}`);

      return {
        ...state,
        isFetching: false,
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
      };

    case actionTypes.GET_PERSONAL_THERAPIST_INFO_FAILURE:
      return {
        ...state,
        isApproved: false,
        isFetching: false,
      };

    case actionTypes.UPDATE_PERSONAL_THERAPIST_INFO_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    default:
      return state;
  }
};

export default therapist;
