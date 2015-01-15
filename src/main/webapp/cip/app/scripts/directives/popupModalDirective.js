'use strict';

angular.module('cip').directive('popupModal', function() {
	return {
		restrict: 'A',
		scope: {},
		template: '<div class="modal-popup" ng-show="modal.show"><div class="message-body"><div class="modal-icon"/><div class="modal-text">{{modal.message}}</div><div class="button"><a ng-click="modal.closePopup()" class="btn btn-lg btn-primary" role="button">Okay</a></div></div>',
		controller: function($scope, popupModalService) {
			$scope.modal = popupModalService;
		}
	};
});