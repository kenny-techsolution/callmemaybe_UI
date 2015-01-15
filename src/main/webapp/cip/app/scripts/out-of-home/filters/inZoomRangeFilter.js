angular.module('cip.outOfHome').filter('inZoomRange', function() {
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
});