require('assert');
var Filter = require('../lib/advanced-word-filter.js'),
  assert = require('better-assert');

describe('display', function () {
  describe('options', function () {

    it('first letter', function () {
      var filter = new Filter({ firstLetter: true });
      filter.addWords('nerd*', 'dog');
      assert(filter.clean('wank nerdy') === 'w*** nerdy');
      assert(filter.clean("go dog go") === "go d** go");
    });

    it('first + last letter', function () {
      var filter = new Filter({ firstLetter: true, lastLetter: true });
      filter.addWords('titt', 'fuck', 'cabron');
      assert(filter.clean('titt fuck') === 't**t f**k');
      assert(filter.clean("cabron dog andskota") === "c****n dog a******a");
    });

    it('last letter', function () {
      var filter = new Filter({ lastLetter: true });
      filter.addWords('nerd', 'dog');
      assert(filter.clean('damn nerd') === '***n ***d');
      assert(filter.clean("go dog go") === "go **g go");
    });

  });
});
