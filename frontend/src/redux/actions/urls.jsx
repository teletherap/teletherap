import Config from '../../config';

export const GET_USER_INFO = Config.ApiBaseUrl.concat('/user/');
export const LOGIN = Config.ApiBaseUrl.concat('/user/login/');
export const LOGOUT = Config.ApiBaseUrl.concat('/user/logout/');
export const REGISTER = Config.ApiBaseUrl.concat('/user/register/');
export const ACTIVATE = Config.ApiBaseUrl.concat(`/user/${Config.VerificationPath}/`);
export const PERSONAL_THERAPIST_INFO = Config.ApiBaseUrl.concat('/user/therapist/');
