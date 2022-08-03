import React, { Fragment, useEffect } from 'react';
import { Alert, CssBaseline, Container, AlertTitle } from '@mui/material';
import Header from './header';
import Config from '../config';

const NotFound = () => {
  useEffect(() => {
    document.title = `${Config.Title} | Not Found!`;
  })

  return (
    <Fragment>
      <Header />
      <CssBaseline />
      <Container maxWidth="lg" className="bg-white shadow" style={{ padding: 25 }}>
        <Alert severity="error">
          <AlertTitle>Page not found!</AlertTitle>
          <code>
            {window.location.pathname}
          </code>
        </Alert>
      </Container>
    </Fragment>
  )
}

export default NotFound;
