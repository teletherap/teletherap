import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Typography, Stack, Alert, List, ListItem, IconButton, ListItemAvatar, Avatar, ListItemText, Dialog, DialogTitle, DialogActions, Button, Divider, colors, Tooltip } from '@mui/material';
import { getReservations, cancelReservation, attendSession } from '../../redux/actions/therapy';
import CancelIcon from '@mui/icons-material/Cancel';
import PsychologyIcon from '@mui/icons-material/Psychology'
import PersonIcon from '@mui/icons-material/Person';
import TelegramIcon from '@mui/icons-material/Telegram';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import Config from '../../config';

const Calendar = ({ getReservations, cancelReservation, attendSession, account }) => {
  const [incomingReservations, setIncomingReservations] = useState([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [toBeCanceled, setToBeCanceled] = useState(null);
  [1, 2].includes()
  useEffect(() => {
    const incoming = account.reservations
      .filter(reservation => ['resd', 'ongo'].includes(reservation.current_state));
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

  const isOngoing = (reservation) => reservation.current_state === 'ongo';

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
                  sx={{ bgcolor: isOngoing(reservation) ? colors.green[100] : colors.grey[100] }}
                  secondaryAction={
                    <Tooltip title={isOngoing(reservation) ? 'Ongoing' : 'Cancel'}>
                      <span>
                        <IconButton
                          edge="end"
                          aria-label="cancel"
                          disabled={isOngoing(reservation)}
                          onClick={() => openCancelDialog(reservation)}>
                          <CancelIcon />
                        </IconButton>
                      </span>
                    </Tooltip>  
                  }>
                  <Tooltip title={isOngoing(reservation) ? 'Attend' : 'Not started yet'}>
                    <ListItemAvatar>
                      <IconButton
                        edge="start"
                        aria-label="attend"
                        color='success'
                        disabled={!isOngoing(reservation)}
                        onClick={() => attend(reservation)}>                  
                        <Avatar
                          sx={{ bgcolor: isOngoing(reservation) ? colors.green[600] : colors.grey[600] }}>
                          {reservation.communication_type === 'video' ? <VideoCallIcon /> : <TelegramIcon />}
                        </Avatar>
                      </IconButton>
                    </ListItemAvatar>
                  </Tooltip>
                  <ListItemText
                    primary={
                      account.isTherapist ?
                        <Stack direction="row" spacing={1}>
                          <PersonIcon />
                          <Typography variant="body1" component="span">
                            {reservation.client_name} {isOngoing(reservation) ? '(ongoing)' : ''}
                          </Typography>
                        </Stack>
                        :
                        <Stack direction="row" spacing={1}>
                          <PsychologyIcon />
                          <Typography variant="body1" component="span">
                            {reservation.therapist_name} {isOngoing(reservation) ? '(ongoing)' : ''}
                          </Typography>
                        </Stack>
                    }
                    secondary={`${new Date(reservation.datetime).toLocaleString()}`} />
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
})(Calendar);
