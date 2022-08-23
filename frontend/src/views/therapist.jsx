import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from "react-router-dom";
import { Typography, Box, Card, CardContent, Button, Divider, Rating, Stack, List, ListItem, ListItemAvatar, ListItemText, Avatar, ListSubheader, TextField} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Grid2 from '@mui/material/Unstable_Grid2';
import PaymentIcon from '@mui/icons-material/Payment';
import PsychologyIcon from '@mui/icons-material/Psychology';
import DescriptionIcon from '@mui/icons-material/Description';
import ScheduleIcon from '@mui/icons-material/Schedule';
import BarChartIcon from '@mui/icons-material/BarChart';
import CommentIcon from '@mui/icons-material/Comment';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import TelegramIcon from '@mui/icons-material/Telegram';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import Config from '../config';
import { getTherapist, reserve } from '../redux/actions/therapist';
import { Person } from '@mui/icons-material';

const Therapist = ({ getTherapist, reserve, therapist, account }) => {
  const { id } = useParams();
  const [ sortedReviews, setSortedReviews ] = useState([]);
  const [ reservationDate, setReservationDate ] = useState(new Date());
  const [ availableSessions, setAvailableSessions ] = useState([]);

  useEffect(() => {
    document.title = `${therapist.firstName} ${therapist.lastName} | ${Config.Title}`;
  });

  useEffect(() => {
    getTherapist(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSortedReviews(therapist.reviews.sort((a, b) => b.createdAt - a.createdAt));
  }, [therapist.reviews]);

  useEffect(() => {
    if (reservationDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
      setAvailableSessions([]);
      return;
    }

    const availableList = [];
    const dailyStartTime = new Date(therapist.dailyStartTime);
    const dailyEndTime = new Date(therapist.dailyEndTime);
    const dayStartTime = new Date(reservationDate.setHours(dailyStartTime.getHours(), dailyStartTime.getMinutes(), dailyStartTime.getSeconds()));
    const dayEndTime = new Date(reservationDate.setHours(dailyEndTime.getHours(), dailyEndTime.getMinutes(), dailyEndTime.getSeconds()));
    let startTime = new Date(dayStartTime);
    let endTime = new Date(new Date(startTime).setHours(startTime.getHours() + 1));


    while (endTime <= dayEndTime) {
      let available = true;
      for (let i = 0; i < therapist.upcomingReservations.length; i++) {
        const reservation = therapist.upcomingReservations[i];
        const reservationStartTime = new Date(reservation.datetime);
        const reservationEndTime = new Date(new Date(reservationStartTime).setHours(reservationStartTime.getHours() + 1));
        if ((startTime >= reservationStartTime && startTime < reservationEndTime) || (endTime > reservationStartTime && endTime <= reservationEndTime)) {
          available = false;
          break;
        }
      }
      if (available) {
        availableList.push(startTime);
      }
      startTime = endTime;
      endTime = new Date(new Date(startTime).setHours(startTime.getHours() + 1));
    }
  
    setAvailableSessions(availableList);
  }, [reservationDate, therapist.upcomingReservations]);

  const getTime = (date) => {
    date = new Date(date);
    return [date.getHours(), date.getMinutes()].map(x => x < 10 ? '0' + x : x).join(':');
  };

  return (
    <Fragment>
      <Card variant="outlined" className="shadow">
        <CardContent>
          <Grid2 container>
            <Grid2>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                <PsychologyIcon fontSize='small' />
                {' '}
                {therapist.expertise}
              </Typography>
            </Grid2>
            <Grid2 ml='auto'>
              <Rating name="read-only" value={therapist.averageRating} readOnly />
            </Grid2>
          </Grid2>
          <Typography variant="h5" component="div">
            {`${therapist.firstName} ${therapist.lastName}`}
          </Typography>
          <Divider />
          <Grid2 container spacing={2}>
            <Grid2>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                <PaymentIcon fontSize="small" />
                {' '}
                {`${therapist.pricePerSession} IRT per session`}
              </Typography>
            </Grid2>
            <Grid2>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                <ScheduleIcon fontSize="small" />
                {' '}
                {`${getTime(therapist.dailyStartTime)} to ${getTime(therapist.dailyEndTime)}`}
              </Typography>
            </Grid2>
            <Grid2>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                <BarChartIcon fontSize="small" />
                {' '}
                {`${therapist.attendedSessionsCount} attended sessions`}
              </Typography>
            </Grid2>
            <Grid2>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                <CommentIcon fontSize='small' />
                {' '}
                {`${therapist.reviews.length} reviews`}
              </Typography>
            </Grid2>
          </Grid2>
          <Typography variant="body2" component="p">
            <DescriptionIcon fontSize="small" />
            {' '}
            {therapist.description}
          </Typography>
        </CardContent>
      </Card>
      <List
        subheader={
          <ListSubheader component="div">
            <Typography variant="h6" component="div" p={1} mt={3}>
              <CommentIcon fontSize="small" />
              {' '}
              Reviews
            </Typography>
          </ListSubheader>
        }
        className="shadow"
        sx={{ borderRadius: 2 }}>
        {sortedReviews.map(review => (
          <Fragment key={review.id}>
            <ListItem
              secondaryAction={
                <Rating name="read-only" value={review.rating} readOnly />
              }>
              <ListItemAvatar>
                <Avatar>
                  <Person />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={review.comment ? review.comment : 'No comment'}
                secondary={`${review.client_name}, ${new Date(review.created_at).toLocaleString()}`} />
            </ListItem>
            {review !== therapist.reviews[therapist.reviews.length - 1] &&
              <Divider variant="inset" component="li" />}
          </Fragment>
        ))}
      </List>
      {account.isTherapist ||
        <List
          subheader={
            <ListSubheader component="div">
              <Stack direction='row' spacing={2} mt={3} p={2}>
                <Typography variant="h6" component="div">
                  <BookOnlineIcon fontSize="small" />
                  {' '}
                  Reservation
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label="Choose date"
                    inputFormat='yyyy-MM-dd'
                    value={reservationDate}
                    onChange={setReservationDate}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Stack>
            </ListSubheader>
          }
          className="shadow"
          sx={{ borderRadius: 2 }}>
          {availableSessions.map(datetime => (
            <Fragment key={datetime}>
              <ListItem>
                <ListItemAvatar>
                    <Typography variant="h6" component="div">
                      {getTime(datetime)}
                    </Typography>
                </ListItemAvatar>
                <ListItemText primary={
                  <Stack direction='row' spacing={2}>
                    <Box minWidth={10} />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => reserve(id, datetime, 'tlgrm')}>
                      <TelegramIcon fontSize="small" />
                      Telegram session
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => reserve(id, datetime, 'video')}>
                      <VideoCallIcon fontSize="small" />
                      Video session
                    </Button>
                  </Stack>
                } />
              </ListItem>
              {datetime !== availableSessions[availableSessions.length - 1] &&
                <Divider variant="inset" component="li" />}
            </Fragment>
          ))}
        </List>}
    </Fragment>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.account,
    therapist: state.therapist,
  }
};

export default connect(mapStateToProps, {
  getTherapist, reserve,
})(Therapist);
