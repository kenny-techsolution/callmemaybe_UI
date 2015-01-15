describe('genderNumberToTextFilter', function() {
	'use strict';

	var filter;

	beforeEach(inject(function($filter) {
		filter = $filter('genderNumToTextFilter');
	}));

	it('returns "male" when value is "1"', function() {
		expect(filter('1')).toBe('male');
	});

	it('returns "female" when value is "2"', function() {
		expect(filter('2')).toBe('female');
	});

	it('returns "gender" in all other cases', function() {
		expect(filter()).toBe('gender');
		expect(filter('foo')).toBe('gender');
	});
});