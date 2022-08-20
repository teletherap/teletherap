import React, { useEffect } from 'react';
import { Alert, AlertTitle } from '@mui/material';
import Config from '../config';

const NotFound = () => {
  useEffect(() => {
    document.title = `Not Found! | ${Config.Title}`;
  })

  return (
    <Alert severity="error">
      <AlertTitle>Page not found!</AlertTitle>
      <code>
        {window.location.pathname}
      </code>
    </Alert>
  );
};

export default NotFound;
