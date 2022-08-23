import * as actionTypes from '../actionTypes';

const initState = {
  user: -1,
  description: '',
  licenseId: '',
  expertise: '',
  yearsOfExperience: '',
  pricePerSession: '',
  dailyStartTime: new Date(),
  dailyEndTime: new Date(),
  upcomingReservations: [],
  firstName: '',
  lastName: '',
  averageRating: null,
  attendedSessionsCount: 0,
  reviews: [],
};

const therapist = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.GET_THERAPIST_SUCCESS:
      const [startHour, startMinute, startSecond] = action.response.daily_start_time.split(':').map(Number);
      const startTime = new Date(new Date().setHours(startHour, startMinute, startSecond));

      const [endHour, endMinute, endSecond] = action.response.daily_end_time.split(':').map(Number);
      const endTime = new Date(new Date().setHours(endHour, endMinute, endSecond));

      return {
        ...state,
        user: action.response.user,
        description: action.response.description,
        licenseId: action.response.license_id,
        expertise: action.response.expertise,
        yearsOfExperience: action.response.years_of_experience,
        pricePerSession: action.response.price_per_session,
        dailyStartTime: startTime,
        dailyEndTime: endTime,
        upcomingReservations: action.response.upcoming_reservations,
        firstName: action.response.first_name,
        lastName: action.response.last_name,
        averageRating: action.response.average_rating,
        attendedSessionsCount: action.response.attended_sessions_count,
        reviews: action.response.reviews,
      };

    case actionTypes.RESERVE_SUCCESS:
      return {
        ...state,
        upcomingReservations: [...state.upcomingReservations, action.response],
      };
      
    default:
      return state;
  }
}

export default therapist;
