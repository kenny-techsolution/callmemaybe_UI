'use strict';

angular.module('cip.account')
.controller('AccountCtrl', ['$scope', '$rootScope', 'AccountsService', '$location', '$routeParams',
	function($scope, $rootScope, AccountsService, $location, $routeParams) {

		$rootScope.pageId = 'admin-page';

		var accountId = $routeParams.accountId;


		AccountsService.getAccount(accountId).then(function (data) {
			$scope.accountData = data;
			$scope.updateBreadcrumbs = {};
			$scope.updateBreadcrumbs.accountId = { displayName : data.name };
		}, function(error){
			console.log(error);
			//TODO: added error message
		});
	}
]);