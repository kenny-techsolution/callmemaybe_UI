angular.module('cip').controller('repCtrl', ['$scope','$modal','$location',
function($scope,$modal, $location) {
	'use strict';
	console.log("teatsetasetasetastasetase");
	$scope.goHome = function() {
		$location.path("/");
	};
	$scope.currentPopup = "create";
	$scope.selectedCallback = {};
	$scope.openCreate = function (size) {
		$scope.currentPopup = "create";
		var modalInstance = $modal.open({
		  templateUrl: 'views/modal.html',
		  controller: 'modalCtrl',
		  size: 'lg',
		  resolve: {
		    items: function () {
		      return $scope.items = ["create"];
		    },
		    currentPopup: function(){
		    	return $scope.currentPopup;
		    },
		    selectedCallback: function(){
		    	return $scope.selectedCallback;
		    },
		    callbacks :function(){
		    	return $scope.callbacks;
		    }
		  }
		});
	};
	$scope.openEdit = function (size, callback) {
		$scope.currentPopup = "edit";
		$scope.selectedCallback = callback;
		var modalInstance = $modal.open({
		  templateUrl: 'views/modal.html',
		  controller: 'modalCtrl',
		  size: 'lg',
		  resolve: {
		    items: function () {
		      return $scope.items = ["create"];
		    },
		    currentPopup: function(){
		    	return $scope.currentPopup;
		    },
		    selectedCallback: function(){
		    	return $scope.selectedCallback;
		    },
		    callbacks :function(){
		    	return $scope.callbacks;
		    }
		  }
		});
	};
	// modalInstance.result.then(function (selectedItem) {
	  // $scope.selected = selectedItem;
	// }, function () {
	  // $log.info('Modal dismissed at: ' + new Date());
	// });

	$scope.callbacks = [
		{
			name: "kenny",
			phone: "415-423-1341",
			description: "There are 6 types of charts so 6 directives, fix cable.",
			status: "completed",
			time: new Date(),
			timeleft: 10041,
			changes: [
				{
					time: 'xxxx',
					reason: ''
				},
				{
					time: 'xxxx',
					reason: ''
				}
			]
		},
		{
			name: "bart",
			phone: "415-433-1141",
			description: "Internet is too slow, fix cable.",
			status: "pending",
			time: new Date(),
			timeleft: 10041,
			changes: [
				{
					time: 'xxxx',
					reason: ''
				},
				{
					time: 'xxxx',
					reason: ''
				}
			]
		},
		{
			name: "teck",
			phone: "415-423-1341",
			description: "There is another directive chart-base that takes an extra attribute chart-type to define the type dynamically, fix internet.",
			status: "pending",
			time: new Date(),
			timeleft: 20341,
			changes: [
				{
					time: 'xxxx',
					reason: ''
				},
				{
					time: 'xxxx',
					reason: ''
				}
			]
		},
		{
			name: "Bart",
			phone: "415-423-1341",
			description: "Using 'UTF-8' encoding to copy filtered resources, fix phone.",
			status: "missed",
			time: new Date(),
			timeleft: 43141,
			changes: [
				{
					time: 'xxxx',
					reason: '',
					changedBy: ''
				},
				{
					time: 'xxxx',
					reason: '',
					changedBy: ''
				}
			]
		}
	];
	$scope.selectedStatus = "";
	$scope.filterAll =function(e){
		e.preventDefault();
		$scope.selectedStatus = "";
	};
	$scope.filterCompleted =function(e){
		e.preventDefault();
		$scope.selectedStatus = "completed";
	};
	$scope.filterPending =function(e){
		e.preventDefault();
		$scope.selectedStatus = "pending";
	};
	$scope.filterMissed =function(e){
		e.preventDefault();
		$scope.selectedStatus = "Missed";
	};
	$scope.completeCallback = function(callback) {
		callback.status="completed";
	};
}]);