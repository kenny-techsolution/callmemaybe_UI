app.service('wizardTabsService', function() {
	'use strict';
	this.wizardTabs = {
		tabs : [{
			name : 'Campaign Details',
			template : 'views/outOfHome/campaign-details.html',
			secondaryTabs : {
				tabs : []
			},
			disabled : false
		}, {
			name : 'Locations',
			template : 'views/outOfHome/locations.html',
			secondaryTabs : {
				tabs : [{
					name : 'DMA'
				}, {
					name : 'CBSA'
				}, {
					name : 'County'
				}, {
					name : 'ZIP Code'
				}],
				selected : 0
			},
			disabled : false
		}, {
			name : 'Audience',
			template : 'views/outOfHome/audience.html',
			secondaryTabs : {
				tabs : []
			},
			disabled : true
		}],
		selected : 0,
		tabSelected : 0
	};
});