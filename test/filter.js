require('assert');
const Filter = require('../lib/advanced-word-filter.js'),
	filter = new Filter(),
	assert = require('better-assert');

describe('filter', function(){
	describe('clean',function(){
		it('(Latin-ext) Should replace a bad word within a sentence asterisks (******)',function(){
			let customFilter = new Filter({emptyList: true});
			customFilter.addWords('İstanbulda', 'Türkçe', "ürdün",  "MUSUN");
			assert(customFilter.clean('İstanbulda, istanbulda ürdün Türkçe konuşuyorum, anlıyor musun mu?') === '**********, ********** ***** ****** konuşuyorum, anlıyor ***** mu?');
		});

		it('Should replace a bad word within a sentence asterisks (*****)',function(){
			assert(filter.clean('Don\'t be an ash0le') === 'Don\'t be an ******');
		});

		it('Should replace multiple instances of any bad words within a sentence asterisks (******)',function(){
			assert(filter.clean('cnts ash0le knob xxx') === '**** ****** **** ***');
		});

		it('Should not replace anything within a sentence if there are no bad words',function(){
			assert(filter.clean('The cat ran fast') === 'The cat ran fast');
		});

		it('Should replace a string with proper placeholder when overridden', function(){
			var customFilter = new Filter({ placeHolder: 'x'});
			assert(customFilter.clean('This is a hells good test') === 'This is a xxxxx good test');
		});

		it('Should allow an instance of filter with an empty blacklist', function() {
			var customFilter = new Filter({
				emptyList: true
			});
			assert(customFilter.clean('This is a hells good test') === 'This is a hells good test');
		});

		it('Should tokenize words according to regex word boundaries',function(){
			assert(filter.clean('<p>Don\'t be an asshole</p>') === '<p>Don\'t be an *******</p>');
		});

	    it('Shouldn\'t filter words that aren\'t profane.', function() {
	        //console.log("SONUÇ: ", filter.clean('hello there'));
	        assert(filter.clean('hello there') === 'hello there');
	    });
	});
});