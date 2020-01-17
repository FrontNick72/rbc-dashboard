import React, { SyntheticEvent } from 'react';
import { inject, observer } from 'mobx-react';
import cn from 'classnames';
import Button from '../../components/Button';

import './ChangeUserPasswordContainer.scss';
import GlobalStore from '../../store/GlobalStore';
import Input from '../../components/Input';
import { validatePassword } from '../../utils/validateAuth';
import SubHeader from '../../components/SubHeader';

interface IChangeUserPasswordContainerProps {
  globalStore?: GlobalStore;
}

interface IChangeUserPasswordContainerState {
  CurrentPassword: string;
  NewPassword: string;
  isCountPassword: boolean;
  isLatinWord: boolean;
}

@inject('globalStore')
@observer
class ChangeUserPasswordContainer extends React.Component<
  IChangeUserPasswordContainerProps,
  IChangeUserPasswordContainerState
> {
  state = {
    CurrentPassword: '',
    NewPassword: '',
    isCountPassword: false,
    isLatinWord: false,
  };

  handleFormSubmit = async (event: React.FormEvent<HTMLFormElement> | React.FormEvent<Element>) => {
    event.preventDefault();
    const { CurrentPassword, NewPassword } = this.state;
    const globalStore = this.props.globalStore!;

    await globalStore.changePassword(CurrentPassword, NewPassword);

    this.setState({
      CurrentPassword: '',
      NewPassword: '',
      isCountPassword: false,
      isLatinWord: false,
    });
  };

  handleCurrentPasswordChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const globalStore = this.props.globalStore!;

    globalStore.clearErrors();

    this.setState({
      CurrentPassword: value,
    });
  };

  handleNewPasswordChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const isLatinWord = validatePassword(value).isLatinWord;
    const isCountPassword = validatePassword(value).isCountPassword;

    this.setState({
      isLatinWord,
      isCountPassword,
      NewPassword: value,
    });
  };

  public render() {
    const globalStore = this.props.globalStore!;
    const { CurrentPassword, NewPassword, isCountPassword, isLatinWord } = this.state;
    const { loading, errorPassword } = globalStore;

    const classesValidCount = cn('change-password-container__validation', {
      [`change-password-container__validation--error`]: !isCountPassword && NewPassword,
      [`change-password-container__validation--valid`]: isCountPassword && NewPassword,
    });
    const classesValidLatin = cn('change-password-container__validation', {
      [`change-password-container__validation--error`]: !isLatinWord && NewPassword,
      [`change-password-container__validation--valid`]: isLatinWord && NewPassword,
    });

    return (
      <form onSubmit={this.handleFormSubmit} className="change-password-container">
        <SubHeader className="change-password-container__title">Изменить пароль</SubHeader>
        <Input
          error={errorPassword}
          className="change-password-container__current-password"
          onChange={this.handleCurrentPasswordChange}
          placeholder="Текущий пароль"
          type="password"
          value={CurrentPassword}
        />
        <Input
          className="change-password-container__new-password"
          onChange={this.handleNewPasswordChange}
          placeholder="Новый пароль"
          type="password"
          value={NewPassword}
        />
        <div className="change-password-container__validations">
          <span className={classesValidCount}>Не менее 8 символов</span>
          <span className={classesValidLatin}>Буквы только латинские</span>
        </div>
        <div className="change-password-container__controls">
          <Button
            type="submit"
            color={'yellow-dark'}
            filled
            label={'Изменить пароль'}
            className="change-password-container__button"
            onClick={this.handleFormSubmit}
            disabled={loading || !isCountPassword || !isLatinWord}
          />
        </div>
      </form>
    );
  }
}

export default ChangeUserPasswordContainer;
