'use strict';

angular.module('cip.authentication')
.controller('LogoutCtrl', ['$scope', 'AuthenticateUserService',
	function($scope, AuthenticateUserService) {
	
		AuthenticateUserService.logout();
	}
]);

