import Config from '../../config';

export const GET_USER_INFO = Config.ApiBaseUrl.concat('/user/');
export const LOGIN = Config.ApiBaseUrl.concat('/user/login/');
export const REFRESH = Config.ApiBaseUrl.concat('/user/login/refresh/');
export const LOGOUT = Config.ApiBaseUrl.concat('/user/logout/');
export const REGISTER = Config.ApiBaseUrl.concat('/user/register/');
export const ACTIVATE = Config.ApiBaseUrl.concat(`/user/${Config.VerificationPath}/`);
export const PERSONAL_THERAPIST_INFO = Config.ApiBaseUrl.concat('/user/therapist/');
export const THERAPIST_DOCUMENTS = Config.ApiBaseUrl.concat('/user/therapist/documents/');
