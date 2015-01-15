//this servic provider returns a service object that manages custom errors.
//It keeps track of the error count for checking if all errors are cleared.
angular.module('cip.outOfHome').factory('CustomErrorServiceProvider', function() {
	'use strict';
	var CustomErrorServiceProvider = function(initObj) {
		this.errors = initObj;
		this.errorCount = 0;
	};

	CustomErrorServiceProvider.prototype.turnOn = function(errorKey) {
		if (this.errors[errorKey] && this.errors[errorKey].show !== true) {
			this.errors[errorKey].show = true;
			this.errorCount++;
		}
	};

	CustomErrorServiceProvider.prototype.turnOff = function(errorKey) {
		if (this.errors[errorKey] && this.errors[errorKey].show !== false) {
			this.errors[errorKey].show = false;
			this.errorCount--;
		}
	};

	CustomErrorServiceProvider.prototype.setMessage = function(errorKey, message) {
		if (this.errors[errorKey]) {
			this.errors[errorKey].message = message;
		}
	};

	var service = {
		getInstance : function(initObj) {
			return new CustomErrorServiceProvider(initObj);
		}
	};

	return service;
});