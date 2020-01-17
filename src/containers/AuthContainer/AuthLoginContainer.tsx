import React, { SyntheticEvent } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router';

import Button from '../../components/Button';

import './AuthContainer.scss';
import GlobalStore from '../../store/GlobalStore';
import Input from '../../components/Input';
import { validateEmail } from '../../utils/validateAuth';

interface IPageAuthProps extends RouteComponentProps {
  globalStore?: GlobalStore;
}

interface IPageAuthState {
  email: string;
  loginError?: string;
  passwordError?: string;
  password: string;
  isSentPassword: boolean;
}

// DRY [1567056495994]
const ERROR_INCORRECT_EMAIL = 'Проверьте правильность email';

@inject('globalStore')
@observer
class PageAuthLogin extends React.Component<IPageAuthProps, IPageAuthState> {
  state = {
    email: '',
    loginError: undefined,
    passwordError: undefined,
    password: '',
    isSentPassword: false,
  };

  sentPassword = () => {
    const { email } = this.state;
    const { sendPasswordReset } = this.props.globalStore!;

    if (email) {
      this.setState({ isSentPassword: true });
      sendPasswordReset(email);
    } else {
      this.setState({ loginError: 'Введите email' });
    }
  };

  handleFormSubmit = async (event: React.FormEvent<HTMLFormElement | Element>) => {
    event.preventDefault();
    const { email, password } = this.state;
    const globalStore = this.props.globalStore!;

    if (!validateEmail(email)) {
      return this.setState({ loginError: ERROR_INCORRECT_EMAIL });
    }

    await globalStore.getUserToken(email, password);
  };

  handleLoginChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { clearErrors } = this.props.globalStore!;
    this.setState({ email: e.currentTarget.value, loginError: '', isSentPassword: false });
    clearErrors();
  };

  handlePasswordChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { clearErrors } = this.props.globalStore!;
    this.setState({ password: e.currentTarget.value });
    clearErrors();
  };

  public render() {
    const globalStore = this.props.globalStore!;
    const { email, password, loginError, passwordError, isSentPassword } = this.state;
    const { loading, errorEmail, errorPassword } = globalStore;
    const loginErrorString = loginError ? loginError : errorEmail ? errorEmail : '';
    const passwordErrorString = passwordError ? passwordError : errorPassword ? errorPassword : '';

    return (
      <form className="page-auth" onSubmit={this.handleFormSubmit}>
        <p className="page-auth__title">Авторизация</p>
        <p className="page-auth__message">Введите email и пароль, чтобы войти в систему</p>
        <Input
          className="page-auth__login"
          error={loginErrorString}
          onChange={this.handleLoginChange}
          placeholder="Email"
          type="text"
        />
        <Input
          className="page-auth__password"
          error={passwordErrorString}
          onChange={this.handlePasswordChange}
          placeholder="Пароль"
          type="password"
        />
        <div className="page-auth__controls">
          <Button
            type={'submit'}
            color={'yellow-dark'}
            filled
            label={'Войти'}
            className="page-auth__button"
            onClick={this.handleFormSubmit}
            disabled={loading || !email || !password}
          />
          {isSentPassword ? (
            <span className="page-auth__password-message">
              Cсылка для изменения пароля отправлена на {email}
            </span>
          ) : (
            <Button
              type={'button'}
              color={'ghost'}
              label={'Я забыл пароль'}
              className="page-auth__recovery-button"
              onClick={this.sentPassword}
            />
          )}
        </div>
      </form>
    );
  }
}

export default withRouter(PageAuthLogin);
