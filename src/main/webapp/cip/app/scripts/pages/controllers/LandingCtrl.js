'use strict';

angular.module('cip.pages')
.controller('LandingCtrl', ['$scope', '$rootScope', 'SessionService', '$location',
	function($scope, $rootScope, SessionService, $location) {

		$rootScope.pageId = 'landing-page';
		$scope.products = SessionService.getUserProducts();

		for(var i = 0; $scope.products.length > i; i++){
			var active = $scope.products[i].active,
				url = $scope.products[i].name.replace(/ /g, '-');

			$scope.products[i].image = 'images/icons/icon-' + url + '.png';
			$scope.products[i].url = active ? '#/dashboard/' + url : '';
		}
	}
]);

