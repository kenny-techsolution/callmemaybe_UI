angular.module('cip.outOfHome').controller('locationCtrl', ['$scope', 'campaignSelection','getAreasService', 'inZoomRangeFilter', 'layerNameFormatterFilter',
function($scope, campaignSelection, getAreasService, inZoomRangeFilter, layerNameFormatterFilter) {
	'use strict';
	$scope.cipMap = campaignSelection.cipMap;
	$scope.strip = campaignSelection.strip;

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

	function removeLayersOnStateChange() {
		$scope.cipMap.bboxAreas = [];
	}

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

}]);