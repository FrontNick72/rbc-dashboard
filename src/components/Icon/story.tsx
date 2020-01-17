import React from 'react';
import { storiesOf } from '@storybook/react';

import Box from '../Box';

import Icon from './';
import Icons, { TIconNames } from '../../utils/icons';

storiesOf('Иконки (Icon)', module)
  .add(
    'Обычные',
    () => (
      <Box>
        {Object.keys(Icons).map(iconName => <Icon name={iconName as TIconNames} /> )}
      </Box>
    ),
    { info: { inline: true } },
  );