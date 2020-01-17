import React from 'react';

import './ProfileView.scss';

import GlobalStore from '../../store/GlobalStore';
import { observer, inject } from 'mobx-react';
import BottombarContainer from '../../containers/BottombarContainer';
import Button from '../../components/Button';
import SubHeader from '../../components/SubHeader';
import UpdateUserContainer from '../../containers/UpdateUserContainer';
import ChangeUserPasswordContainer from '../../containers/ChangeUserPasswordContainer';
import Scrollbars from 'react-custom-scrollbars';

interface IProfileViewState {}

interface IProfileViewProps {
  globalStore?: GlobalStore;
}

@inject('globalStore')
@observer
class ProfileView extends React.Component<IProfileViewProps, IProfileViewState> {
  state = {};

  render() {
    const { logout } = this.props.globalStore!;

    return (
      <>
        <Scrollbars>
          <div className="profile-view">
            <div className="profile-view__top-container">
              <SubHeader className="profile-view__title">Изменить личные данные</SubHeader>
              <Button
                className="profile-view__logout-button"
                color="gray"
                filled
                label="Выйти из профиля"
                onClick={logout}
              ></Button>
            </div>
            <UpdateUserContainer></UpdateUserContainer>
            <ChangeUserPasswordContainer></ChangeUserPasswordContainer>
          </div>
        </Scrollbars>
        <BottombarContainer></BottombarContainer>
      </>
    );
  }
}

export default ProfileView;
