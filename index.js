const template = require('lodash.template')
const loaderUtils = require('loader-utils');

function getOptions(context) {
  if (context.options && context.options.ejsLoader) {
    return context.options.ejsLoader;
  }
  return {};
}

module.exports = function(source) {
  this.cacheable && this.cacheable();
  const query = loaderUtils.parseQuery(this.query);
  const options = getOptions(this);

  ['escape', 'interpolate', 'evaluate'].forEach(templateSetting => {
    const setting = query[templateSetting];
    if (typeof setting === 'string') {
      query[templateSetting] = new RegExp(setting, 'g');
    }
  });

  const templatedString = template(source, { ...query, ...options});
  return 'module.exports = ' + templatedString;
};
