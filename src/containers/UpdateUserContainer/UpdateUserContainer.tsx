import React, { SyntheticEvent } from 'react';
import './UpdateUserContainer.scss';
import { inject, observer } from 'mobx-react';
import GlobalStore from '../../store/GlobalStore';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { validatePhone, validateSymbol } from '../../utils/validateAuth';
import { TUser } from 'dashboards/types';

interface IInputUpdate {
  value: string;
  error?: string;
}

interface IUpdateUserContainerProps {
  globalStore?: GlobalStore;
}

export interface IUpdateUserContainerState {
  username: IInputUpdate;
  surname: IInputUpdate;
  email: IInputUpdate;
  phone: IInputUpdate;
  companyName: IInputUpdate;
  jobPosition: IInputUpdate;
}

@inject('globalStore')
@observer
class UpdateUserContainer extends React.Component<
  IUpdateUserContainerProps,
  IUpdateUserContainerState
> {
  state: IUpdateUserContainerState = {
    username: {
      value: '',
      error: undefined,
    },
    surname: {
      value: '',
      error: undefined,
    },
    email: {
      value: '',
      error: undefined,
    },
    phone: {
      value: '',
      error: undefined,
    },
    companyName: {
      value: '',
      error: undefined,
    },
    jobPosition: {
      value: '',
      error: undefined,
    },
  };

  private beforeUpdateState: IUpdateUserContainerState = this.state;
  private isChange: boolean = false;
  private isError: boolean = false;

  handleFormSubmit = (event: React.FormEvent<HTMLFormElement> | React.FormEvent<Element>) => {
    event.preventDefault();
    const { updateUser, user } = this.props.globalStore!;

    let userData: TUser = {
      userId: user ? user.userId : '',
      email: user ? user.email : '',
      username: this.state.username.value,
      companyName: this.state.companyName.value,
      jobPosition: this.state.jobPosition.value,
      phone: this.state.phone.value,
      surname: this.state.surname.value,
    };

    this.beforeUpdateState = this.state;
    this.setState(this.beforeUpdateState);
    updateUser(userData);
  };

  componentDidMount() {
    const { user } = this.props.globalStore!;

    if (user) {
      const newState = {
        username: { value: user.username ? user.username : '', error: undefined },
        surname: { value: user.surname ? user.surname : '', error: undefined },
        email: { value: user.email ? user.email : '', error: undefined },
        phone: { value: user.phone ? user.phone.replace(/[^\w\d]/g, '') : '', error: undefined },
        companyName: { value: user.companyName ? user.companyName : '', error: undefined },
        jobPosition: { value: user.jobPosition ? user.jobPosition : '', error: undefined },
      };
      this.setState(newState);
      this.beforeUpdateState = newState;
    }
  }

  handleInputChange = (e: SyntheticEvent<HTMLInputElement>, name?: string) => {
    let value = e.currentTarget.value;
    let error = undefined;
    const nameInput = name ? name : e.currentTarget.name;

    if (nameInput === 'phone' && !validatePhone(value.replace(/[^\w\d]/g, ''))) {
      error = 'Некорректный номер';
      value = value.replace(/[^\w\d]/g, '');
    } else if (nameInput === 'phone') {
      error = undefined;
      value = value.replace(/[^\w\d]/g, '');
    } else {
      if (validateSymbol(value)) {
        error = 'Нельзя использовать специальные символы';
      }
    }

    const newState = { [nameInput]: { value: value, error: error } } as Pick<
      IUpdateUserContainerState,
      keyof IUpdateUserContainerState
    >;

    this.setState(newState);
  };

  render() {
    const baseClass = 'update-user-container';
    const { username, surname, email, phone, companyName, jobPosition } = this.state;

    this.isChange = JSON.stringify(this.state) !== JSON.stringify(this.beforeUpdateState);
    this.isError = Object.values(this.state).some((inputElement) => inputElement.error);

    return (
      <form className={baseClass} onSubmit={this.handleFormSubmit}>
        <div className={`${baseClass}__groups`}>
          <div className={`${baseClass}__group-data`}>
            <div className={`${baseClass}__group-name`}>Основное</div>
            <div className={`${baseClass}__inputs`}>
              <Input
                className={`${baseClass}__input`}
                name="username"
                type="text"
                placeholder="Имя"
                error={username.error}
                value={username.value}
                onChange={this.handleInputChange}
              ></Input>
              <Input
                className={`${baseClass}__input`}
                name="surname"
                type="text"
                placeholder="Фамилия"
                error={surname.error}
                value={surname.value}
                onChange={this.handleInputChange}
              ></Input>
            </div>
          </div>
          <div className={`${baseClass}__group-data`}>
            <div className={`${baseClass}__group-name`}>Контакты</div>
            <div className={`${baseClass}__inputs`}>
              <Input
                className={`${baseClass}__input`}
                name="email"
                type="text"
                placeholder="Email"
                value={email.value}
                disabled
                onChange={this.handleInputChange}
              ></Input>
              <Input
                className={`${baseClass}__input`}
                name="phone"
                type="tel"
                placeholder="Телефон"
                error={phone.error}
                value={phone.value}
                onChange={(event) => this.handleInputChange(event, 'phone')}
              ></Input>
            </div>
          </div>
          <div className={`${baseClass}__group-data`}>
            <div className={`${baseClass}__group-name`}>Дополнительная информация</div>
            <div className={`${baseClass}__inputs`}>
              <Input
                className={`${baseClass}__input`}
                name="companyName"
                type="text"
                placeholder="Компания или сфера деятельности"
                error={companyName.error}
                value={companyName.value}
                onChange={this.handleInputChange}
              ></Input>
              <Input
                className={`${baseClass}__input`}
                name="jobPosition"
                type="text"
                placeholder="Должность"
                error={jobPosition.error}
                value={jobPosition.value}
                onChange={this.handleInputChange}
              ></Input>
            </div>
          </div>
        </div>
        <Button
          type={'submit'}
          color={'yellow-dark'}
          filled
          label={'Сохранить изменения'}
          className={`${baseClass}__button`}
          onClick={this.handleFormSubmit}
          disabled={!this.isChange || this.isError || !!phone.error}
        />
      </form>
    );
  }
}

export default UpdateUserContainer;
