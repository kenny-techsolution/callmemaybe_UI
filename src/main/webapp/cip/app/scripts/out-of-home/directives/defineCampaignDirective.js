angular.module('cip.outOfHome').directive('defineCampaign', ['$rootScope', 'pickYourOwnBoards',
function($rootScope, pickYourOwnBoards) {
	'use strict';
	return {
		restrict : 'A',
		templateUrl : 'views/partials/defineCampaign.html',
		link : function(scope, element) {
			element.attr('id', 'divDefineCampaign');
			scope.pickYourOwn = pickYourOwnBoards;
		}
	};
}]);