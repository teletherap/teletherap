const IS_DEV = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const Config = {
  Title: 'Teletherap',
  ApiBaseUrl: IS_DEV ? 'https://localhost/api' : '/api',
};

export default Config;
