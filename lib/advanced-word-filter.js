const localList = require('./basicWords.json').words;
const XRegExp = require('xregexp');
XRegExp.install('natives');

class Filter {

	/**
	 * Filter constructor.
	 * @constructor
	 * @param {object} options - Filter instance options
	 * @param {boolean} options.emptyList - Instantiate filter with no blocklist
	 * @param {boolean} options.firstLetter - Display first letter of word.
	 * @param {boolean} options.lastLetter - Display last letter of word, depends on firstLetter being true.
	 * @param {boolean} options.exclude - Excluded profane words.
	 * @param {array} options.list - Instantiate filter with custom list
	 * @param {string} options.placeHolder - Character used to replace profane words.
	 */
	constructor(options = {}) {
		Object.assign(this, {
			list: options.emptyList && [] || Array.prototype.concat.apply(localList, [options.list || []]),
			firstLetter: options.firstLetter || false,
			lastLetter: options.lastLetter || false,
			exclude: options.exclude || [],
			placeHolder: options.placeHolder || '*',
		})
	}

	convertToLowerCase(str) {
		let result = ''


		let letters = { "İ": "i", "I": "ı", "Ş": "ş", "Ğ": "ğ", "Ü": "ü", "Ö": "ö", "Ç": "ç" };
		str = str.replace(/(([İIŞĞÜÇÖ]))/g, function(letter){ return letters[letter]; })

		for (let i = 0; i < [...str].length; i++) {
			let code = str.charCodeAt(i)
			if (code > 64 && code < 91) {
				result += String.fromCharCode(code + 32)
			} else {
				result += str.charAt(i)
			}
		}
		return result
	}

	/**
	 * Determine if a string contains profane language.
	 * @param {string} string - String to evaluate for profanity.
	 */

	isProfane(string) {
		string = this.convertToLowerCase(string);

		return this.list
			.filter((word) => {
				let newWord = this.convertToLowerCase(word);
				newWord.replace(/[^\w\s]/gi, '');
				newWord = newWord.replace("*", "");
				return !this.exclude.includes(word.toLowerCase()) && XRegExp("^"+newWord+"$", 'igA').test(string);
			})
			.length > 0 || false;
	}

	/**
	 * Determine if a sentence contains profane language.
	 * @param {string} string - String to evaluate for profanity.
	 */

	isProfaneSentence(string) {
		string = this.convertToLowerCase(string);

		return this.list
			.filter((word) => {
				let newWord = this.convertToLowerCase(word);
				newWord = newWord.replace("*", "");
				return !this.exclude.includes(word.toLowerCase()) && XRegExp(newWord, 'igA').test(string);
			})
			.length > 0 || false;
	}

	/**
	 * Replace a word with placeHolder characters;
	 * @param {string} string - String to replace.
	 */
	replaceWord(string) {
		let firstLetter = string[0];
		let lastLetter = string[[...string].length - 1];

		if (this.firstLetter === true && this.lastLetter === false) {
			return firstLetter + (this.placeHolder.repeat([...string].length-1));
		} else if (this.firstLetter === true && this.lastLetter === true) {
			return firstLetter + (this.placeHolder.repeat([...string].length-2))+lastLetter;
		} else if (this.firstLetter === false && this.lastLetter === true) {
			return (this.placeHolder.repeat([...string].length-1))+lastLetter;
		} else {
			return this.placeHolder.repeat([...string].length);
		}
	}

	/**
	 * Evaluate a string for profanity and return an edited version.
	 * @param {string} string - Sentence to filter.
	 */
	clean(string) {
		let notALetter = XRegExp("[\\p{L}+\\p{Nd}'\"\\-]+|\\s|[$-\\/:-?{-~!\"^_`\\[\\]]", "uig");
		return XRegExp.match(string, notALetter).map((word) => {
			if([...word].length <= 2)
				return word;

			return this.isProfane(word) ? this.replaceWord(word) : word;
		}).join("");
	}

	/**
	 * Add word(s) to blocklist filter / remove words from allowlist filter
	 */
	addWords() {
		let words = Array.from(arguments);

		this.list.push(...words);

		words
			.map(word => this.convertToLowerCase(word))
			.forEach((word) => {
				if (this.exclude.includes(word)) {
					this.exclude.splice(this.exclude.indexOf(word), 1);
				}
			});
	}

	/**
	 * Add words to allowlist filter
	 */
	removeWords() {
		this.exclude.push(...Array.from(arguments).map(word => word.toLowerCase()));
	}
}

module.exports = Filter;