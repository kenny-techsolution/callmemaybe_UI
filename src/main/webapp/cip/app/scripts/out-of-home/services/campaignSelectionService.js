angular.module('cip.outOfHome').constant('campaignLookups', {
	'gender' : {
		'1' : 'Men',
		'2' : 'Women',
		'3' : 'Both Genders'
	},
	'genderSort' : ['1', '2', '3'],
	'household' : {
		'1' : 'Households with Children',
		'2' : 'Households without Children',
		'3' : 'Households with or without Children'
	},
	'householdSort' : ['1', '2', '3'],
	'ethnicity' : {
		'1' : 'Caucasian',
		'2' : 'Hispanic',
		'3' : 'East Asian',
		'4' : 'South Asian',
		'5' : 'African-Am',
		'6' : 'Other',
		'7' : 'All Ethnicities'
	},
	'ethnicitySort' : ['1', '2', '5', '3', '4', '6', '7'],
	'income' : {
		'1' : '$0-$20k',
		'2' : '$20k-$40k',
		'3' : '$40k-$75k',
		'4' : '$75k-$125k',
		'5' : '$125k+',
		'6' : 'All Incomes'
	},
	'incomeSort' : ['6', '1', '2', '3', '4', '5'],
	'age' : {
		'1' : '18-23',
		'2' : '24-29',
		'3' : '30-39',
		'4' : '40-49',
		'5' : '50-59',
		'6' : '60-69',
		'7' : '70+',
		'8' : '18+'
	},
	'ageSort' : ['8', '1', '2', '3', '4', '5', '6', '7'],
	'ageOfChild' : {
		'1' : 'None',
		'2' : '0-2',
		'3' : '3-5',
		'4' : '6-10',
		'5' : '11-15',
		'6' : '16-17',
		'7' : 'All Ages',
		'8' : 'Ignore'
	},
	'ageOfChildSort' : ['7', '2', '3', '4', '5', '6']
}).constant('defaultAudienceForm', {
	'gender' : '3',
	'age' : '8',
	'income' : '6',
	'household' : '3',
	'ageOfChild' : '7',
	'ethnicity' : '7'
}).constant('defaultAudienceParameters', {
	'targetImpr' : {name: 'Target Impressions', suffix: "total in 000's", rank: '1st', inputType: 'manual', value: ''},
	'targetReach' : {name: 'Unique Reach', suffix: "total in 000's", rank: '2nd', inputType: 'manual', value: ''},
	'targetFreq' : {name: 'Target Frequency', suffix: "time(s)", rank: '3rd', inputType: 'dropdown', value: ''}
}).service('defaultCampaignForm', ['campaignDateService',
function(campaignDateService) {
	'use strict';

	var defaults = {
		budgetName : 'Budget',
		budgetValue : '',
		campaignLengthOptions : campaignDateService.createDropDownValues(4, 53, 4),
		flexiableByOptions : [1, 2, 3, 4],
		numWeeks : '4',
		flexByWeeks : 1,
		startDate : campaignDateService.getNextMondayFromToday(),
		endDate : campaignDateService.getEndDate(campaignDateService.getNextMondayFromToday(), 4),
		flexibleBy : false,
		default4weeks : true,
		staticBulletins : true,
		digitalBulletins : true
	};
	return defaults;
}]).service('targetAudiences', ['defaultAudienceForm',
function(defaultAudienceForm) {
	'use strict';

	var audiences = {
		'primary' : {
			'title' : 'Primary Audience',
			'canIncludeSecondary' : true,
			'canReset' : true,
			'included' : true,
			'form' : angular.copy(defaultAudienceForm)
		},
		'secondary' : {
			'title' : 'Secondary Audience',
			'canCopy' : true,
			'included' : false,
			'form' : angular.copy(defaultAudienceForm)
		}
	};

	return audiences;
}]).service('campaignSelection', ['targetAudiences', 'defaultCampaignForm', 'defaultAudienceForm', 'defaultAudienceParameters', 'boardDataSelection', '$filter', '$http', 'ENV', 'envDomainHandler', 'campaignDetailErrorService',
function(targetAudiences, defaultCampaignForm, defaultAudienceForm, defaultAudienceParameters, boardDataSelection, $filter, $http, ENV, envDomainHandler, campaignDetailErrorService) {
	'use strict';

	var _this = this;
	var baseUrl = envDomainHandler.getServiceDomain();
	this.errorService = campaignDetailErrorService;
	this.cipMap = {
		areas : [],
		bboxAreas : [],
		hoveredLayer : null,
		hasHoveredArea : false,
		clickedArea : null,
		cbsaSubTypes : null,
		currentMapBounds : null,
		currentMapZoom : null,
		selectedSecondaryTab : null,
		loadingBounds: false,
		clearSearchBoxRequest:false,
		isPOIOpen :false,
		pois: []
	};
	this.strip = {
		clearSearchBoxRequest : null,
		isDetailOpen : true,
		isLocationsOpen:false,
		isAudienceOpen : false,
		selectedTabIndex:0
	};
	this.sidebar = {
		isCampaignOpen:null
	};
	this.campaignDetails = angular.copy(defaultCampaignForm);
	this.audiences = targetAudiences;
	this.audienceParameters = angular.copy(defaultAudienceParameters);
	this.campaignResponseData = undefined;
	this.boardDataSelections = boardDataSelection;

	this.isWithChildren = function(houseHold) {
		return houseHold === '1';
	};

	this.demographicChanged = function() {
		var audience = arguments[0];
		for (var i = 1; i < arguments.length; i++) {
			var demo = arguments[i];
			if (audience.form[demo] !== defaultAudienceForm[demo]) {
				return true;
			}
		}

		return false;
	};

	this.submitCampaign = function() {
		var data = _this.campaignData();
		return $http.post(baseUrl + '/cip-services/ooh/plan-a-campaign/', data)
		.success(function(response, status) {
			_this.campaignResponseData = response;
		})
		.error(function(response, status) {
			_this.campaignResponseData = {
				grossProjection: [],
				primaryProjection: [],
				secondaryProjection: []
			};
			_this.errorService.turnOn('serverError');
		});
	};

	this.campaignData = function() {
		var startDate = $filter('date')(_this.campaignDetails.startDate, 'yyyy-MM-dd');

		var boardTypes = function() {
			var boards = [];
			if (_this.campaignDetails.staticBulletins) {
				boards.push('1');
			}

			if (_this.campaignDetails.digitalBulletins) {
				boards.push('2');
			}

			return boards;
		};

		var prepareAudience = function(audience) {
			var newAudience = angular.copy(audience);
			if (audience.household === '3') {
				newAudience.ageOfChild = '8';
			} else if (audience.household === '2') {
				newAudience.ageOfChild = '1';
			}
			delete newAudience.household;

			return newAudience;
		};

		var getAudienceParameters = function() {
			var params = {};
			$.each(_this.audienceParameters, function(key, val) {
				if (key === 'targetFreq' && val.value.length > 0) {
					params[key] = val.value.substring(1);
				} else {
					if (val.value !== '') {
						params[key] = Number(val.value) * 1000;
					}
				}
			});
			params.filterSequence = _this.getAudienceRankingArray(true) || [];
			return params;
		};

		var pluckAreaIds = function() {
			var ids = [];
			for (var i = 0; i < _this.cipMap.areas.length; i++) {
				ids.push(_this.cipMap.areas[i].id);
			}

			return ids;
		};

		var getGeometries = function() {
			var pois = _this.cipMap.pois;
			var collection = {
				'type': 'GeometryCollection',
				'geometries': []
			};

			for(var i = 0; i < pois.length; i ++) {
				var geometry = {
					'type': 'Circle',
					'coordinates': [pois[i].latLng.lng, pois[i].latLng.lat],
					'radius': Number(pois[i].radius) * 0.017178 //GPS units
				};
				collection.geometries.push(geometry);
			}
			return collection;
		};

		var getAreasThatContainPOIDrop = function() {
			var list = [];
			var pois = _this.cipMap.pois;
			for(var i = 0; i < pois.length; i ++) {
				list.push(pois[i].area.id);
			}
			return list;
		};

		var locations = [];
		var areasWithPOIDrop = getAreasThatContainPOIDrop();
		var poiCollection = getGeometries();
		if (poiCollection.geometries.length > 0) {
			locations.push(poiCollection);
		}

		var areaIds = pluckAreaIds();
		for(var i = 0; i < areaIds.length; i ++) {
			if (areasWithPOIDrop.indexOf(areaIds[i]) === -1) {
				// only add area ids if area has no poi selected
				locations.push(areaIds[i]);
			}
		}

		var data = {
			'location' : locations,
			'audienceParam' : angular.extend({
				'primaryAudience' : prepareAudience(_this.audiences.primary.form)
			}, getAudienceParameters()),
			'campaignParam' : {
				'length' : _this.campaignDetails.numWeeks,
				'startDate' : startDate,
				'boardType' : boardTypes(),
				'budget' : _this.campaignDetails.budgetValue
			}
		};

		if (_this.audiences.secondary.included) {
			data.audienceParam.secondaryAudience = prepareAudience(_this.audiences.secondary.form);
		}

		data.vendors = _this.boardDataSelections.getVendorsArray();
		data.groups = _this.boardDataSelections.getGroupsArray();

		return data;
	};

	this.getBoardsFromResult = function (){
		var poisArray = [];
		if(_this.campaignResponseData){
			var grossProjectionArray = _this.campaignResponseData.grossProjection;
			for(var i=0; i<grossProjectionArray.length;i++) {
				poisArray.push({'fenceId': grossProjectionArray[i].billboard.key[0], 'timeCellId': '201404m'});
			}
		}
		return poisArray;
	};

	this.getAudienceRankingArray = function(activeOnly) {
		var order = ['1st', '2nd', '3rd'];
		var ranking = [];
		for (var i = 0; i < order.length; i ++) {
			$.each(_this.audienceParameters, function(key, e) {
				if (e.rank === order[i]) {
					if (activeOnly && e.value !== '' || !activeOnly) {
						ranking.push(key);
					}
				}
			});
		}
		return ranking;
	};

	this.getMetricsNotMet = function(data) {
		var budget = _this.campaignDetails.budgetValue;
		if (budget !== '') {
			var targetImpr = _this.audienceParameters.targetImpr.value * 1000;
			var targetReach = _this.audienceParameters.targetReach.value * 1000;
			var targetFrequency = _this.audienceParameters.targetFreq.value;

			var impr = 0, reach = 0, freq = 0;
			var metricsNotMet = [];
			var projection = data.grossProjection;

			for (var i = 0; i < projection.length; i ++) {
				impr += projection[i].targetImp;
				reach += projection[i].reach;
				freq += projection[i].freq;
			}

			freq = freq / projection.length;
			if (!isFinite(freq)) {
				freq = 0;
			}

			if (targetImpr !== '' && Number(impr) < Number(targetImpr)) {
				metricsNotMet.push({type: 'number', label: 'Target Impressions', value: targetImpr});
			}
			if (targetReach !== '' && Number(reach) < Number(targetReach)) {
				metricsNotMet.push({type: 'number', label: 'Target Reach', value: targetReach});
			}
			if (targetFrequency !== '' && Number(freq) < Number(targetFrequency.substring(1))) {
				metricsNotMet.push({label: 'Target Frequency', value: targetFrequency + ' time(s)'});
			}
			return metricsNotMet;
		} else {
			return [];
		}
	};
}]);
