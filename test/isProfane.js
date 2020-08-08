require('assert');
var Filter = require('../lib/advanced-word-filter.js'),
	filter = new Filter(),
	assert = require('better-assert');

describe('filter', function(){
	describe('isProfane',function(){
		it("Should detect a bad word and return a boolean value",function(){
			assert(filter.isProfane("ash0le"));
		});

		it("Should return false when no bad word is detected",function(){
			assert(filter.isProfane("wife") === false);
		});

		it("Should be able to detect a bad word in a sentence",function(){
			assert(filter.isProfaneSentence("that person is an ash0le"));
		});

		it('Filters out special characters appropriately', function() {
			assert(filter.isProfaneSentence("You're an asshole^ you are"));
		});

		it('Filters out special characters appropriately', function() {
			assert(filter.isProfaneSentence("TÜrkçe asshole^ you are"));
		});

		it('Should detect filtered words from basicWordList', function(){
			assert(filter.isProfane('screw'));
		});

		it('Should NOT detect filtered words from basicWordList', function(){
			assert(!filter.isProfane('screw2'));
		});

		it('Should detect filtered words regardless of type case', function() {
			var filter = new Filter({
				list: ['Test']
			});
			assert(filter.isProfane('test'));
		});

		it('Should tokenize words according to regex word boundaries', function() {
			assert(filter.isProfaneSentence("that person is an\nasshole"));
		});

		it('Should detect bad word phrases', function () {
			filter.addWords('oh no');
			assert(filter.isProfaneSentence("oh no! this is profane!"));
		});
	});
});
