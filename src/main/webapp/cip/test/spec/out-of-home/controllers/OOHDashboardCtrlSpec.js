describe('OOHDashboardCtrlSpec', function() {
	'use strict';

	var OOHDashboardCtrl;
	var scope = {}, itemStorage = {};
	var overLay = {
		setShow: $.noop
	};
	var rootScope = {
		globalStatus : {
			jsapiLoaded : false,
			campaignCreated : false,
			product : 'OOH'
		}
	};

	var jsapiHandler = {
		initAPI: $.noop
	};

	beforeEach(inject(function($controller, $rootScope){
		spyOn(overLay, 'setShow').andCallThrough();
		spyOn(jsapiHandler, 'initAPI').andCallThrough();
		OOHDashboardCtrl = $controller('OOHDashboardCtrl', {$scope: scope, $rootScope: rootScope, itemStorage: itemStorage, overLay: overLay, jsapiHandler: jsapiHandler});
	}));

	it('defines the poiModel in the scope', function() {
		expect(scope.poiModel).toBeDefined;
	});

	it('prepares the overLay', function() {
		expect(overLay.dataFileLoaded).toBeTruthy();
		expect(overLay.setShow).toHaveBeenCalledWith(true);
	});

	it('calls jsapiHandler.initAPI function', function() {
		var args = jsapiHandler.initAPI.argsForCall[0];
		expect(jsapiHandler.initAPI).toHaveBeenCalled();
		expect(typeof args[0]).toEqual('function');
		expect(args[1]).toBeTruthy();
	});
});