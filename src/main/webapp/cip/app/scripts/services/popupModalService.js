'use strict';

angular.module('cip').service('popupModalService', function() {
	this.show = false;
	this.messages = {
		invalidBillboardAdded: 'The billboard number you have entered is invalid, please check the number again.',
		noVendorOrGroupSelected: 'No Vendor/Operator or Group was selected. Please make at least one selection from the Board Data menu on the top right panel.'
	};
	this.message = this.messages.invalidBillboardAdded;
	this.showPopup = function(messageKey) {
		if (messageKey) {
			this.message = this.messages[messageKey];
		}
		this.show = true;
	};
	this.closePopup = function() {
		this.show = false;
	};
});