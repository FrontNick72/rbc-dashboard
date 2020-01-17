import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Box from './';

storiesOf('Контейнер с содержимым (Box)', module)
  .add(
    'Default',
    () => <Box>Содержимое</Box>,
    { info: { inline: true } },
  );
