import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Alert, AlertTitle, CssBaseline, Container, Typography, TextField, Button, Stack, List, ListItem, ListSubheader, ListItemAvatar, Avatar, ListItemText, IconButton, Dialog, DialogTitle, DialogActions } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import DeleteIcon from '@mui/icons-material/Delete';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getPersonalTherapistInfo, updatePersonalTherapistInfo, removeDocument, addDocument } from '../../redux/actions/therapist';
import Header from '../header';
 
const UpdateTherapist = ({ getPersonalTherapistInfo, updatePersonalTherapistInfo, removeDocument, addDocument, therapist, account }) => {
  const [description, setDescription] = useState(therapist.description);
  const [licenseId, setLicenseId] = useState(therapist.licenseId);
  const [expertise, setExpertise] = useState(therapist.expertise);
  const [yearsOfExperience, setYearsOfExperience] = useState(therapist.yearsOfExperience);
  const [pricePerSession, setPricePerSession] = useState(therapist.pricePerSession);
  const [dailyStartTime, setDailyStartTime] = useState(new Date(therapist.dailyStartTime));
  const [dailyEndTime, setDailyEndTime] = useState(new Date(therapist.dailyEndTime));
  const [telegramUsername, setTelegramUsername] = useState(therapist.telegramUsername);
  const [documents, setDocuments] = useState(therapist.documents);
  const [toBeRemoved, setToBeRemoved] = useState(null);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [document, setDocument] = useState(null);

  const openRemoveDialog = (documentName) => {
    setRemoveDialogOpen(true);
    setToBeRemoved(documentName);
  }

  const closeRemoveDialog = () => {
    setRemoveDialogOpen(false);
    setToBeRemoved(null);
  }

  useEffect(() => {
    getPersonalTherapistInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setDescription(therapist.description);
    setLicenseId(therapist.licenseId);
    setExpertise(therapist.expertise);
    setYearsOfExperience(therapist.yearsOfExperience);
    setPricePerSession(therapist.pricePerSession);
    setDailyStartTime(new Date(therapist.dailyStartTime));
    setDailyEndTime(new Date(therapist.dailyEndTime));
    setTelegramUsername(therapist.telegramUsername);
    setDocuments(therapist.documents);
  } , [therapist]);

  useEffect(() => {
    setDocuments(therapist.documents);
  } ,[therapist.documents]);

  const doUpdate = (e) => {
    e.preventDefault();

    if (!description || !licenseId || !expertise || !yearsOfExperience || !pricePerSession || !dailyStartTime || !dailyEndTime || !telegramUsername) {
      toast.error('Please fill all fields');
      return;
    }

    updatePersonalTherapistInfo(
      description, licenseId,
      expertise, yearsOfExperience,
      pricePerSession,
      [dailyStartTime.getHours(), dailyStartTime.getMinutes(), dailyStartTime.getSeconds()].join(':'),
      [dailyEndTime.getHours(), dailyEndTime.getMinutes(), dailyEndTime.getSeconds()].join(':'),
      telegramUsername);
  };

  const doRemoveDocument = () => {
    removeDocument(toBeRemoved);
    closeRemoveDialog();
  };

  const doAddDocument = (e) => {
    e.preventDefault();

    if (!documentName || !document) {
      toast.error('Please fill all fields');
      return;
    }

    addDocument(documentName, document);
    setDocumentName('');
    setDocument(null);
  };

  if (!account.isLoggedIn || !account.isTherapist) {
    toast.error('You are not authorized to view this page');
    return <Navigate to="/" />;
  }

  return (
    <Fragment>
      <Header />
      <CssBaseline />
      <Container maxWidth="lg" className="bg-white shadow" style={{ padding: 25 }}>
        <Stack spacing={3}>
          {therapist.isApproved ? (
            null
          ) : (
            <Alert severity="warning">
              <AlertTitle>Your account is not approved yet!</AlertTitle>
              Please complete your profile and wait for approval.
            </Alert>
          )}
          <Typography variant="h4" component="h1" gutterBottom>
            Professional Information
          </Typography>
          <form onSubmit={doUpdate}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
                <TextField
                  label="Description"
                  value={description}
                  multiline
                  rows={7}
                  onChange={e => setDescription(e.target.value)} />
                <Stack direction="row" spacing={3}>
                  <TextField
                    label="License ID"
                    value={licenseId}
                    onChange={e => setLicenseId(e.target.value)} />
                  <TextField
                    label="Expertise"
                    value={expertise}
                    onChange={e => setExpertise(e.target.value)} />
                  <TextField
                    label="Years of experience"
                    type="number"
                    value={yearsOfExperience}
                    onChange={e => setYearsOfExperience(e.target.value)} />
                </Stack>
                <Stack direction="row" spacing={3}>
                  <TextField
                    label="Price per session"
                    type="number"
                    value={pricePerSession}
                    onChange={e => setPricePerSession(e.target.value)} />
                  <TimePicker
                    label="Daily start time"
                    value={dailyStartTime}
                    ampm={false}
                    onChange={e => setDailyStartTime(e)}
                    renderInput={(params) => <TextField {...params} />} />
                  <TimePicker
                    label="Daily end time"
                    value={dailyEndTime}
                    ampm={false}
                    onChange={e => setDailyEndTime(e)}
                    renderInput={(params) => <TextField {...params} />} />
                  <TextField
                    label="Telegram username"
                    value={telegramUsername}
                    onChange={e => setTelegramUsername(e.target.value)} />
                </Stack>
                <Button type="submit" variant="contained" color="primary" disabled={therapist.isFetching}>
                  Update
                </Button>
              </Stack>
            </LocalizationProvider>
          </form>
          <Typography variant="h4" component="h1" gutterBottom>
            Documents
          </Typography>
          <List
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                <form onSubmit={doAddDocument}>
                  <Stack direction="row" spacing={3}>
                    <TextField
                      label="Document name"
                      value={documentName}
                      onChange={e => setDocumentName(e.target.value)} />
                    <IconButton color="primary" aria-label="upload-document" component="label">
                      <input
                        hidden
                        type="file"
                        onChange={e => setDocument(e.target.files[0])} />
                      {document ? (<CloudDoneIcon />) : (<CloudUploadIcon />)}
                    </IconButton>
                    <Button type="submit" variant="contained" color="primary" disabled={therapist.isFetching}>
                      Add
                    </Button>
                  </Stack>
                </form>
              </ListSubheader>
            }>
            {documents.map(doc => (
              <ListItem
                key={doc.name}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => openRemoveDialog(doc.name)}>
                    <DeleteIcon />
                  </IconButton>
                }
                button>
                <a
                  href={doc.document}
                  target='_blank'
                  rel="noreferrer">
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                </a>
                <ListItemText
                  primary={doc.name}
                  secondary={doc.document} />
              </ListItem>
            ))}
          </List>
          <Dialog
            open={removeDialogOpen}
            onClose={closeRemoveDialog}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'>
            <DialogTitle id='alert-dialog-title'>
              {`Are you sure you want to delete ${toBeRemoved}?`}
            </DialogTitle>
            <DialogActions>
              <Button onClick={closeRemoveDialog} color='primary'>Cancel</Button>
              <Button onClick={doRemoveDocument} color='error' autoFocus>Delete</Button>
            </DialogActions>
          </Dialog>
        </Stack>
      </Container>
    </Fragment>
  )
};

const mapStateToProps = (state, ownProps) => {
  return {
    therapist: state.therapist,
    account: state.account,
  }
};

export default connect(mapStateToProps, {
  getPersonalTherapistInfo, updatePersonalTherapistInfo,
  removeDocument, addDocument,
})(UpdateTherapist);
