import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Preloader from './';

storiesOf('Индикатор загрузки (Preloader)', module)
  .add(
    'Default',
    () => <Preloader />,
    { info: { inline: true } },
  );
