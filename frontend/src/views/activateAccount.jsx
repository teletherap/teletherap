import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import { activate } from '../redux/actions/account';
 
const ActivateAccount = ({ activate }) => {
  const { username, token } = useParams();

  useEffect(() => {
    activate(username, token);
  });

  return <Redirect to="/login" />;
};

const mapStateToProps = (state, ownProps) => {
  return {}
};

export default connect(mapStateToProps, {
  activate,
})(ActivateAccount);
