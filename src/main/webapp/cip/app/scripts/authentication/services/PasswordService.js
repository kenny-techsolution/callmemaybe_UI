'use strict';

//Probably not needed anymore, replaced with CSP and TGuard external features
angular.module('cip.authentication')
.service('PasswordService', ['$cookieStore', '$location',
	function($cookieStore, $location) {

		this.resetPassword = function(username){
			return true;
		};

		this.createPassword = function(username, password){
			return true;
		};
	}
]);