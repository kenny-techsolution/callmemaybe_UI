'use strict';

angular.module('cip.account')
.controller('UserCtrl', ['$scope', '$rootScope', '$routeParams', 'UsersService', 'AccountsService',
	function($scope, $rootScope, $routeParams, UsersService, AccountsService) {
	
		$rootScope.pageId = 'admin-page';
		$scope.updateBreadcrumbs = {};
		$scope.updateBreadcrumbs.accountId = '';
		$scope.updateBreadcrumbs.userId = '';

		var accountId = $routeParams.accountId,
			userId = $routeParams.userId;

		AccountsService.getAccountName(accountId).then(function (data){
			$scope.updateBreadcrumbs.accountId = { displayName : data };
		});

		
		
		UsersService.getUser(userId).then(function (data){
			
			$scope.updateBreadcrumbs.userId = { displayName : data[0].firstname };
			
		}, function(error){
			$scope.updateBreadcrumbs = {};
			console.log(error);
			//TODO: added error message
		});

	}
]);