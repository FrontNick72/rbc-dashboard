const path = require('path');
const SRC_PATH = path.join(__dirname, '../src');
const sassImporter = require('node-sass-glob-importer');

//const STORIES_PATH = path.join(__dirname, '../stories');
//dont need stories path if you have your stories inside your //components folder

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    include: [SRC_PATH],
    use: [
      {
        loader: require.resolve('awesome-typescript-loader'),
        options: {
          configFileName: './.storybook/tsconfig.json'
        }
      },
      { loader: require.resolve('react-docgen-typescript-loader') }
    ]
  });
  config.resolve.extensions.push('.ts', '.tsx');

  const sassRules = config.module.rules.filter(conf =>
    conf.test && conf.test.source && conf.test.source.indexOf('sass') >= 0
  );

  if (sassRules) {
    sassRules.forEach((sassRule) => {
      sassRule.use.forEach(use => {
        if (use.loader && use.loader.indexOf('sass-loader') >= 0) {
          use.options.importer = sassImporter();
        }
      });
    });
  }

  return config;
};
