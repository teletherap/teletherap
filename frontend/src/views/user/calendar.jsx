import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Typography, Stack, Alert, List, ListItem, IconButton, ListItemAvatar, Avatar, ListItemText, Dialog, DialogTitle, DialogActions, Button, Divider, colors, Tooltip, AlertTitle, Rating, TextField } from '@mui/material';
import { getReservations, cancelReservation, attendSession, createReview, updateReview } from '../../redux/actions/therapy';
import CancelIcon from '@mui/icons-material/Cancel';
import PsychologyIcon from '@mui/icons-material/Psychology'
import PersonIcon from '@mui/icons-material/Person';
import TelegramIcon from '@mui/icons-material/Telegram';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import Config from '../../config';

const Calendar = ({ getReservations, cancelReservation, attendSession, createReview, updateReview, account }) => {
  const [incomingReservations, setIncomingReservations] = useState([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [toBeCanceled, setToBeCanceled] = useState(null);
  const [toBeSentReviews, setToBeSentReviews] = useState(account.reviews);

  useEffect(() => {
    setToBeSentReviews({...account.reservations.map(reservation => ({[reservation.id]: {
      rating: null,
      comment: '',
    }})), ...toBeSentReviews});
  }, [account.reservations]);

  useEffect(() => {
    setToBeSentReviews({...toBeSentReviews, ...account.reviews});
  }, [account.reviews]);

  useEffect(() => {
    const incoming = account.reservations
      .filter(reservation => ['resd', 'ongo', 'attd'].includes(reservation.current_state));
    incoming.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    setIncomingReservations(incoming);
  }, [account.reservations]);

  useEffect(() => {
    document.title = `Calendar | ${Config.Title}`;
  });

  useEffect(() => {
    if (account.isLoggedIn) {
      getReservations(account.isTherapist);
    }
  }, [account.isLoggedIn, account.isTherapist]);

  if (!account.isLoggedIn) {
    toast.error('You are not authorized to view this page');
    return <Navigate to="/" />;
  }

  const openCancelDialog = (reservation) => {
    setCancelDialogOpen(true);
    setToBeCanceled(reservation);
  };

  const closeCancelDialog = () => {
    setCancelDialogOpen(false);
    setToBeCanceled(null);
  };

  const doCancel = () => {
    cancelReservation(toBeCanceled.id, account.isTherapist);
    closeCancelDialog();
  };

  const attend = (reservation) => {
    attendSession(reservation.id, account.isTherapist);
  };

  const getColor = (reservation, intensity) => {
    if (reservation.current_state === 'resd')
      return colors.grey[intensity];
    if (reservation.current_state === 'ongo')
      return colors.green[intensity];
    return colors.cyan[intensity];
  };

  const getCancelTooltip = (reservation) => {
    if (reservation.current_state === 'resd')
      return 'Cancel';
    if (reservation.current_state === 'ongo')
      return 'Ongoing session, cannot cancel';
    return 'Attended session, cannot cancel';
  };

  const getAttendTooltip = (reservation) => {
    if (reservation.current_state === 'ongo')
      return 'Attend';
    if (reservation.current_state === 'attd')
      return 'Attended session, cannot attend again';
    return 'Ongoing session, cannot attend';
  }

  const getDescription = (reservation) => {
    if (reservation.current_state === 'resd')
      return '';
    if (reservation.current_state === 'ongo')
      return '(ongoing)';
    return '(attended)';
  };

  const doCreateReview = (e, reservation) => {
    e.preventDefault();

    createReview(reservation.id, toBeSentReviews[reservation.id].rating, toBeSentReviews[reservation.id].comment);
  };
  
  const doUpdateReview = (e, reservation) => {
    e.preventDefault();

    updateReview(reservation.id, toBeSentReviews[reservation.id].rating, toBeSentReviews[reservation.id].comment);
  };

  const renderReview = (reservation) => {
    if (reservation.current_state !== 'attd') {
      return null;
    }
    const review = account.reviews[reservation.id];
    const alreadyReviewed = review !== undefined;
    if (account.isTherapist) {
      if (alreadyReviewed) {
        return (
          <Stack direction="row" spacing={1} p={2}>
            <Rating name="read-only" value={review.rating} readOnly />
            <Typography variant="body2" color="text.secondary" minWidth='60%' maxWidth='60%'>
              {review.comment ? review.comment : 'No comment'}
            </Typography>
          </Stack>
        );
      }
      return (
        <Alert severity="info">
          No review
        </Alert>
      );
    }
    return (
      <form
        onSubmit={
          alreadyReviewed ?
            (e) => doUpdateReview(e, reservation) :
            (e) => doCreateReview(e, reservation)}>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            label="Comment"
            value={toBeSentReviews[reservation.id]?.comment}
            onChange={(e) => setToBeSentReviews({
              ...toBeSentReviews,
              [reservation.id]: {
                ...toBeSentReviews[reservation.id],
                comment: e.target.value,
              }
            })}
            multiline />
          <Rating
            name="rating"
            value={toBeSentReviews[reservation.id] ? toBeSentReviews[reservation.id].rating : null}
            onChange={(e) => setToBeSentReviews({
              ...toBeSentReviews,
              [reservation.id]: {
                ...toBeSentReviews[reservation.id],
                rating: e.target.value,
              }
            })} />
          <Button
            variant="contained"
            type="submit">
            {alreadyReviewed ? 'Update' : 'Comment'}
          </Button>
        </Stack>
      </form>
    );
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Calendar
      </Typography>
      {
        incomingReservations.length > 0 ?
          <List
            subheader={
              <Typography variant="h5" component="h2" gutterBottom m={2}>
                Incoming reservations
              </Typography>
            }
            className='shadow'
            sx={{ bgcolor: colors.grey[100], borderRadius: 2 }}>
            {incomingReservations.map(reservation => (
              <Fragment key={reservation.id}>
                <ListItem
                  sx={{ bgcolor: getColor(reservation, 100) }}
                  secondaryAction={
                    <Tooltip title={getCancelTooltip(reservation)}>
                      <span>
                        <IconButton
                          edge="end"
                          aria-label="cancel"
                          disabled={reservation.current_state !== 'resd'}
                          onClick={() => openCancelDialog(reservation)}>
                          <CancelIcon />
                        </IconButton>
                      </span>
                    </Tooltip>  
                  }>
                  <Tooltip title={getAttendTooltip(reservation)}>
                    <ListItemAvatar>
                      <IconButton
                        edge="start"
                        aria-label="attend"
                        color='success'
                        disabled={reservation.current_state !== 'ongo'}
                        onClick={() => attend(reservation)}>
                        <Avatar
                          sx={{ bgcolor: getColor(reservation, 600) }}>
                          {reservation.communication_type === 'video' ? <VideoCallIcon /> : <TelegramIcon />}
                        </Avatar>
                      </IconButton>
                    </ListItemAvatar>
                  </Tooltip>
                  <Stack direction='row' spacing={2}>
                    <ListItemText
                      primary={
                        account.isTherapist ?
                          <Stack direction="row" spacing={1}>
                            <PersonIcon />
                            <Typography variant="body1" component="span">
                              {reservation.client_name} {getDescription(reservation)}
                            </Typography>
                          </Stack>
                          :
                          <Stack direction="row" spacing={1}>
                            <PsychologyIcon />
                            <Typography variant="body1" component="span">
                              {reservation.therapist_name} {getDescription(reservation)}
                            </Typography>
                          </Stack>
                      }
                      secondary={`${new Date(reservation.datetime).toLocaleString()}`} />
                    {renderReview(reservation)}
                  </Stack>
                </ListItem>
                {reservation !== incomingReservations[incomingReservations.length - 1] &&
                  <Divider variant="inset" component="li" />}
              </Fragment>
            ))}
          </List>
          :
          <Alert severity='warning'>
            You have no incoming reservations.
          </Alert>
      }
      <Dialog
        open={cancelDialogOpen}
        onClose={closeCancelDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">
            Are you sure?
          </DialogTitle>
          <DialogActions>
            <Button onClick={closeCancelDialog} color="primary">No</Button>
            <Button onClick={doCancel} color="error" autoFocus>Yes</Button>
          </DialogActions>
      </Dialog>
    </Stack>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.account,
  }
};

export default connect(mapStateToProps, {
  getReservations, cancelReservation, attendSession,
  createReview, updateReview,
})(Calendar);
