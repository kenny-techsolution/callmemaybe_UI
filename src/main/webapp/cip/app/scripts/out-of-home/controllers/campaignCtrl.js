angular.module('cip.outOfHome').controller('campaignCtrl', ['$compile', '$scope', '$rootScope', 'campaignSelection', 'wizardTabsService', 'overLay', 'getAreasService', 'campaignDateService', 'CustomErrorServiceProvider',
function($compile, $scope, $rootScope, campaignSelection, wizardTabsService, overLay, getAreasService, campaignDateService, CustomErrorServiceProvider) {
	'use strict';

	$scope.dateFormat = 'M/d/yyyy';
	$scope.cipMap = campaignSelection.cipMap;
	$scope.strip = campaignSelection.strip;
	$scope.sidebar = campaignSelection.sidebar;

	$scope.wizardTabs = wizardTabsService.wizardTabs;
	$scope.focusStates = {
		'Campaign Dates' : true,
		'Campaign Budget' : false,
		'Campaign Boards' : false,
		'Map Search' : false,
		'Primary Audience' : false,
		'Secondary Audience' : false,
		'Audience Parameters' : false,
		'Target Impressions' : false,
		'Target Unique Reach' : false,
		'Target Frequency' : false
	};
	$scope.lists = {};

	getAreasService.getLayerNames('cbsa', null).then(function(res) {
		$scope.lists.cbsa = res;
	}, function(err) {
		//TODO: handle error
	});
	getAreasService.getLayerNames('dma', null).then(function(res) {
		$scope.lists.dma = res;
	}, function(err) {
		//TODO: handle error
	});
	getAreasService.getLayerNames('county', null).then(function(res) {
		$scope.lists.county = res;
	}, function(err) {
		//TODO: handle error
	});

	$scope.cipMap.onBoundsChanged = function(zoom, bounds) {

		if (!zoom || !bounds) {
			return;
		}

		$scope.cipMap.currentMapBounds = bounds;
		$scope.cipMap.currentMapZoom = zoom;

		var $zoomToSee = $('.cip-map-zoom-to-see');
		var layerName = $scope.cipMap.selectedSecondaryTab.split(' ')[0].toLowerCase();
		if (!inZoomRangeFilter(layerName, zoom)) {
			$zoomToSee.show();
			removeLayersOnStateChange();
			getAreasService.getLayersByBounds(null, null, null, true);
			return;
		} else {
			$zoomToSee.hide();
		}

		layerName = $scope.cipMap.selectedSecondaryTab.split(' ')[0].toLowerCase();

		var subTypes = layerName === 'cbsa' ? $scope.cipMap.cbsaSubTypes : null;

		$scope.cipMap.loadingBounds = true;
		getAreasService.getLayersByBounds(layerName, subTypes, bounds).then(function(areas) {
			var hoverLayers = createHoverLayers(areas);
			$scope.cipMap.loadingBounds = false;
			return hoverLayers;

		}, function(error) {
			$scope.cipMap.loadingBounds = false;
		});
	};
	$scope.$watch('cipMap.selectedSecondaryTab', function(newVal, oldVal) {
		if (!newVal) {
			return;
		}

		if (oldVal !== newVal) {
			removeLayersOnStateChange();
			$scope.cipMap.selectedLayer = null;
			$scope.cipMap.onBoundsChanged($scope.cipMap.currentMapZoom, $scope.cipMap.currentMapBounds);
		}
	});
	var isBoundsRan = false;
	$scope.$watch('cipMap.cbsaSubTypes', function(subTypes) {
		if (!subTypes) {
			return;
		}

		if (!isBoundsRan) {
			isBoundsRan = true;
			return;
		}
		$scope.cipMap.onBoundsChanged($scope.cipMap.currentMapZoom, $scope.cipMap.currentMapBounds);
	}, true);

	$scope.$on('cip:startDragBroadcast', function() {
		$scope.$broadcast('cip-map:poiStartDragBroadcast', null);
	});

	$scope.$on('cip:endDragBroadcast', function() {
		$scope.$broadcast('cip-map:poiEndDragBroadcast', null);
	});

	$scope.cipMap.areaSelected = function(area) {
		var ar = _.find($scope.cipMap.areas, function(a) {
			return a.id === area.id;
		});
		if (ar) {
			$scope.cipMap.areas = _.filter($scope.cipMap.areas, function(area) {
				return area.id != ar.id;
			});
			$scope.cipMap.areas.push(area);
		}
		$scope.cipMap.areas.push(area);
	};

	$scope.cipMap.clickedSeletedArea = function(area) {
		$scope.switchTabNfocusField(1, null);

		var layerName = layerNameFormatterFilter(area.properties.layerType.toLowerCase());
		if ($scope.cipMap.selectedSecondaryTab !== layerName) {
			$scope.cipMap.selectedSecondaryTab = layerName;
		}
		$scope.cipMap.clickedArea = area;

	};

	$scope.cipMap.clickedSelectedPOI = function(poi) {
		$scope.switchTabNfocusField(1, null);
		$scope.cipMap.clickedPoi = poi;
	};

	$scope.template = 'views/outOfHome/campaign.html';
	$scope.campaignDetailsTemplate = 'views/outOfHome/campaign-details.html';

	$scope.strip.isDetailOpen = true;
	$scope.isAudienceOpen = false;
	$scope.dateFormat = 'M/d/yyyy';

	$scope.currentPage = 'location';

	function createHoverLayers(areas) {
		$scope.cipMap.bboxAreas = [];
		if ($scope.cipMap.areas.length > 0) {
			var sArea = _.find(areas, function(area) {
				return area.id === $scope.cipMap.areas[0].id;
			});
			areas.remove(sArea);
		}
		$scope.cipMap.bboxAreas = areas;
	}


	$scope.switchTabNfocusField = function(tabIndex, focusedField) {
		$scope.selectedTabIndex = tabIndex;
		if (!focusedField) {
			return;
		}
		if ($scope.currentFocusedField) {
			$scope.focusStates[$scope.currentFocusedField] = false;
		}
		$scope.focusStates[focusedField] = true;
		$scope.currentFocusedField = focusedField;
	};
	function removeLayersOnStateChange() {
		$scope.cipMap.bboxAreas = [];
	}

	$scope.$watch('strip.selectedTabIndex', function(newIndex) {
		$scope.strip.isDetailOpen = ($scope.strip.isDetailOpen === true) ? true : newIndex === 0;
		$scope.strip.isLocationsOpen = ($scope.strip.isLocationsOpen === true) ? true : newIndex === 1;
		$scope.strip.isAudienceOpen = ($scope.strip.isAudienceOpen === true) ? true : newIndex === 2;
	});
}]).filter('layerNameFormatter', function() {
	'use strict';
	return function(layerName) {
		switch (layerName) {
			case 'cbsa': {
				return 'CBSA';
			}
			case 'dma': {
				return 'DMA';
			}
			case 'county': {
				return 'County';
			}
			case'zip':
			case'zip code': {
				return 'Zip Code';
			}
		}

	};
}).filter('layerDescription', function(layerNameFormatterFilter) {
	'use strict';
	return function(properties) {

		var layerName = layerNameFormatterFilter(properties.layerType.toLowerCase()).toLowerCase();
		switch (layerName) {
			case 'cbsa': {
				return properties.name + ' ' + properties.areaTypeName;
			}
			case 'dma': {
				return properties.name;
			}
			case 'county': {
				return properties.name + ', ' + properties.state;
			}
			case'zip':
			case'zip code': {
				return properties.layerCode;
			}
		}
	};
}).filter('layerNamePluralFormatter', function() {
	'use strict';
	return function(layerName) {
		switch (layerName) {
			case 'cbsa': {
				return 'CBSAs';
			}
			case 'dma': {
				return 'DMAs';
			}
			case 'county': {
				return 'Counties';
			}
			case'zip':
			case'zip code': {
				return 'Zip Codes';
			}
		}

	};
}).filter('inZoomRange', function() {
	'use strict';
	var zoomRanges = {
		'dma' : 4,
		'cbsa' : 6,
		'county' : 7,
		'zip' : 10
	};
	return function(layerName, zoom) {
		return zoomRanges[layerName] < zoom;
	};
}).filter('sortSidebarListFilter', function() {
	'use strict';
	return function(list) {
		if (list.length === 0) {
			return;
		}
		var dma = [];
		var county = [];
		var cbsa = [];
		var zip = [];

		for (var i = 0; i < list.length; i++) {
			switch (list[i].properties.layerType.toLowerCase()) {
				case 'dma': {
					dma.push(list[i]);
					break;
				}
				case 'cbsa': {
					cbsa.push(list[i]);
					break;
				}
				case 'county': {
					county.push(list[i]);
					break;
				}
				case 'zip': {
					zip.push(list[i]);
					break;
				}
			}
		}
		if (dma.length > 0) {
			_.sortBy(dma, function(d) {
				return d.properties.pop;
			});
		}
		if (cbsa.length > 0) {
			_.sortBy(cbsa, function(d) {
				return d.properties.pop;
			});
		}
		if (county.length > 0) {
			_.sortBy(county, function(d) {
				return d.properties.pop;
			});
		}
		if (zip.length > 0) {
			_.sortBy(zip, function(d) {
				return d.properties.pop;
			});
		}
		list = dma.concat(cbsa.concat(county.concat(zip)));
		return list;
	};
});
