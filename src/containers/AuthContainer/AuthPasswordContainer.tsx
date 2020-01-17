import React, { SyntheticEvent } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router';
import cn from 'classnames';
import Button from '../../components/Button';

import './AuthContainer.scss';
import GlobalStore from '../../store/GlobalStore';
import Input from '../../components/Input';
import { Link } from 'react-router-dom';
import { validatePassword } from '../../utils/validateAuth';

interface IPageAuthProps extends RouteComponentProps {
  globalStore?: GlobalStore;
}

interface IPageAuthState {
  password: string;
  isCountPassword: boolean;
  isLatinWord: boolean;
}

@inject('globalStore')
@observer
class PageAuthLogin extends React.Component<IPageAuthProps, IPageAuthState> {
  state = {
    password: '',
    isCountPassword: false,
    isLatinWord: false,
  };

  handleFormSubmit = async () => {
    const { password } = this.state;
    const globalStore = this.props.globalStore!;

    await globalStore.changePassword('', password);
  };

  handlePasswordChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const isLatinWord = validatePassword(value).isLatinWord;
    const isCountPassword = validatePassword(value).isCountPassword;

    this.setState({
      isLatinWord,
      isCountPassword,
      password: value,
    });
  };

  public render() {
    const globalStore = this.props.globalStore!;
    const { password, isCountPassword, isLatinWord } = this.state;
    const { loading, errorPassword } = globalStore;

    const classesValidCount = cn('page-auth__validation', {
      [`page-auth__validation--error`]: !isCountPassword && password,
      [`page-auth__validation--valid`]: isCountPassword && password,
    });
    const classesValidLatin = cn('page-auth__validation', {
      [`page-auth__validation--error`]: !isLatinWord && password,
      [`page-auth__validation--valid`]: isLatinWord && password,
    });

    return (
      <div className="page-auth">
        <p className="page-auth__title">Изменение пароля</p>
        <Input
          className="page-auth__login"
          disabled
          placeholder="Ваш email"
          defaultValue="research@rbc.ru"
          theme="noborder"
        />
        <Input
          error={errorPassword}
          className="page-auth__password"
          onChange={this.handlePasswordChange}
          placeholder="Новый пароль"
          type="password"
        />
        <div className="page-auth__validations">
          <span className={classesValidCount}>Не менее 8 символов</span>
          <span className={classesValidLatin}>Буквы только латинские</span>
        </div>
        <div className="page-auth__controls">
          <Link to="/login" className={'page-auth__to-link'}>
            <Button
              color={'yellow-dark'}
              filled
              label={'Сохранить и войти '}
              className="page-auth__button"
              onClick={this.handleFormSubmit}
              disabled={loading || !isCountPassword || !isLatinWord}
            />
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(PageAuthLogin);
