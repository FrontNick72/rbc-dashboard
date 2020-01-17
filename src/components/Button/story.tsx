import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import Box from '../Box';

import Button from './';

storiesOf('Кнопки (Button)', module)
  .add(
    'Обычные',
    () => (
      <Box>
        <Button
          label="Кнопка"
          color="gray"
          onClick={() => alert('Кнопка 2')}
        />
        <Button
          label="Кнопка"
          color="yellow"
          onClick={() => alert('Кнопка 3')}
        />
        <Button
          label="Кнопка"
          filled
          color="gray"
          onClick={() => alert('Кнопка 2')}
        />
        <Button
          label="Кнопка"
          filled
          color="yellow"
          onClick={() => alert('Кнопка 3')}
        />
      </Box>
    ),
    { info: { inline: true } },
  ).add(
    'Кнопки панели сегментов',
    () => React.createElement(() => {
      const [checked, setChecked] = useState(false);

      return (
        <>
          <Button
            label="Кнопка"
            color="yellow"
            onClick={() => setChecked(!checked)}
            checked={checked} />
        </>
      )
    }),
    { info: { inline: true } },
  ).add(
    'Отключенные',
    () => (
      <Box>
        <Button
          disabled
          label="Кнопка"
          onClick={() => alert('Кнопка 1')}
        />
        <Button
          disabled
          label="Кнопка"
          onClick={() => alert('Кнопка 2')}
        />
        <Button
          disabled
          label="Кнопка"
          onClick={() => alert('Кнопка 3')}
        />
      </Box>
    ),
    { info: { inline: true } },
);
