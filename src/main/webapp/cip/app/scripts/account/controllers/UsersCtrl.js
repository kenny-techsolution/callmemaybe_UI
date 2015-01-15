'use strict';

angular.module('cip.account')
.controller('UsersCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'UsersService', 'AccountsService',
	function($scope, $rootScope, $routeParams, $location, UsersService, AccountsService) {
	
		$rootScope.pageId = 'admin-page';

		var accountId = $routeParams.accountId;

		$scope.goToUser = function(data){
			console.log(data);
			//$location.path('/accounts/' + accountId + '/users/' + data.email);
		};

		$scope.deleteSelectedUsers = function(){
			//TODO: need to add call to database to remove users

			for(var i = 0; i < $scope.tableData.tbody.length; i++){
				if($scope.tableData.tbody[i].selected){
					$scope.tableData.tbody.splice(i,1);
					i--;
				}
			}
		};


		$scope.updateBreadcrumbs = {};
		$scope.updateBreadcrumbs.accountId = '';

		AccountsService.getAccountName(accountId).then(function(data){
			$scope.updateBreadcrumbs.accountId = { displayName : data };
		});

		$scope.changeFilterBy = function(filter){
			$scope.filterBy = filter;
		};


		$scope.currentPage = 1;
		$scope.totalItems;

		$scope.filterBy = '$';
		$scope.tableFilter = {};
		$scope.tableFilter[$scope.filterBy] = $scope.userSearch;

		$scope.$watch('userSearch', function() {
			$scope.tableFilter = {};
			$scope.tableFilter[$scope.filterBy] = $scope.userSearch;
		});

		$scope.orderTableBy = 'id';

		$scope.tableData = {};
		$scope.tableData.order = ['id', 'firstname', 'lastname', 'email', 'status', 'createDate'];
		$scope.tableData.headers = {
			'id' : 'id',
			'firstname' : 'first name',
			'lastname' : 'last name',
			'email' : 'email',
			'status' : 'status',
			'createDate' : 'create on'
		};
		$scope.tableData.tbody = [];

		AccountsService.getAccountUsers(accountId).then(function (data) {

			for(var i=0; i < data.length; i++){
				var dataSet = {};

				for(var dataKey in data[i]){
					for(var o=0; o < $scope.tableData.order.length; o++){
						if(dataKey === $scope.tableData.order[o]){
							dataSet[dataKey] = data[i][dataKey];
						}
					}
				}

				$scope.tableData.tbody.push(dataSet);
			}

			//TODO: fix tr data click ordering issue
			console.log($scope.tableData.tbody);
		}, function(error){
			console.log(error);
			//TODO: added error message

		});

	}
]);

