app.directive('dateRange',['$timeout','itemStorage','$compile',function($timeout,itemStorage, $compile){
	'use strict';

	function getChartHTML(){
		var wrapper = $('<div></div>');

		var bottom = $('<div></div>').addClass('date-range-bottom');
		var bottom1 = $('<div></div>').addClass('date-range-top-section');
		var burgerBox = $('<a ng-click="burgerButtonClicked()" ng-class="{ active: burgerButtonActive }"></a>').addClass('burger-box');

		bottom1.append(burgerBox);
		var textWrapper = $('<div class="text-wrapper"></div>');
		textWrapper.append($('<span>{{currentView}}</span>'));
		bottom1.append(textWrapper);
		bottom.append(bottom1);
		bottom.append($('<hr/>'));

		var bottom2 = $('<div><div>{{bottomText}}</div></div>').addClass('date-range-bottom-section');
		bottom.append(bottom2);
		wrapper.append(bottom);
		return wrapper.html();
	}

	return {
		restrict: 'A',
		template:getChartHTML(),
		scope:{
			date:'=',
			arrayid: '='
		},
		controller:function($scope){
			function getDateString(date){
				var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
				return monthNames[date.getMonth()] +' '+ date.getFullYear();
			}
			$scope.initialized = false;
			$scope.currentView = '';
			$scope.bottomText = getDateString($scope.date);

			$scope.updateClick = function(){
				$scope.getCurrentView();
			};

			$scope.pointClick = function(input){
				if(input === 'visits'){
					$scope.popOverOptions[0].checked = true;
					$scope.popOverOptions[1].checked = false;
				}
				else if(input === 'unique'){
					$scope.popOverOptions[0].checked = false;
					$scope.popOverOptions[1].checked = true;
				}
				else if(input === 'number'){
					$scope.popOverOptions[0].disabled = true;
					$scope.popOverOptions[0].checked = false;
					$scope.popOverOptions[1].checked = true;
					$scope.popOverOptions[4].checked = true;
					$scope.popOverOptions[5].checked = false;
				}
				else if(input === 'percWeek'){
					$scope.popOverOptions[0].disabled = false;
					$scope.popOverOptions[4].checked = false;
					$scope.popOverOptions[5].checked = true;
				}
				else if(input === 'percYear'){

				}
			};

			$scope.burgerButtonActive = false;
			$scope.burgerButtonClicked = function(){
				$scope.burgerButtonActive = !$scope.burgerButtonActive;
			};

			$scope.popOverOptions = [
				{
					type:'point',
					content: 'Visits',
					data: 'visits',
					group:'one',
					disabled: true,
					checked: false
				},
				{
					type:'point',
					content: 'Unique Visitors',
					data: 'unique',
					group:'one',
					disabled: false,
					checked: true
				},
				{
					type:'line',
					data: 'dotted'
				},
				{
					type:'text',
					content: 'Show:',
					data: ''
				},
				{
					type:'point',
					content: 'Number',
					data: 'number',
					group:'two',
					disabled: false,
					checked: true
				},
				{
					type:'point',
					content: '% Change (from Previous Week)',
					data: 'percWeek',
					group:'two',
					disabled: false,
					checked: false
				},
				{
					type:'point',
					content: '% Change (from Previous Year)',
					data: 'percYear',
					group:'two',
					disabled: true,
					checked: false
				},
				{
					type:'line',
					data: 'solid'
				},
				{
					type:'button',
					content: 'Update',
					data: 'updateClick()',
					disabled: false
				}
			];

			$scope.getCurrentView = function(){
				var ret = '';
				var selections = {
					visits:false,
					unique:false,
					number:false,
					percWeek:false,
					percYear:false
				};

				if($scope.popOverOptions[4].checked === true){
					ret += $scope.popOverOptions[4].content + ' of ';
					selections[$scope.popOverOptions[4].data] = true;
				}
				else if($scope.popOverOptions[5].checked === true){
					ret += $scope.popOverOptions[5].content + ' of ';
					selections[$scope.popOverOptions[5].data] = true;
				}
				if($scope.popOverOptions[0].checked === true){
					ret += $scope.popOverOptions[0].content;
					selections[$scope.popOverOptions[0].data] = true;
				}
				else{
					ret += $scope.popOverOptions[1].content;
					selections[$scope.popOverOptions[1].data] = true;
				}
				$scope.switchViews(selections);
				$scope.currentView = ret;
			};
		},
		link:function(scope, element, attrs){
			function getHTMLStringFromObject(input){
				return input.wrap('<div></div>').parent().html();
			}

			function getPopoverContent(){
				var list = $('<ul></ul>');

				for(var i = 0; i < scope.popOverOptions.length; i++){
					var curr = scope.popOverOptions[i];
					var ele;
					if(curr.type === 'point'){
						var p = $('<li></li>');
						var c = $('<input type="radio"></input>');
						c.attr('id','opt'+i);
						c.attr('ng-click','pointClick("'+curr.data+'")');
						c.attr('name',curr.group);
						c.attr('ng-disabled', 'popOverOptions['+i+'].disabled');
						c.attr('ng-checked','popOverOptions['+i+'].checked');

						p.append(c);
						p.append($('<label ng-class="{inactive: popOverOptions['+i+'].disabled}"></label>').text(curr.content).attr('for','opt'+i));
						list.append(p);

					}
					else if(curr.type === 'line'){
						ele = $('<hr />');
						ele.addClass(curr.data);
						list.append($('<li></li>').append(ele));
					}
					else if(curr.type === 'text'){
						ele = $('<span></span>').text(curr.content);
						list.append($('<li></li>').append(ele));
					}
					else if(curr.type === 'button'){
						ele = $('<button type="button" ng-click="'+ curr.data+'"></button>');
						ele.addClass('btn btn-primary');
						ele.html(curr.content);
						list.append($('<li></li>').append(ele));
					}
				}
				return list.prop('outerHTML');
			}

			function updateParentContainer(options, deleteWidget){
				var curr = element;
				//look for parent with chartContainer class
				while(curr.hasClass('chartContainer') === false){
					curr = element.parent();
				}
				curr = curr.find('.innerContainer');
				options.containerCount = (options.containerCount === undefined) ? 0 : options.containerCount;
				var tempID = options.chartID + (options.containerCount++);

				if(deleteWidget === true){
					CrossBIRTFilter.deleteWidget(curr.attr('id'));
				}

				curr.attr('id', tempID);
				return tempID;
			}

			scope.switchViews = function(selections){
				//firsr hide popover
				element.find('.burger-box').popover('hide');
				scope.burgerButtonActive = false;

				//get chart info
				var options = itemStorage.getItem('charts', parseInt(scope.arrayid), true, 'id');


				//decide what chart to load
				var reportLocation;
				var chartSettings;
				if(selections.number === true){
					if(selections.unique === true){
						reportLocation = options.reportName.number.unique;
						chartSettings = options.chartOptions.number.unique;
					}
					else if(selections.visits === true){
						reportLocation = options.reportName.number.visits;
						chartSettings = options.chartOptions.number.visits;
					}
				}
				else if(selections.percWeek === true){//
					if(selections.unique === true){
						reportLocation = options.reportName.percentage.unique;
						chartSettings = options.chartOptions.percentage.unique;
					}
					else if(selections.visits === true){
						reportLocation = options.reportName.percentage.visits;
						chartSettings = options.chartOptions.percentage.visits;
					}
				}

				//load crossbirtfilter options
				var crossBirtCopy = angular.copy(itemStorage.actuateSettings.crossBirtWidgetOptions);
				
				crossBirtCopy = $.extend(crossBirtCopy,chartSettings);
				
				//get width of the chart and update crossBirtCopy
				var w = itemStorage.actuateSettings.getWidth(options.size);
				var h = itemStorage.actuateSettings.getHeight(options.size);
				crossBirtCopy.width = w+'px';
				crossBirtCopy.height = h+'px';

				if(reportLocation !== undefined){
					$timeout(function() {
						//change parent element's ID, and grab it for the crossBirtFilter framework
						var tempID;
						if(scope.initialized === true){
							tempID= updateParentContainer(options,true);
						}
						else{
							tempID= updateParentContainer(options,false);
							scope.initialized = true;
						}
						CrossBIRTFilter.createWidget(tempID, reportLocation, crossBirtCopy );
					}, 0, false);
				}
			};

			var popover = {
				html:true,
				placement:'bottom',
				trigger:'click',
				content: $compile(getPopoverContent())(scope)
			};

			element.find('.burger-box').popover(popover);
			scope.getCurrentView();
		}
	};
}]);