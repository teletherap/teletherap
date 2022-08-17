import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { CssBaseline, Typography, Container, Box, Card, CardContent, CardActions, Button, Divider, Rating } from '@mui/material';
import styled from '@emotion/styled';
import Grid2 from '@mui/material/Unstable_Grid2';
import PaymentIcon from '@mui/icons-material/Payment';
import PsychologyIcon from '@mui/icons-material/Psychology';
import DescriptionIcon from '@mui/icons-material/Description';
import Header from './header';
import Config from '../config';
import { getTherapists } from '../redux/actions/home';

const FullHeightCard = styled(Card)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
})

const Home = ({ getTherapists, therapists }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `${Config.Title} | Home`;
  });

  useEffect(() => {
    getTherapists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  } , []);

  const viewTherapist = (therapist) => {
    navigate(`/therapist/${therapist.user}/`);
  }

  return (
    <Fragment>
      <Header />
      <CssBaseline />
      <Container maxWidth="lg" className="bg-white shadow" style={{ padding: 25 }}>
        <Typography variant='h4' gutterBottom>
          Therapists
        </Typography>
        <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} mt={2}>
          {therapists.map(therapist => (
            <Grid2 xs={2} sm={4} md={4} key={therapist.id} component={Box}>
              <FullHeightCard variant="outlined" className="shadow">
                <CardContent>
                  <Grid2 container>
                    <Grid2 container item>
                      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        <PsychologyIcon fontSize='small' />
                        {' '}
                        {therapist.expertise}
                      </Typography>
                    </Grid2>
                    <Grid2 container item ml='auto'>
                      <Rating name="read-only" value={therapist.average_rating} readOnly />
                    </Grid2>
                  </Grid2>
                  <Typography variant="h5" component="div">
                    {`${therapist.first_name} ${therapist.last_name}`}
                  </Typography>
                  <Divider />
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    <PaymentIcon fontSize="small" />
                    {' '}
                    {`${therapist.price_per_session} IRT per session`}
                  </Typography>
                  <Typography variant="body2" component="p">
                    <DescriptionIcon fontSize="small" />
                    {' '}
                    {therapist.description.length > 100 ? therapist.description.substring(0, 100) + '...' : therapist.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" onClick={() => viewTherapist(therapist)}>
                    View and Reserve
                  </Button>
                </CardActions>
              </FullHeightCard>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Fragment>
  )
};

const mapStateToProps = (state, ownProps) => {
  return {
    therapists: state.home.therapists,
  }
};

export default connect(mapStateToProps, {
  getTherapists,
})(Home);
