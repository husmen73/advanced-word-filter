require('assert');
var Filter = require('../lib/advanced-word-filter.js'),
assert = require('better-assert');

describe('options', function() {
  describe('split regex', function() {

    it('default value', function() {
      let customFilter = new Filter();
      customFilter.addWords('français');
      assert(customFilter.clean('fucking asshole') === '******* *******');
      assert(customFilter.clean('mot en français') === 'mot en ********');
    });
  });
});
