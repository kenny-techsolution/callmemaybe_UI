angular.module('cip').controller('adminCtrl', ['$scope','$location',
function($scope, $location) {
	'use strict';
	//line Chart
	$scope.goHome = function() {
		$location.path("/");
	};
	$scope.Linelabels = ["January", "February", "March", "April", "May", "June", "July"];
	$scope.Lineseries = ['Missed Calls'];
	$scope.Linedata = [[65, 59, 80, 81, 56, 55, 40]];
	$scope.onClick = function(points, evt) {
		console.log(points, evt);
	};

	//Radar Chart
	$scope.labels = ["Customer not Pick Up", "Other Emergency", "Too Many Callbacks", "Forgot", "Others"];

	$scope.data = [[65, 59, 90, 81, 56], [28, 48, 40, 19, 96]];

	$scope.callbacks = [{
		name : "kenny",
		phone : "415-423-1341",
		description : "fix cable.",
		status : "completed",
		time : new Date(),
		changes : [{
			time : 'xxxx',
			reason : ''
		}, {
			time : 'xxxx',
			reason : ''
		}]
	}, {
		name : "teck",
		phone : "415-423-1341",
		description : "fix internet.",
		status : "pending",
		time : new Date(),
		changes : [{
			time : 'xxxx',
			reason : ''
		}, {
			time : 'xxxx',
			reason : ''
		}]
	}, {
		name : "Bart",
		phone : "415-423-1341",
		description : "fix phone.",
		status : "missed",
		time : new Date(),
		changes : [{
			time : 'xxxx',
			reason : '',
			changedBy : ''
		}, {
			time : 'xxxx',
			reason : '',
			changedBy : ''
		}]
	}];
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
}]);