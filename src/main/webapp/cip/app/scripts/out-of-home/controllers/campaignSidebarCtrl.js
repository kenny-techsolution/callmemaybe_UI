angular.module('cip.outOfHome').controller('campaignSidebarCtrl', ['$compile', '$scope', '$rootScope', '$document', 'defaultCampaignForm', 'defaultAudienceForm', 'campaignDateService', 'campaignSelection', 'overLay', 'campaignDetailErrorService', 'popupModalService', 'parametersNotMetPopupService', 'wizardTabsService',
function($compile, $scope, $rootScope, $document, defaultCampaignForm, defaultAudienceForm, campaignDateService, campaignSelection, overLay, campaignDetailErrorService, popupModalService, parametersNotMetPopupService, wizardTabsService) {
	'use strict';
	$scope.form = campaignSelection.campaignDetails;
	$scope.campaignDetailErrorsService = campaignDetailErrorService;
	$scope.globalStatus = $rootScope.globalStatus;
	$scope.cipMap = campaignSelection.cipMap;
	$scope.strip = campaignSelection.strip;
	$scope.sidebar = campaignSelection.sidebar;
	$scope.boardDataSelections = campaignSelection.boardDataSelections;
	$scope.cancelTooltip = {
		isOpen : false
	};

	$scope.resetCampaign = function(isFirstTime) {
		if (!isFirstTime) {
			$scope.strip.clearSearchBoxRequest = true;
			$scope.strip.selectedTabIndex = 0;
			if ($scope.wizardTabs) {
				$scope.wizardTabs.tabs[1].secondaryTabs.selected = 0;
			}
			$scope.cipMap.selectedSecondaryTab = 'DMA';
			if ($scope.cipMap.areas && ($scope.cipMap.areas.length > 0)) {
				$scope.cipMap.areas = [];
			}
			campaignSelection.audiences.primary.form = angular.copy(defaultAudienceForm);
		}
	};
	$scope.resetCampaign(true);
	$scope.$watch('sidebar.isCampaignOpen', function(newValue) {
		if (!newValue) {
			return;
		}
		$scope.resetCampaign(false);
		$scope.sidebar.isCampaignOpen = false;
	});

	// handle closing the selections menu when user clicks outside the menu
	$scope.$watch('boardDataSelections.isOpened', function(newValue) {
		if (newValue) {
			$document.bind('click', clickOutsideBoardDataMenuBind);
		} else {
			$document.unbind('click', clickOutsideBoardDataMenuBind);
		}
	});

	var clickOutsideBoardDataMenuBind = function(event) {
		var isInPopup = event.target.className.indexOf('multi-vendors-menu') > -1 || $('.multi-vendors-menu').find(event.target).length > 0;
		var isBoardDropdown = event.target.className.indexOf('multi-vendors-dropdown') > -1 || $('.multi-vendors-dropdown').find(event.target).length > 0;
		if ($scope.boardDataSelections.isOpened && !isBoardDropdown && !isInPopup) {
			$scope.$apply(function() {
				$scope.boardDataSelections.isOpened = false;
			});
		}
	};

	$scope.openCampaign = function() {
		$scope.sidebar.isCampaignOpen = true;
		$('#campaign').animate({
			left : '0%'
		}, 1000, function() {
			$('.side-bar-tab').hide();
		});
	};

	$scope.closeCampaign = function() {
		$('#campaign').animate({
			left : '-105%'
		}, 1000, function() {
			$('.side-bar-tab').show();
			overLay.setShow(false, 'jsapi');
			$scope.resetCampaign();
			if ($scope.poiModel) {
				$scope.poiModel.selectedPois = [];
			}
		});
	};

	$scope.isCampaignDetailsChanged = function() {
		for (var param in defaultCampaignForm) {
			if($scope.form[param].toString() !== defaultCampaignForm[param].toString()) {
				return true;
			}
		}
		if($scope.cipMap.areas.length > 0 || $scope.poiModel.selectedPois.length > 0) {
			return true;
		}
		for (var param in campaignSelection.audiences.primary.form) {
			if(campaignSelection.audiences.primary.form[param].toString() !== defaultAudienceForm[param].toString()) {
				return true;
			}
		}
		return false;
	};

	$scope.openConfirmation = function(e) {
		e.stopPropagation();
		if($scope.isCampaignDetailsChanged()) {
			$scope.cancelTooltip.isOpen = true;
		} else {
			$scope.cancelCampaign();
		}
	};

	$scope.cancelCampaign = function() {
		$scope.cancelTooltip.isOpen = false;
		$scope.closeCampaign();
		$scope.resetCampaignDetails();
	};

	$scope.resetCampaignDetails = function() {
		for (var param in defaultCampaignForm) {
			$scope.form[param] = defaultCampaignForm[param];
		}
	};

	$scope.submitButtonDisabled = function() {
		return ($scope.campaignDetailErrorsService.errorCount > 0 || $scope.cipMap.areas.length === 0);
	};

	$scope.submitCampaign = function() {
		// todo: because of the way the map code is setup, we need to update the campaign data
		// before calling submitCampaign. Ideally, we need to refactor the cip-map-module
		// to consolidate the data model. Was there a reason not to put these in the cipMap scope?
		if (this.boardDataSelections.isNoneSelected()) {
			popupModalService.showPopup('noVendorOrGroupSelected');
		} else {
			campaignSelection.cipMap.pois = $scope.poiModel.selectedPois;
			overLay.setShow(true);

			campaignSelection.submitCampaign()
			.success(function(data) {
				// check if budget limit reached before parameters were met
				var metricsNotMet = campaignSelection.getMetricsNotMet(data);
				if (metricsNotMet.length > 0) {
					parametersNotMetPopupService.showPopup(metricsNotMet);
					overLay.setShow(false, 'jsapi');
				} else {
					$scope.prepareResultPage();
				}
			})
			.error(function(data, status) {
				$scope.prepareResultPage();
			});
		}
	};

	$scope.doContinue = function() {
		parametersNotMetPopupService.closePopup();
		$scope.prepareResultPage();
	};

	$scope.doGoBack = function() {
		parametersNotMetPopupService.closePopup();
		wizardTabsService.wizardTabs.tabSelected = 2;
	}

	$scope.prepareResultPage = function() {
		if ($('#divDefineCampaign').length !== 0) {
			$('#divDefineCampaign').parent().append($compile('<div campaign-results-panel></div>')($scope));
			$('#divDefineCampaign').remove();
		} else if ($('[campaign-results-panel]').length > 0) {
			var $parent = $('[campaign-results-panel]').parent();
			$('[campaign-results-panel]').remove();
			$('#divDefineCampaign').remove();
			$parent.append($compile('<div campaign-results-panel></div>')($scope));
		}

		//remove existing charts
		chartWindow.removeAllItemsFromCanvas();

		campaignResults = true;

		setTimeout(function() {
			$scope.closeCampaign();
		}, 300);

		var poisArray = campaignSelection.getBoardsFromResult();
		CrossBIRTFilter.setDataFile({
			user : 'demo',
			context : 'OOH',
			locations : JSON.stringify(poisArray)
		});

		//show chart icons in the corner.
		$rootScope.globalStatus.campaignCreated = true;
		$rootScope.globalStatus.createdByPlanner = true;
		$rootScope.globalStatus.createdByStandalone = false;
		$rootScope.$broadcast('add-accordion-panels');
	};
}]);