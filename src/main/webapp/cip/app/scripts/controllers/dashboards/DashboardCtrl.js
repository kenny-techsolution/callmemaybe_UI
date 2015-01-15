app.controller('DashboardCtrl', ['$scope', '$routeParams', '$controller',
	function($scope, $routeParams, $controller) {
	'use strict';

	function buildCtrlName(productName){
		var initials = productName.charAt(0);

		while(productName.indexOf('-') !== -1){
			productName = productName.slice(productName.indexOf('-') + 1);
			initials += productName.charAt(0);
		}

		return initials.toUpperCase() + 'DashboardCtrl';
	}

	var selectedProduct = $routeParams.product,
		ctrlName = buildCtrlName(selectedProduct);

	$controller(ctrlName, {$scope:$scope});

}]);

