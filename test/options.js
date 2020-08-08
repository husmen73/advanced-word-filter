require('assert');
var Filter = require('../lib/advanced-word-filter.js'),
assert = require('better-assert');

describe('options', function() {
  describe('split regex', function() {

    it('default value', function() {
      filter = new Filter();
      filter.addWords('français');
      assert(filter.clean('fucking asshole') === '******* *******');
      assert(filter.clean('mot en français') === 'mot en ********');
    });
  });
});
