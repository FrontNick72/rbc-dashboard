import React from 'react';
import { storiesOf } from '@storybook/react';

import Scrollbar from './';

storiesOf('Кастомный скроллбар (Scrollbar)', module)
  .add(
    'Обычный',
    () => (
      <div style={{ boxShadow: '0px 4px 20px rgba(27, 99, 169, 0.14)', height: 120, width: 300 }}>
        <Scrollbar>
          <div style={{ padding: 20 }}>
            Hello Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium amet
            corporis laborum repellendus. Cupiditate distinctio dolore labore natus quam. Alias
            commodi earum molestias mollitia nobis placeat praesentium similique unde voluptas.
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias commodi
            consectetur consequuntur cum, cupiditate dicta expedita iure labore laborum maxime
            mollitia natus officia praesentium quam sequi voluptatum! Incidunt, vero. Hello Lorem
            ipsum dolor sit amet, consectetur adipisicing elit. Accusantium amet corporis laborum
            repellendus. Cupiditate distinctio dolore labore natus quam. Alias commodi earum
            molestias mollitia nobis placeat praesentium similique unde voluptas. Lorem ipsum dolor
            sit amet, consectetur adipisicing elit. Accusantium alias commodi consectetur
            consequuntur cum, cupiditate dicta expedita iure labore laborum maxime mollitia natus
            officia praesentium quam sequi voluptatum! Incidunt, vero. Hello Lorem ipsum dolor sit
            amet, consectetur adipisicing elit. Accusantium amet corporis laborum repellendus.
            Cupiditate distinctio dolore labore natus quam. Alias commodi earum molestias mollitia
            nobis placeat praesentium similique unde voluptas. Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Accusantium alias commodi consectetur consequuntur cum,
            cupiditate dicta expedita iure labore laborum maxime mollitia natus officia praesentium
            quam sequi voluptatum! Incidunt, vero.
          </div>
        </Scrollbar>
      </div>
    ),
    { info: { inline: true } }
  )
  .add(
    'С коллбэком (см. консоль)',
    () => (
      <div style={{ boxShadow: '0px 4px 20px rgba(27, 99, 169, 0.14)', height: 300 }}>
        <Scrollbar onScrollFrame={(values) => console.log(values)}>
          <div style={{ padding: 20, width: '100%' }}>
            <img
              style={{ width: '100%' }}
              src="https://picsum.photos/2560/1920"
              alt="Очень большая картинка"
            />
          </div>
        </Scrollbar>
      </div>
    ),
    { info: { inline: true } }
  );
