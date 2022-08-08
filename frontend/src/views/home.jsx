import React, { Fragment, useEffect } from 'react';
import { CssBaseline, Typography, Container } from '@mui/material';
import Header from './header';
import Config from '../config';

const Home = () => {
  useEffect(() => {
    document.title = `${Config.Title} | Home`;
  })

  return (
    <Fragment>
      <Header />
      <CssBaseline />
      <Container maxWidth="lg" className="bg-white shadow" style={{ padding: 25 }}>
        <Typography variant='h2' gutterBottom>
          Home page
        </Typography>
      </Container>
    </Fragment>
  )
}

export default Home;
