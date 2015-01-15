'use strict';

//TODO: This page is probably not going to be needed anymore... not realy positive about removed it yet.
angular.module('cip.authentication')
.controller('PasswordCtrl', ['$scope', '$rootScope', '$routeParams', 'PasswordService',
	function($scope, $rootScope, $routeParams, PasswordService) {
		
		$rootScope.pageId = 'login-page';

		var status = $routeParams.status;

		$scope.isSuccess = false;
		$scope.template = status === 'create' ? 'views/login/create-password.html' : 'views/login/forgot-password.html';


		$scope.submitResetPassword = function(form){
			var username = form.username.$viewValue,
				success = PasswordService.resetPassword(username);

			if(success){
				$scope.isSuccess = true;
			} else {
				$scope.submitError = true;
			}
		};

		$scope.submitCreatePassword = function(form){
			var password = form.password.$viewValue,
				success = PasswordService.createPassword(password);

			if(success){
				$scope.isSuccess = true;
			} else {
				$scope.submitError = true;
			}
		};
	}
]);

