import React from 'react';

import './AuthView.scss';
import AuthLogin from '../../containers/AuthContainer';
import AuthResetPassword from '../../containers/AuthContainer/AuthPasswordContainer';
import BottombarContainer from '../../containers/BottombarContainer';

interface IAuthViewProps {
  change?: boolean;
}

interface IAuthViewState {}

class AuthView extends React.Component<IAuthViewProps, IAuthViewState> {
  render() {
    return (
      <>
        <div className="auth-view">
          {this.props.change ? <AuthResetPassword /> : <AuthLogin />}
          {/* <AuthLogin /> */}
        </div>
        <BottombarContainer></BottombarContainer>
      </>
    );
  }
}

export default AuthView;
