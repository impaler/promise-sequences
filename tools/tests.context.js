require('./../spec/helpers/helper');

var testsContext = require.context('../spec', true, /[sS]pec.js/);
testsContext.keys().forEach(testsContext);

var srcContext = require.context('../spec', true, /^((?!spec).)*.js$/);
srcContext.keys().forEach(srcContext);