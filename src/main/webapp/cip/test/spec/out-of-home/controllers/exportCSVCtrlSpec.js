describe('exportCSVCtrl', function() {
	'use strict';

	var scope = {};
	var csvData = [['Name', 'City', 'State'], ['Bob', 'San Francisco', 'CA']];

	beforeEach(module('cip'));

	beforeEach(inject(function($controller) {
		$controller('exportCSVCtrl', {$scope: scope});
	}));

	it('has a downloadCSV function', function() {
		expect(typeof scope.downloadCSV).toBe('function');
	});

	// todo: is there a way to test file download attributes like filename,
	// without actually downloading the file?
	xdescribe('createCSV function', function() {
		beforeEach(function() {
			spyOn(scope.csvFile, 'prepareCSV').andCallThrough();
			spyOn(document.body, 'appendChild').andCallFake($.noop);
			spyOn(document.body, 'removeChild');
			scope.createCSV();
		});

		it('calls prepareCSV to get the formatted csv file', function() {
			expect(scope.csvFile.prepareCSV).toHaveBeenCalled();
		});

		it('creates an invisible href to the csv file', function() {
			expect(document.body.appendChild).toHaveBeenCalled();
		});

		it('sets the correct filename to the csv file', function() {
			var link = document.body.appendChild.argsForCall[0][0];
			expect(link.getAttribute('download').indexOf('OOH_proposal_billboards')).toBeGreaterThan(-1);
		});
	});
});