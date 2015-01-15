'use strict';
describe('parametersNotMetPopupService', function() {

	var parametersNotMetPopupService;
	beforeEach(module('cip.outOfHome'));

	beforeEach(inject(function(_parametersNotMetPopupService_) {
		parametersNotMetPopupService = _parametersNotMetPopupService_;
	}));

	it('starts off with parameters empty', function() {
		expect(parametersNotMetPopupService.parameters).toEqual([]);
	});

	describe('showPopup', function() {
		var parameters = [{test: 0}, {test: 1}];
		beforeEach(function() {
			parametersNotMetPopupService.showPopup(parameters);
		});
		it('sets the parameters for the popup', function() {
			expect(parametersNotMetPopupService.parameters).toEqual(parameters);
		});
		it('sets show to true', function() {
			expect(parametersNotMetPopupService.show).toBe(true);
		});
	});

	it('has a closePopup function that sets show to false', function() {
		parametersNotMetPopupService.show = true;
		parametersNotMetPopupService.closePopup();
		expect(parametersNotMetPopupService.show).toBe(false);
	});
});