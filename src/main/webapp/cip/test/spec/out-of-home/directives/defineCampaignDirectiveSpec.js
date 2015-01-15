describe('defineCampaignDirective', function() {
	'use strict';
	var elm, scope;
	ignoreSvgGets();
	beforeEach(inject(function($rootScope, $compile) {
		scope = $rootScope;
		scope.product = 'my fantastic product';

		elm = angular.element('<div class="header"><h3>OUT OF HOME</h3>' +
			'<div class="nav-panel-tabs"><div class="slider">' +
				'<ul class="nav">' +
					'<li class="active" data-tab-id="define-campaign"><span>Define a Campaign</span></li>' +
				'</ul>' +
			'</div></div></div>' +
			'<div class="tabs-container" data-scroll-box-shadow>' +
				'<div class="tab-content"><div id="define-campaign" class="tab active">' +
				'<h4>Start a New Campaign</h4><p>{{product}}</p>' +
				'<div class="buttons">' +
					'<a ng-click="openCampaign()" class="btn btn-lg btn-primary" role="button">Define Campaign</a>' +
			'</div></div></div></div>');

		
		$compile(elm)(scope);
		scope.$digest();
	}));

	it('should display the product information from the scope', function() {
		expect(elm.find('#define-campaign p.ng-binding').text()).toBe('my fantastic product');
	});

	it('should call openCampaign when you click on the "Define Campaign" button', function() {
		scope.openCampaign = $.noop;
		spyOn(scope, 'openCampaign').andCallThrough();
		elm.find('.buttons > .btn').click();
		expect(scope.openCampaign).toHaveBeenCalled();
	});
});