describe('boardDataSelectionService', function() {
	'use strict';

	var boardDataSelection;

	beforeEach(inject(function(_boardDataSelection_) {
		boardDataSelection = _boardDataSelection_;
	}))

	it('has a toggleOpenState function that toggles the state of the selection menu', function() {
		expect(boardDataSelection.isOpened).toBe(false);
		boardDataSelection.toggleOpenState();
		expect(boardDataSelection.isOpened).toBe(true);
	});

	it('has a getVendorsArray that calls getArray function with the string "vendors"', function() {
		spyOn(boardDataSelection, 'getArray').andCallThrough();
		boardDataSelection.getVendorsArray();
		expect(boardDataSelection.getArray).toHaveBeenCalledWith('vendors');
	});

	it('has a getGroupsArray that calls getArray function with the string "groups"', function() {
		spyOn(boardDataSelection, 'getArray').andCallThrough();
		boardDataSelection.getGroupsArray();
		expect(boardDataSelection.getArray).toHaveBeenCalledWith('groups');
	});

	describe('getArray', function() {
		it('returns an empty array if the type passed in is undefined or null', function() {
			expect(boardDataSelection.getArray()).toEqual([]);
		});

		it('returns the array of db-specific names from a nameMap', function() {
			boardDataSelection.vendors.clearChannel = true;
			boardDataSelection.groups.attBillboards = true;
			var vendors = boardDataSelection.getVendorsArray();
			var groups = boardDataSelection.getGroupsArray();
			expect(vendors).toEqual(['Clear Channel']);
			expect(groups).toEqual(['att-billboards']);
		});
	});

	describe('isAllSelected', function() {
		it('returns false if the type passed in is undefined or null', function() {
			expect(boardDataSelection.isAllSelected()).toBe(false);
		});

		it('returns true if all items of that type are true', function() {
			boardDataSelection.vendors.clearChannel = true;
			boardDataSelection.groups.attBillboards = true;
			expect(boardDataSelection.isAllSelected('vendors')).toBe(true);
			expect(boardDataSelection.isAllSelected('groups')).toBe(true);
		});

		it('returns false if any item of that type are false', function() {
			boardDataSelection.vendors.clearChannel = false;
			expect(boardDataSelection.isAllSelected('vendors')).toBe(false);
		});
	});

	describe('isNoneSelected', function() {
		it('returns false if any vendor or group is selected', function() {
			boardDataSelection.vendors.clearChannel = true;
			boardDataSelection.groups.attBillboards = false;
			expect(boardDataSelection.isNoneSelected()).toBe(false);
		});

		it('returns true if none of the vendors or groups are selected', function() {
			boardDataSelection.vendors.clearChannel = false;
			boardDataSelection.groups.attBillboards = false;
			expect(boardDataSelection.isNoneSelected()).toBe(true);
		});
	});
});