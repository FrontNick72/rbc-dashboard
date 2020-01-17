import React from 'react';
import { storiesOf } from '@storybook/react';

import SearchBox from './';

storiesOf('Строка поиска', module).add(
  'Обычный',
  () => (
    <div style={{ boxShadow: '0px 4px 20px rgba(27, 99, 169, 0.14)', height: 120, width: 300 }}>
      <SearchBox classLine="" classSearch=""></SearchBox>
    </div>
  ),
  { info: { inline: true } }
);
