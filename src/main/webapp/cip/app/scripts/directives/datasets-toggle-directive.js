'use strict';

angular.module('cip').directive('datasetsToggle', function() {
	return {
		restrict : 'A',
		replace : true,
		scope : {
			dataset : '=',
			okayCallback : '&'
		},
		templateUrl : 'views/partials/datasets-toggle-template.html',
		controller : function($scope, popupModalService) {
			$scope.showPopup = true;
			$scope.selectDataset = function(dataset) {
				$scope.dataset = dataset;
			};
			$scope.okayHandler = function() {
				$scope.showPopup = false;
				$scope.okayCallback();
			};
		}
	};
});