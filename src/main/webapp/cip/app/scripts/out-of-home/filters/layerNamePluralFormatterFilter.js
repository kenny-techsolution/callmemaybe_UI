angular.module('cip.outOfHome').filter('layerNamePluralFormatter', function() {
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
});