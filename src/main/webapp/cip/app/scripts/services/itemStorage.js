app.service('itemStorage',['$rootScope', function($rootScope){
	'use strict';
	function checkForStorage(item){
		if (Modernizr.localstorage) {
			if (!localStorage.getItem(item)) {
				return false;
			}
			else{
				return JSON.parse(localStorage.getItem(item));
			}
		}
		else{
			return false;
		}
	}
	var isInited =false;
	var service = {
		charts : {},
		experts : {},
		snapshots : {},
		trends : {},
		product : {},
		actuateSettings : {
			uiopts:undefined,
			width: 350,
			height: 255,
			gutter: 15,
			chartSizes: [ 'n', 'dh', 'dw', 'q' ], //normal, double high, double wide, quad
			getHeight: function(size){
				var ret;
				if(size === 'n' || size === 'dw' || size === ' '){
					ret= this.height;
				}
				else if(size === 'dh' || size === 'q'){
					ret= (this.height*2) + this.gutter;
				}
				return ret;
			},
			getWidth: function(size){
				var ret;
				if(size === 'dh' || size === 'n' || size === ' '){
					ret= this.width;
				}
				else if(size === 'dw' || size === 'q'){
					ret= (this.width*2)+this.gutter;
				}
				return ret;
			}
		},
		getItem : function (item,index, indexIsID, idProperty){
			function findElementIndex(array, attr, value){
				for(var i = 0; i < array.length; i ++) {
					if(array[i][attr] === parseInt(value)) {
						return i;
					}
				}
			}
			var ret;
			switch(item){
				case 'charts':
					ret = this.charts;
					break;
				case 'experts':
					ret = this.experts;
					break;
				case 'snapshots':
					ret = this.snapshots;
					break;
				case 'trends':
					ret = this.trends;
					break;
				case 'product':
					ret = this.product;
					break;
			}
			if(index){
				var hold;
				if(indexIsID){
					hold = findElementIndex(ret, idProperty, index);
				}
				else{
					hold = index;
				}
				return ret[hold];
			}
			else{
				return ret;
			}
		}
	};


	if (isInited === false) {
		var defaults = {
			charts: [
				{
					id: 1,
					active: false,
					icon: 'day-week-icon',
					category: 'When',
					chartID: 'dayOfWeek',
					title: 'Day of Week',
					size: 'n',
					reportName: { VA: '/CIP/DayOfWeek-VA-uu.rptdesign', OOH: '/CIP/DayOfWeek-OOH-uu.rptdesign'},
					chartOptions:{ key: 'dow'},
					customDirective:undefined
				}, {
					id: 2,
					active: false,
					icon: ' has-children-icon',
					category: 'Who',
					chartID: 'ageOfChildren',
					title: 'Children',
					size: 'n',
					reportName: { VA: '/CIP/AgeOfChildren-VA-uu.rptdesign', OOH: '/CIP/AgeOfChildren-OOH-uu.rptdesign'},
					chartOptions:{ key: 'aoc', distributed: true},
					customDirective:undefined
				}, {
					id: 3,
					active: false,
					icon: 'age-icon',
					category: 'Who',
					chartID: 'age-chart',
					title: 'Age',
					size: 'n',
					reportName: { VA: '/CIP/Age-VA-uu.rptdesign', OOH: '/CIP/Age-OOH-uu.rptdesign'},
					chartOptions:{ key: 'age-text'},
					customDirective:undefined
				}, {
					id: 4,
					active: false,
					icon: 'gender-icon',
					category: 'Who',
					chartID: 'gender-chart',
					title: 'Gender',
					size: 'n',
					reportName: { VA: '/CIP/Gender-VA-uu.rptdesign', OOH: '/CIP/Gender-OOH-uu.rptdesign'},
					chartOptions:{ key: 'gender-text'},
					customDirective:undefined
				},
				{
					id: 5,
					active: false,
					icon: 'income-icon',
					category: 'Who',
					chartID: 'income-chart',
					title: 'Income',
					size: 'n',
					reportName: { VA: '/CIP/Income-VA-uu.rptdesign', OOH: '/CIP/Income-OOH-uu.rptdesign'},
					chartOptions:{ key: 'income-text'},
					customDirective:undefined
				},  {
					id: 6,
					active: true,
					icon: 'map-icon',
					category: 'Where',
					chartID: 'map',
					title: 'Map',
					size: 'q',
					reportName: '',
					chartOptions:{ key: ''},
					customDirective:undefined
				}, {
					id: 7,
					active: false,
					icon: 'ethnic-icon',
					category: 'Who',
					chartID: 'ethnicity-chart',
					title: 'Ethnicity',
					size: 'n',
					reportName: { VA: '/CIP/Ethnicity-VA-uu.rptdesign', OOH: '/CIP/Ethnicity-OOH-uu.rptdesign'},
					chartOptions:{ key: 'ethnicity-text'},
					customDirective:undefined
				}, {
					id: 8,
					active: false,
					icon: 'date-range-icon',
					category: 'When',
					chartID: 'daterange',
					title: 'Date Range',
					size: 'dh',
					// todo: change report name to add OOH
					reportName: { percentage: { visits: '/CIP/DateRange-Pct-VA-impr.rptdesign', unique: '/CIP/DateRange-Pct-VA-uu.rptdesign'}, number:{ visits:'', unique:'/CIP/DateRange-Number-VA-uu.rptdesign'} } ,
					chartOptions:{
						percentage: {
							visits: { key: 'daterange', distributed: true},
							unique: { key: 'daterange', distributed: true}
						},
						number:{
							visits:{ key: '', distributed: true},
							unique:{ key: 'daterange', distributed: true}
						}
					} ,

					customDirective:'date-range'
				}, {
					id: 9,
					active: false,
					icon: 'time-day-icon',
					category: 'When',
					chartID: 'timeofday',
					title: 'Time of Day',
					size: 'n',
					reportName: { VA: '/CIP/TimeOfDay-VA-uu.rptdesign', OOH: '/CIP/TimeOfDay-OOH-uu.rptdesign'},
					chartOptions:{ key: 'tod'},
					customDirective:undefined
				},
				//{
					// id: 10,
					// active: false,
					// icon: 'number-people-icon',
					// category: 'Who',
					// chartID: 'numPeopleHousehold',
					// title: '# of People',
					// size: 'n',
					// reportName: '/applications/CIP-Reports/PeopleInHousehold.rptdocument',
					// chartOptions:{ key: ''},
					// customDirective:undefined
				//},
				{
					id: 11,
					active: false,
					icon: 'marital-status-icon',
					category: 'Who',
					chartID: 'marital-status',
					title: 'Married',
					size: 'n',
					reportName: { VA: '/CIP/MaritalStatus-VA-uu.rptdesign', OOH: '/CIP/MaritalStatus-OOH-uu.rptdesign'},
					chartOptions:{ key: 'maritalStatus-text'},
					customDirective:undefined
				}
			],

			experts:[
				{ id: 1, description: 'Name of the first expert opinion goes in this box', timestamp: '2012-04-05T14:30:00Z' },
				{ id: 2, description: 'Name of the second expert opinion goes in this box', timestamp: '2013-07-12T15:00:00Z' },
				{ id: 3, description: 'Name of the third expert opinion goes in this box', timestamp: '2010-07-12T15:00:00Z' }
			],
			snapshots:[
				{ id: 1, description: 'Name of the first snapshot goes in this box', timestamp: '2012-04-05T14:30:00Z' },
				{ id: 2, description: 'Name of the second snapshot goes in this box', timestamp: '2013-07-12T15:00:00Z' },
				{ id: 3, description: 'Name of the third snapshot goes in this box', timestamp: '2010-07-12T15:00:00Z' }
			],
			trends:[
				{ id: 1, description: 'Name of the first trend goes in this box', timestamp: '2012-04-05T14:30:00Z' },
				{ id: 2, description: 'Name of the second trend goes in this box', timestamp: '2013-07-12T15:00:00Z' },
				{ id: 3, description: 'Name of the third trend goes in this box', timestamp: '2010-07-12T15:00:00Z' }
			],
			product:'Select your audience, location and other details about your campaign, then review and customize the campaign we recommend for you.',
			actuateSettings:{
				uiopts:undefined,
				width: 350,
				height: 255,
				gutter: 15,
				chartSizes: [ 'n', 'dh', 'dw', 'q' ], //normal, double high, double wide, quad
				getHeight: function(size){
					var ret;
					if(size === 'n' || size === 'dw' || size === ' '){
						ret= this.height;
					}
					else{
						ret= (this.height*2) + this.gutter;
					}
					return ret;
				},
				getWidth: function(size){
					var ret;
					if(size === 'dh' || size === 'n' || size === ' '){
						ret= this.width;
					}
					else{
						ret= (this.width*2)+this.gutter;
					}
					return ret;
				}
			}
		};

		var arrayValues = {
			'experts':'experts',
			'snapshots':'snapshots',
			'trends':'trends',
			'product':'product',
			'charts':'charts'
		};

		for(var item in arrayValues){
			var curr = checkForStorage(arrayValues[item]);
			if(curr === false){
				service[item] = defaults[arrayValues[item]];
			}
			else{
				service[item] = curr;
			}
		}
		service["setAllChartsInactive"]= function () {
			for(var i = 0; i< service.charts.length;i++){
				service.charts[i]["active"]= false;
			}
		};
		isInited = true;
	}

	return service;
}]);
