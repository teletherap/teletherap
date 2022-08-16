import { connect } from 'react-redux';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { verifyDeposit } from '../../redux/actions/finance';
import { useEffect } from 'react';
 
const VerifyDeposit = ({ verifyDeposit }) => {
  const { username, amount } = useParams();
  let searchParams = useSearchParams()[0];

  useEffect(() => {
    verifyDeposit(username, Number(amount), searchParams.get('Authority'), searchParams.get('Status'));
  });

  return <Navigate to="/user/wallet" />;
};

const mapStateToProps = (state, ownProps) => {
  return {}
};

export default connect(mapStateToProps, {
  verifyDeposit,
})(VerifyDeposit);
