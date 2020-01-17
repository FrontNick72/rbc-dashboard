import React from 'react';
import { storiesOf } from '@storybook/react';
import Card from './Card';
import '../../containers/AnonsContainer/AnonsContainer.scss';
import ColoredIcon from '../ColoredIcon';
import SubHeader from '../SubHeader';
import Button from '../../components/Button';
import Box from '../Box';

storiesOf('Карточки', module)
  .add(
    'Обычные',
    () => (
      <Box>
        <Card type="empty">
          <div className="anons-block">
            <div className="anons-block__icon">
              <ColoredIcon type="normal" name="clothes" />
            </div>
            <div className="anons-block__content">
              <div className="anons-block__title">
                <SubHeader>Название мероприятия</SubHeader>
              </div>
              <div className="anons-block__text">Аннотация мероприятия</div>
              <Button label="Узнать подробнее" filled color="yellow" />
            </div>
          </div>
        </Card>
      </Box>
    ),
    { info: { inline: true } }
  )
  .add(
    'Цветные',
    () => (
      <Box isTransparent>
        <Card type="colored">
          <div className="anons-block">
            <div className="anons-block__icon">
              <ColoredIcon type="normal" name="clothes" />
            </div>
            <div className="anons-block__content">
              <div className="anons-block__title">
                <SubHeader>Название мероприятия</SubHeader>
              </div>
              <div className="anons-block__text">Аннотация мероприятия</div>
              <Button label="Узнать подробнее" filled color="gray" />
            </div>
          </div>
        </Card>
      </Box>
    ),
    { info: { inline: true } }
  );
