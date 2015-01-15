angular.module('cip.outOfHome').filter('layerNameFormatter', function() {
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
			case 'zip':
			case 'zip code': {
				return 'Zip Code';
			}
		}

	};
})