const checkErrorsStatusCode = (response, json_response) => {
  if (response.status === 500) {
    throw new Error('Internal Server Error! Contact Us!');
  }
  if (response.status === 404) {
    throw new Error('Not Found!');
  }
  if (response.status === 401) {
    throw new Error('TOKEN EXPIRED');
  }

  if (response.status === 403) {
    throw new Error('You don\'t have access!');
  }
};

const fetchApi = async (url, fetchOptions) => {
  const response = await fetch(url, fetchOptions);
  const json_response = await response.json();
  checkErrorsStatusCode(response, json_response);
  if (!response.ok) {
    throw new Error(json_response.message || JSON.stringify(json_response));
  }
  return json_response;
};

export default fetchApi;
