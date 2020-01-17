import React from 'react';
import { storiesOf } from '@storybook/react';

import Icon from '../Icon';

import Input from './';

const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log('Input value:', event.target.value);
};

storiesOf('Инпут (Input)', module)
  .add(
    'Обычные',
    () => (
      <span style={{ display: 'flex' }}>
        <div style={{ marginRight: 10 }}>
          <Input placeholder="Название инпута" />
        </div>
        <div style={{ marginRight: 10 }}>
          <Input placeholder="Пароль" defaultValue="123" type="password" />
        </div>
        <div style={{ marginRight: 10 }}>
          <Input
            placeholder="Название инпута"
            error="Текст ошибки"
            defaultValue="research@rbc.ru"
          />
        </div>
        <div>
          <Input
            placeholder="Ошибочка"
            error="Пользователя с таким логином не существует"
            value="research@rbc.ru"
            onChange={onChange}
          />
        </div>
      </span>
    ),
    { info: { inline: true } }
  )
  .add(
    'Material Design™',
    () => (
      <span style={{ display: 'flex' }}>
        <div style={{ marginRight: 10 }}>
          <Input placeholder="Логин" theme="underline" />
        </div>
        <div style={{ marginRight: 10 }}>
          <Input placeholder="Пароль" defaultValue="123" type="password" theme="underline" />
        </div>
        <div>
          <Input
            placeholder="Ошибочка"
            error="Пользователя с таким логином не существует"
            defaultValue="f.asd"
            theme="underline"
          />
        </div>
      </span>
    ),
    { info: { inline: true } }
  )
  .add(
    'С компонентами внутри',
    () => (
      <span style={{ display: 'flex' }}>
        <div style={{ marginRight: 10 }}>
          <Input placeholder="Поисковой запрос" addonAfter={<Icon name="close" />} />
        </div>
        <div style={{ marginRight: 10 }}>
          <Input
            placeholder="Поисковой запрос"
            addonAfter={
              <Icon
                name="close"
                onClick={(event) => {
                  event.stopPropagation();
                  alert('hello!');
                }}
              />
            }
          />
        </div>
      </span>
    ),
    { info: { inline: true } }
  )
  .add(
    'Не изменяемые',
    () => (
      <span style={{ display: 'flex' }}>
        <div style={{ marginRight: 10 }}>
          <Input disabled placeholder="Ваш email" defaultValue="research@rbc.ru" theme="noborder" />
        </div>
      </span>
    ),
    { info: { inline: true } }
  );
