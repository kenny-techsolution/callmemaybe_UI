'use strict';
describe('orderByObjectFilter', function() {
	var filter;
	var items = {
		'a': {'color': 'red', 'size': 2},
		'b': {'color': 'blue', 'size': 3},
		'c': {'color': 'green', 'size': 10}
	};

	beforeEach(inject(function($filter) {
		filter = $filter('orderObjectBy');
	}));

	it('returns a sortable array made from an object', function() {
		expect(filter(items, 'color')).toEqual([{color:'blue', size: 3}, {color: 'green', size: 10}, {color: 'red', size: 2 }]);
	});

	it('can reverse sort the items if needed', function() {
		expect(filter(items, 'size', true)).toEqual([{color: 'green', size: 10}, {color: 'blue', size: 3}, {color: 'red', size: 2 }]);
	});
});