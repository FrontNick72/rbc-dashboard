import { configure, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import '../src/styles/main.scss';

addDecorator(withInfo);

const req = require.context('../src/components', true, /.stor(y|ies).tsx$/);

function loadStories() {
  req.keys().forEach(req);
}
configure(loadStories, module);
