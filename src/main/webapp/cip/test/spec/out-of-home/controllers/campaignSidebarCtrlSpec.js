describe('campaignSidebarCtrl', function() {
	'use strict';

	var campaignSidebarCtrl;
	var overLayMock = {};
	var scope = { $watch: $.noop, errorService: {} };
	var popupModalServiceMock = {};
	var parametersNotMetPopupServiceMock = {
		closePopup: $.noop
	};
	var wizardTabsServiceMock = {
		wizardTabs: { tabSelected: 0 }
	};

	beforeEach(inject(function($controller) {
		campaignSidebarCtrl = $controller('campaignSidebarCtrl',
			{
				$scope: scope,
				overLay: overLayMock,
				popupModalService: popupModalServiceMock,
				parametersNotMetPopupService: parametersNotMetPopupServiceMock,
				wizardTabsService: wizardTabsServiceMock
			});
	}));

	it('defines the form within the $scope', function() {
		expect(scope.form).toBeDefined();
	});

	describe('submitButtonDisabled function', function() {
		it('initially returns true because map has no location selected', function() {
			expect(scope.submitButtonDisabled()).toBeTruthy();
		});

		it('returns false if map has a location', function() {
			scope.cipMap.areas.push("foo");
			expect(scope.submitButtonDisabled()).toBeFalsy();
		});

		it('returns true if there are any errors', function() {
			scope.errorService.errorCount = 9;
			expect(scope.submitButtonDisabled()).toBeTruthy();
			scope.errorService.errorCount = 0;
		});
	});

	describe('doContinue', function() {
		beforeEach(function() {
			spyOn(parametersNotMetPopupServiceMock, 'closePopup').andCallThrough();
			spyOn(scope, 'prepareResultPage');
			scope.doContinue();
		});
		it('closes the popup', function() {
			expect(parametersNotMetPopupServiceMock.closePopup).toHaveBeenCalled();
		});
		it('prepares the result page', function() {
			expect(scope.prepareResultPage).toHaveBeenCalled();
		});
	});

	describe('doGoBack', function() {
		beforeEach(function() {
			spyOn(parametersNotMetPopupServiceMock, 'closePopup').andCallThrough();
			spyOn(scope, 'prepareResultPage');
			scope.doGoBack();
		});
		it('closes the popup', function() {
			expect(parametersNotMetPopupServiceMock.closePopup).toHaveBeenCalled();
		});
		it('redirects to Audience tab by setting the value in the wizardTabsService', function() {
			expect(wizardTabsServiceMock.wizardTabs.tabSelected).toEqual(2);
		});
	});
});