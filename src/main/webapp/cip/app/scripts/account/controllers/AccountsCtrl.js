'use strict';

angular.module('cip.account')
.controller('AccountsCtrl', ['$scope', '$rootScope', 'AccountsService', '$location',
	function($scope, $rootScope, AccountsService, $location) {

		$rootScope.pageId = 'admin-page';

		$scope.goToAccount = function(data){
			console.log(data);
			$location.path('/accounts/' + data.id);
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
		$scope.tableData.order = ['name', 'id', 'users', 'country', 'city', 'state', 'createDate', 'seats', 'status'];
		$scope.tableData.headers = {
			'name' : 'Account Name',
			'id' : 'Account ID',
			'users' : 'Users',
			'country' : 'country',
			'city' : 'City',
			'state' : 'State',
			'createDate' : 'create on',
			'seats' : 'seats',
			'status' : 'status'
		};
		$scope.tableData.tbody = [];

		AccountsService.getAllAccounts().then(function (data) {
			for(var i=0; i < data.length; i++){
				var dataSet = {};
				for(var dataKey in data[i]){

					for(var o=0; o < $scope.tableData.order.length; o++){
						if(dataKey === $scope.tableData.order[o]){
							if(dataKey === 'users'){
								dataSet[dataKey] = data[i][dataKey].length;
							} else {
								dataSet[dataKey] = data[i][dataKey];
							}
						}
					}
				}
				$scope.tableData.tbody.push(dataSet);
			}
		}, function(error){
			console.log(error);
			//TODO: added error message
		});
	}
]);

