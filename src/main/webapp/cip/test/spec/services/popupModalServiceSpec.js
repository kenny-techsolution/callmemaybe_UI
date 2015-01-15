'use strict';
describe('popupModalService', function() {

	var popupModalService;
	beforeEach(module('cip'));
	beforeEach(inject(function(_popupModalService_) {
		popupModalService = _popupModalService_;
	}));

	describe('showPopup', function() {
		it('defaults to invalidBillboardAdded error message', function() {
			expect(popupModalService.message).toBe(popupModalService.messages.invalidBillboardAdded);
		});

		it('updates the error message if the messageKey is passed in', function() {
			popupModalService.showPopup('noVendorOrGroupSelected');
			expect(popupModalService.message).toBe(popupModalService.messages.noVendorOrGroupSelected);
		});

		it('uses the last or default message if no messageKey is passed in', function() {
			popupModalService.showPopup();
			expect(popupModalService.message).toBe(popupModalService.messages.invalidBillboardAdded);
		});

		it('sets show to true', function() {
			expect(popupModalService.show).toBe(false);
			popupModalService.showPopup();
			expect(popupModalService.show).toBe(true);
		});
	});

	it('has a closePopup function that sets show to false', function() {
		popupModalService.showPopup();
		expect(popupModalService.show).toBe(true);
		popupModalService.closePopup();
		expect(popupModalService.show).toBe(false);
	});
});