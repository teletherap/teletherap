import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Typography, Stack, Alert, List, ListItem, IconButton, ListItemAvatar, Avatar, ListItemText, Dialog, DialogTitle, DialogActions, Button, Divider } from '@mui/material';
import { getReservations, cancelReservation } from '../../redux/actions/therapy';
import CancelIcon from '@mui/icons-material/Cancel';
import PsychologyIcon from '@mui/icons-material/Psychology'
import PersonIcon from '@mui/icons-material/Person';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import Config from '../../config';

const Calendar = ({ getReservations, cancelReservation, account }) => {
  const [incomingReservations, setIncomingReservations] = useState([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [toBeCanceled, setToBeCanceled] = useState(null);

  useEffect(() => {
    const incoming = account.reservations
      .filter(reservation => reservation.state === 'resd');
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
  };

  const isOngoing = (reservation) => {
    const now = new Date();
    const start = new Date(reservation.datetime);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    return start <= now && now <= end;
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Calendar
      </Typography>
      {
        incomingReservations.length > 0 ?
          <List sx={{ bgcolor: '#f5f5f5' }}>
            {incomingReservations.map(reservation => (
              <Fragment key={reservation.id}>
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="cancel"
                      disabled={isOngoing(reservation)}
                      onClick={() => openCancelDialog(reservation)}>
                      <CancelIcon />
                    </IconButton>
                  }>
                  <IconButton
                    edge="start"
                    aria-label="attend"
                    color='success'
                    disabled={!isOngoing(reservation)}
                    onClick={() => attend(reservation)}>                  
                    <ListItemAvatar>
                      <Avatar
                      sx={{ bgcolor: isOngoing(reservation) ? 'success.main' : 'grey.500' }}>
                        <FileOpenIcon />
                      </Avatar>
                    </ListItemAvatar>
                  </IconButton>
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
  getReservations, cancelReservation,
})(Calendar);
