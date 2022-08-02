import React, { Fragment } from 'react';
import { Alert, CssBaseline, Container, AlertTitle } from '@mui/material';
import Header from './header';

const NotFound = () => {
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
