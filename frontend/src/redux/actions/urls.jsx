import Config from '../../config';


export const LOGIN = Config.ApiBaseUrl.concat('/user/login/');
export const LOGOUT = Config.ApiBaseUrl.concat('/user/logout/');
export const REGISTER = Config.ApiBaseUrl.concat('/user/register/');
export const ACTIVATE = Config.ApiBaseUrl.concat(`/user/${Config.VerificationPath}/`);
