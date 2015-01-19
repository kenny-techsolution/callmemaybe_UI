angular.module('cip').controller('landingCtrl', ['$scope','$location',
function($scope,$location) {
	'use strict';
	$scope.goRep = function(){
		$location.path("/rep");
	};
	$scope.goSuper = function() {
		$location.path("/admin");
	};
}]);