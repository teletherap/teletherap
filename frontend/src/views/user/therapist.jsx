import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Alert, AlertTitle, CssBaseline, Container, FormControl, TextField, Button, Stack } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getPersonalTherapistInfo, updatePersonalTherapistInfo } from '../../redux/actions/therapist';
import Header from '../header';
 
const UpdateTherapist = ({ getPersonalTherapistInfo, updatePersonalTherapistInfo, therapist, account }) => {
  const [description, setDescription] = useState(therapist.description);
  const [licenseId, setLicenseId] = useState(therapist.licenseId);
  const [expertise, setExpertise] = useState(therapist.expertise);
  const [yearsOfExperience, setYearsOfExperience] = useState(therapist.yearsOfExperience);
  const [pricePerSession, setPricePerSession] = useState(therapist.pricePerSession);
  const [dailyStartTime, setDailyStartTime] = useState(therapist.dailyStartTime);
  const [dailyEndTime, setDailyEndTime] = useState(therapist.dailyEndTime);
  const [telegramUsername, setTelegramUsername] = useState(therapist.telegramUsername);
  const [documents, setDocuments] = useState(therapist.documents);

  useEffect(async () => {
    await getPersonalTherapistInfo();
    setDescription(therapist.description);
    setLicenseId(therapist.licenseId);
    setExpertise(therapist.expertise);
    setYearsOfExperience(therapist.yearsOfExperience);
    setPricePerSession(therapist.pricePerSession);
    setDailyStartTime(therapist.dailyStartTime);
    setDailyEndTime(therapist.dailyEndTime);
    setTelegramUsername(therapist.telegramUsername);
    setDocuments(therapist.documents);

    console.log(dailyStartTime);
    console.log(dailyEndTime);
    console.log(therapist);
  }, []);

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
  }

  if (!account.isLoggedIn || !account.isTherapist) {
    toast.error('You are not authorized to view this page');
    return <Redirect to="/" />;
  }

  return (
    <Fragment>
      <Header />
      <CssBaseline />
      <Container maxWidth="lg" className="bg-white shadow" style={{ padding: 25 }}>
        <form onSubmit={doUpdate}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
                {therapist.isApproved ? (
                  <div></div>
                ) : (
                  <Alert severity="warning">
                    <AlertTitle>Your account is not approved yet!</AlertTitle>
                    Please complete your profile and wait for approval.
                  </Alert>
                )}
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
})(UpdateTherapist);
