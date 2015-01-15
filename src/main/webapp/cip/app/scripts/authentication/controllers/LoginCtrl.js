'use strict';

//TODO: This login controler is a stub/fake controler only in place until the real TGuard login page is active
angular.module('cip.authentication')
.controller('LoginCtrl', ['$scope', '$rootScope', 'AuthenticateUserService', '$cookieStore', '$location', 'ENV', '$timeout', 'envDomainHandler', '$window',
	function($scope, $rootScope, AuthenticateUserService, $cookieStore, $location, ENV, $timeout, envDomainHandler, $window) {

		$rootScope.pageId = 'login-page';

		if($cookieStore.get('rememberMe')){
			$scope.username = $cookieStore.get('rememberMe');
			$scope.rememberMe = true;
		}

		$timeout(function(){
			if($('input[type=password]').val() !== ''){
				$scope.password = $('input[type=password]').val();
			}
		}, 1000);


		$scope.submitLogin = function(form){
			var credentials = {
					username : form.username.$viewValue,
					password : form.password.$viewValue
				},
				rememberme = form.rememberMe.$viewValue,
				loginStatus = AuthenticateUserService.login(credentials);
				envDomainHandler.setServiceDomain($window.location.origin);
			if(loginStatus){
				if(rememberme){
					$cookieStore.put('rememberMe', credentials.username);
				} else {
					$cookieStore.remove('rememberMe');
				}
				$location.path('/');

			} else if(!loginStatus) {
				$scope.incorrectLogin = true;
			}
		};
	}
]);

