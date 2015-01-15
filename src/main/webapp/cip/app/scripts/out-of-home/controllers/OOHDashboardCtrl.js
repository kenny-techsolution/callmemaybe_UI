angular.module('cip.outOfHome').controller('OOHDashboardCtrl', ['$scope', '$rootScope', '$compile', 'itemStorage', 'ENV', 'overLay', 'jsapiHandler',
function($scope, $rootScope, $compile, itemStorage, ENV, overLay, jsapiHandler) {
	'use strict';
	$rootScope.pageId = 'OOH';
	$rootScope.globalStatus.context = 'OOH';

	$scope.poiModel = {
		currentPagePoi : [],
		remainPoi : [],
		allPoi : [],
		selectedPois : [],
		hovered : null
	};

	//skip loading data file
	overLay.dataFileLoaded = true;
	overLay.setShow(true);
	chartWindow.init();

	if ($rootScope.globalStatus.jsapiLoaded === true) {
		itemStorage.setAllChartsInactive();
		overLay.setShow(false, 'jsapi');
		$rootScope.globalStatus.campaignCreated = false;
		setTimeout(function() {
			sidebar.windowResizeHandler();
		}, 200);
		CrossBIRTFilter.reset($rootScope.globalStatus.context);
	} else {
		jsapiHandler.initAPI(function() {
			overLay.setShow(false, 'jsapi');
		}, true);
	}

}]);
