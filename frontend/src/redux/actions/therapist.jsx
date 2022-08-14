import * as actionTypes from '../actionTypes';
import * as URLs from './urls';
import { CALL_API } from '../middleware/api';


export const getPersonalTherapistInfo = () => ({
  [CALL_API]: {
    types: [
      actionTypes.GET_PERSONAL_THERAPIST_INFO_REQUEST,
      actionTypes.GET_PERSONAL_THERAPIST_INFO_SUCCESS,
      actionTypes.GET_PERSONAL_THERAPIST_INFO_FAILURE,
    ],
    url: URLs.PERSONAL_THERAPIST_INFO,
    fetchOptions: {
      method: 'GET',
    },
  },
});

export const updatePersonalTherapistInfo = (
  description, licenseId,
  expertise, yearsOfExperience,
  pricePerSession, dailyStartTime,
  dailyEndTime, telegramUsername
) => ({
  [CALL_API]: {
    types: [
      actionTypes.UPDATE_PERSONAL_THERAPIST_INFO_REQUEST,
      actionTypes.UPDATE_PERSONAL_THERAPIST_INFO_SUCCESS,
      actionTypes.UPDATE_PERSONAL_THERAPIST_INFO_FAILURE,
    ],
    url: URLs.PERSONAL_THERAPIST_INFO,
    fetchOptions: {
      method: 'PUT',
      body: {
        description: description,
        license_id: licenseId,
        expertise: expertise,
        years_of_experience: yearsOfExperience,
        price_per_session: pricePerSession,
        daily_start_time: dailyStartTime,
        daily_end_time: dailyEndTime,
        telegram_username: telegramUsername,
      },
    },
  },
});

export const removeDocument = (name) => ({
  [CALL_API]: {
    types: [
      actionTypes.REMOVE_THERAPIST_DOCUMENT_REQUEST,
      actionTypes.REMOVE_THERAPIST_DOCUMENT_SUCCESS,
      actionTypes.REMOVE_THERAPIST_DOCUMENT_FAILURE,
    ],
    url: `${URLs.THERAPIST_DOCUMENTS}${name}/`,
    fetchOptions: {
      method: 'DELETE',
    },
    payload: {
      name: name,
    },
  },
});

export const addDocument = (name, document) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('document', document, document.name);

  return {
    [CALL_API]: {
      types: [
        actionTypes.ADD_THERAPIST_DOCUMENT_REQUEST,
        actionTypes.ADD_THERAPIST_DOCUMENT_SUCCESS,
        actionTypes.ADD_THERAPIST_DOCUMENT_FAILURE,
      ],
      url: URLs.THERAPIST_DOCUMENTS,
      fetchOptions: {
        method: 'POST',
        body: formData,
        dontContentType: true,
        formData: true,
      },
    },
  }
};
