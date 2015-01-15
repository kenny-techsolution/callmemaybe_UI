'use strict';

angular.module('cip.outOfHome').directive('parametersNotMetPopup', function() {
	return {
		restrict: 'A',
		transclude: true,
		scope: {
			'continue': '&onContinue',
			'goBack': '&onGoBack'
		},
		templateUrl: 'views/outOfHome/audience-parameters-not-met-popup.html',
		controller: function($scope, parametersNotMetPopupService) {
			$scope.modal = parametersNotMetPopupService;
		}
	};
});