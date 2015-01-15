angular.module('cip.outOfHome').filter('sortSidebarListFilter', function() {
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
			})
		}
		if (cbsa.length > 0) {
			_.sortBy(cbsa, function(d) {
				return d.properties.pop;
			})
		}
		if (county.length > 0) {
			_.sortBy(county, function(d) {
				return d.properties.pop;
			})
		}
		if (zip.length > 0) {
			_.sortBy(zip, function(d) {
				return d.properties.pop;
			})
		}
		list = dma.concat(cbsa.concat(county.concat(zip)));
		return list;
	}
});