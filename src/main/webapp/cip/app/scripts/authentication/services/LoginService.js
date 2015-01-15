'use strict';

angular.module('cip.authentication')
.service('LoginService', function() {

	//TODO to hook up to t-guard and CSP
	//TODO I believe this service should get removed, it is not needed anymore replaced with AuthenticateUserService.

	this.login = function(username, password){
		var fakeUsername = 'demo@att.com',
		fakePassword = 'password';

		if(username === fakeUsername && password === fakePassword){
			return true;
		}

		return false;
	};

	this.logout = function(){
		return true;
	};

	this.resetPassword = function(username){

		return true;
	};

	this.createPassword = function(password){
		return true;
	};

});