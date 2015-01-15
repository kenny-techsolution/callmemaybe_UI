'use strict';

angular.module('cip.outOfHome').service('parametersNotMetPopupService', function() {
	this.show = false;
	this.headerText = 'All Parameters Not Met';
	this.message = 'Budget limit reached before the following metric was met:';
	this.suffix = 'Click Continue to build your campaign without this target metric, or click Go Back to edit your campaign.';
	this.parameters = [];
	this.showPopup = function(parameters) {
		this.parameters = parameters;
		this.show = true;
	};
	this.closePopup = function() {
		this.show = false;
	};
});