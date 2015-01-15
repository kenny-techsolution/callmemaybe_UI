'use strict';
var msnry = {masonry: function(){return [];}};
if(window.chartWindow) {
	window.chartWindow.msnry = msnry;
	window.chartWindow.initMasonry = $.noop;
} else {
	window.chartWindow = {
		msnry: msnry,
		initMasonry: $.noop
	};
}
var envDomainHandlerMock = {
	getServiceDomain: function() {
		return 'http://127.0.0.1';
	}
};

beforeEach(module('cip.outOfHome', function($provide) {
	$provide.value('envDomainHandler', envDomainHandlerMock);
}));

var ignoreSvgGets = function() {
	beforeEach(inject(function($httpBackend) {
		$httpBackend.whenGET(/^svgs\/*/).respond(200,'');
	}));
};
