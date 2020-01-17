import React from 'react';
import { storiesOf } from '@storybook/react';

import Box from '../Box';

import ColoredIcon from './';
import ColoredIcons, { TColoredIconNames } from '../../utils/colored-icons';

storiesOf('Цветные Иконки (ColoredIcon)', module)
  .add(
    'Обычные',
    () => (
      <Box>
        {Object.keys(ColoredIcons).map(iconName =>
          <ColoredIcon
            name={iconName as TColoredIconNames}
            type="normal" />
        )}
      </Box>
    ),
    { info: { inline: true } },
  )
  .add(
    'Не активные кнопки',
    () => (
      <Box>
        {Object.keys(ColoredIcons).map(iconName => (
          <ColoredIcon
            type="off"
            name={iconName as TColoredIconNames} />
        ))}
      </Box>
    ),
    { info: { inline: true } },
  )
  .add(
    'Выбранные кнопки',
    () => (
      <Box>
        {Object.keys(ColoredIcons).map(iconName => (
          <ColoredIcon
            type="normal"
            name={iconName as TColoredIconNames}
            selected={true} />
        ))}
      </Box>
    ),
    { info: { inline: true } },
  );
