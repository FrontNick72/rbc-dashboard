import React from 'react';
import Header from '../../components/Header';
import './AnonsContainer.scss';
import Card from '../../components/Card';
import SubHeader from '../../components/SubHeader';
import Button from '../../components/Button';
import Scrollbar from '../../components/Scrollbar';
import { inject, observer } from 'mobx-react';
import GlobalStore from '../../store/GlobalStore';

interface IAnonsContainerState {}

interface IAnonsContainerProps {
  globalStore?: GlobalStore;
}

@inject('globalStore')
@observer
class AnonsContainer extends React.Component<IAnonsContainerProps, IAnonsContainerState> {
  render() {
    const { articlesBusinessDevelopment } = this.props.globalStore!;

    return (
      <Scrollbar>
        <div className="anons-container">
          <Header>Развитие бизнеса</Header>
          <div className="anons-container__anonses">
            {articlesBusinessDevelopment.map((anons, index) => {
              // const typeCard = anons.full ? 'colored' : 'empty';
              const button = anons.link ? (
                // anons.full ? (
                <a
                  className={'anons-block__link'}
                  href={anons.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button label="Узнать подробнее" filled color="gray" icon="external-link" />
                </a>
              ) : null;
              const iconImage = anons.icon ? (
                <div className="anons-block__icon">
                  <img src={anons.icon.fields.file.url} alt={anons.icon.fields.file.fileName} />
                </div>
              ) : null;
              // ) : (
              // <Button label="Узнать подробнее" filled color="yellow" />
              // );

              return (
                <div key={`anons-business-${anons.id}`} className="anons-container__anons">
                  <Card type={'colored'}>
                    <div className="anons-block">
                      {iconImage}
                      <div className="anons-block__content">
                        <div className="anons-block__title">
                          <SubHeader>{anons.name}</SubHeader>
                        </div>
                        <div className="anons-block__text">{anons.description}</div>
                        {button}
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </Scrollbar>
    );
  }
}

export default AnonsContainer;
