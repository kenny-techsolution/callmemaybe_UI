//TODO: Split directives into separate js file for small concise files and to lessing merge conflicts
'use strict';
app.directive('chartContainer', ['$timeout', '$compile', 'filterHandler', 'itemStorage', '$rootScope',
function($timeout, $compile, filterHandler, itemStorage, $rootScope) {
	function getChartContainerHTML() {
		var wrapper = $('<div></div>');
		var container = $('<div></div>)').addClass('chartOptionsContainer');
		var caption = $('<div class="caption"><span class="tab-span">Campaign Projection</span></div>');

		container.append($('<div gear-menu ng-click="toggleGearMenu($event)" ng-mouseover="mouseover($event)"" ng-mouseout="mouseout($event)""></div>').addClass('gearIcon'));
		if (campaignResults === false) {

			container.append($('<div reset-filter-arrow ng-click="resetFilterClick()" ng-mouseover="toggleHoverActive($event)" ng-show="filterArrowVisible"></div>').addClass('resetArrow'));
			// if (wrapper.find(caption)) { //commenting this out for now, more pressing defect work needed this iteration
			// 	wrapper.remove(caption);
			// }
		} else if (campaignResults === true) {
			wrapper.append(caption);
		}
		wrapper.append(container);
		wrapper.append($('<div ng-show="getGearMenuVisible()"></div>').addClass('gearBox'));
		var menu = $('<div gear-drop-down ng-show="getGearMenuVisible()"></div>').addClass('chart-drop-down');
		wrapper.append(menu);
		return wrapper.html();
	}

	return {
		restrict : 'A',
		scope : {},
		template : getChartContainerHTML(),
		controller : function($scope) {
			/*****************************************************************************************************************
			 *  variables
			 *****************************************************************************************************************/

			$scope.gearMenuVisible = false;
			$scope.filterArrowVisible = false;
			$scope.linumber = 0;
		},
		link : function(scope, element, attrs) {
			/*****************************************************************************************************************
			 * Gear Menu List Events
			 *****************************************************************************************************************/

			scope.expandedViewClick = function() {
				return;
			};

			scope.compareWithClick = function() {
				return;
			};

			scope.combineWithClick = function() {
				return;
			};

			scope.deleteChartClick = function() {
				var item = itemStorage.getItem('charts', element.attr('chart-container'), true, 'id');
				filterHandler.unsubscribe(item.chartOptions.primary);
				chartWindow.removeItemFromCanvas(element);
				item.active = false;
			};

			scope.resetFilterClick = function() {
				CrossBIRTFilter.clearWidgetFilter(element.find('.innerContainer').attr('id'));
				return;
			};

			scope.limouseover = function(number) {
				scope.linumber = number;
			};

			scope.limouseout = function() {
				scope.linumber = 0;
			};

			scope.getDropDownHoverClass = function() {
				return 'dropdown-icon' + scope.linumber + '-selected';
			};

			/*****************************************************************************************************************
			 *  Gear Icon Events
			 *****************************************************************************************************************/

			scope.toggleGearMenu = function($event) {
				if (element.hasClass('gearIcon')) {
					element.addClass('gearIconActive');
					element.removeClass('gearIcon');
				} else if (element.hasClass('gearIconActive')) {
					element.addClass('gearIcon');
					element.removeClass('gearIconActive');
				}

				scope.gearMenuVisible = !scope.gearMenuVisible;
			};

			scope.getGearMenuVisible = function() {
				return scope.gearMenuVisible;
			};

			/*****************************************************************************************************************
			 *  updates
			 *****************************************************************************************************************/

			scope.updateFilterArrow = function(visible) {
				scope.filterArrowVisible = visible;
				if (scope.$$phase === null && $rootScope.$$phase === null) {
					scope.$apply();
				}
			};

			element.addClass('chartContainer');
			if (campaignResults === true) {
				element.addClass('campaign-projection');
			}
			if (attrs.chartContainer !== -1 && attrs.chartContainer !== undefined) {
				var options = itemStorage.getItem('charts', parseInt(attrs.chartContainer), true, 'id');

				//update filterHandler to show/hide the filter arrow
				filterHandler.subscribe(options.chartOptions.key, scope.updateFilterArrow);

				if (options.customDirective !== undefined) {
					if (options.customDirective === 'date-range') {
						element.addClass('bordered');
						//TODO: this will have to be updated when the dates are dynamic
						scope.currentView = new Date(2014, 4, 10);
						scope.itemStorageID = attrs.chartContainer;
						element.append($compile('<div '+options.customDirective+' date="currentView" arrayid="itemStorageID"></div>')(scope));
					}
				}

				var crossBirtCopy = angular.copy(itemStorage.actuateSettings.crossBirtWidgetOptions);
				crossBirtCopy = $.extend(crossBirtCopy, options.chartOptions);

				var w = itemStorage.actuateSettings.getWidth(options.size);
				var h = itemStorage.actuateSettings.getHeight(options.size);
				element.css({
					'width' : w + 'px',
					'height' : h + 'px'
				});

				crossBirtCopy.width = w + 'px';
				crossBirtCopy.height = h + 'px';

				options.containerCount = (options.containerCount === undefined) ? 0 : options.containerCount;
				var tempID = options.chartID + (options.containerCount++);
				element.addClass(options.chartID);
				element.append($('<div></div>').attr('id', tempID).addClass('innerContainer'));

				if (options.chartId !== 'daterange' && !$.isEmptyObject(options.reportName) && options.customDirective === undefined) {
					$timeout(function() {
						CrossBIRTFilter.createWidget(tempID, options.reportName[$rootScope.globalStatus.context], crossBirtCopy);
					}, 0, false);
				}
			}
		}
	};
}]).directive('resetFilterArrow', function() {
	return {
		link : function(scope, element, attrs) {

		}
	};
}).directive('gearMenu', function() {
	return {
		link : function(scope, element, attrs) {

		}
	};
}).directive('gearDropDown', function() {
	return {
		templateUrl : 'views/partials/ChartDropdownTemplate.html',
		link : function(scope, element, attrs) {

		}
	};
}).directive('campaignDropdown', ['campaignLookups',
function(campaignLookups) {
	return {
		restrict : 'E',
		replace : false,
		templateUrl : 'views/outOfHome/campaign-dropdown.html',
		scope : {
			type : '=type',
			container : '=container',
			classes : '=classes',
			hideLessThan : '=hideLessThan',
			resets : '=resets',
			shouldFocus : '='
		},
		link : function($scope) {
			$scope.lookups = campaignLookups;

			$scope.onSelect = function(val, container, type, resets) {
				container.form[type] = val;

				if (resets) {
					container.form[resets] = $scope.$parent.defaultForm[resets];
				}
			};

			$scope.shouldHide = function(choice, selected) {
				// logic will change when we get list of values from a service,
				// but for now it's to handle text like 'to $15K'
				var getInt = function(string) {
					return parseInt(string.replace(/\D+/g, ''));
				};
				var choiceInt = getInt(choice);

				if (selected === undefined || isNaN(choiceInt)) {
					return false;
				} else {
					var selectedInt = getInt(selected);
					return (isNaN(selectedInt)) ? true : (choiceInt <= selectedInt);
				}
			};
		}
	};
}]).directive('focusWhen', function() {
	return {
		restrict : 'A',
		link : function($scope, $element, attrs) {
			$scope.$watch(attrs.focusWhen, function(currentValue, previousValue) {
				if (currentValue === true) {
					$element[0].focus();
				} else if (currentValue === false && previousValue) {
					$element[0].blur();
				}
			});
		}
	};
}).directive('scrollBoxShadow', function() {
	return {
		restrict : 'A',
		transclude : true,
		template : '<div class="shadow-box" ng-transclude></div>',
		link : function(scope, element, attrs) {

			var addShadows = function() {
				setTimeout(function() {
					if (element.find('.shadow-box > div')[0].scrollHeight > element.find('.shadow-box').outerHeight()) {
						element.find('.shadow.bottom').fadeIn(150);
					}
				}, attrs.delay || 0);
			};

			addShadows();
			element.append('<div class="shadow top"></div><div class="shadow bottom"></div>');

			$('.shadow-box').on('scroll', function() {
				var y = $(this).scrollTop(),
					posDiff = $(this)[0].scrollHeight - y;

				if (y === 0) {
					$(this).parent().find('.shadow.top').fadeOut(150);
				} else if (y > 0) {
					$(this).parent().find('.shadow.top').fadeIn(150);
				}

				if ($(this).height() === posDiff) {
					$(this).parent().find('.shadow.bottom').fadeOut(150);
				} else {
					$(this).parent().find('.shadow.bottom').fadeIn(150);
				}
			});
		}
	};
}).directive('chartIcon', ['$compile', 'itemStorage',
function($compile, itemStorage) {
	return {
		restrict : 'A',
		templateUrl : 'views/partials/iconTemplate.html',
		scope : {},
		controller : ['$scope', '$rootScope',
		function($scope, $rootScope) {
			$scope.IconClick = function() {
				//temporary disable time related charts for ooh
				var disabledChartIDs = [1, 8, 9];
				if ($rootScope.globalStatus.context === 'OOH' && disabledChartIDs.indexOf($scope.chartid) !== -1) {
					return;
				}

				var curr = itemStorage.getItem('charts', $scope.chartid, true, 'id');
				if (curr.active === false) {
					var elem;
					if (curr.chartID === 'map') {
						elem = $compile('<cip-map class="chartContainer" height="525" width="715" on-bounds-changed="cipMap.onBoundsChanged(zoom, bounds)" billboards="cipMap.billboards" style="z-index: 100"></cip-map>')($scope);
					} else {
						elem = $compile($('<div chart-container='+$scope.chartid+'></div>'))($scope);
					}
					elem.addClass('chartContainer');

					var size = itemStorage.getItem('charts', $scope.chartid, true, 'id').size;
					chartWindow.addItemToCanvas(elem, size);
					curr.active = true;
					//TODO: update local storage on add. below is scaffolding, not quite working.
					//setItem('charts', curr, findElementIndex(getItem('charts'), 'id', id) , false);

				}
			};

			$scope.isChartActive = function() {
				var curr = itemStorage.getItem('charts', $scope.chartid, true, 'id');
				return curr.active;
			};

			$scope.cipMap = {
				billboards : null
			};
		}],
		link : function(scope, element, attrs) {
			var options = itemStorage.getItem('charts', parseInt(attrs.chartIcon), true, 'id');
			scope.title = options.title;
			scope.chartid = options.id;
			element.find('.icon').addClass(options.icon);
		}
	};
}]).directive('cipFocusAsync', ['$parse',
function($parse) {
	return {
		compile : function($element, attr) {
			var fn = $parse(attr.cipFocusAsync);
			return function(scope, element) {
				element.on('focus', function(event) {
					scope.$evalAsync(function() {
						fn(scope, {
							$event : event
						});
					});
				});
			};
		}
	};
}]).directive('cipBlurAsync', ['$parse',
function($parse) {
	return {
		compile : function($element, attr) {
			var fn = $parse(attr.cipBlurAsync);
			return function(scope, element) {
				element.on('blur', function(event) {
					scope.$evalAsync(function() {
						fn(scope, {
							$event : event
						});
					});
				});
			};
		}
	};
}]).directive('cipDraggable', function() {
	return function(scope, element) {
		// this gives us the native JS object
		var el = element[0];

		el.draggable = true;

		el.addEventListener('dragstart', function(e) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('Text', this.id);
			this.classList.add('drag');
			scope.$emit('cip:startDragBroadcast', null);
			return false;
		}, false);

		el.addEventListener('dragend', function(e) {
			this.classList.remove('drag');
			scope.$emit('cip:endDragBroadcast', null);
			return false;
		}, false);
	};
}).directive('cipDroppable', function() {
	return {
		scope : {
			drop : '&' // parent
		},
		link : function(scope, element) {
			var el = element[0];
			el.addEventListener('dragover', function(e) {
				e.dataTransfer.dropEffect = 'move';
				// allows us to drop
				if (e.preventDefault)
					e.preventDefault();
				this.classList.add('over');
				return false;
			}, false);
			el.addEventListener('dragenter', function(e) {
				this.classList.add('over');
				return false;
			}, false);

			el.addEventListener('dragleave', function(e) {
				this.classList.remove('over');
				return false;
			}, false);
			el.addEventListener('drop', function(event) {
				// Stops some browsers from redirecting.

				if (event.stopPropagation)
					event.stopPropagation();

				this.classList.remove('over');

				var item = document.getElementById(event.dataTransfer.getData('Text'));
				if (item)
					this.appendChild(item);

				// call the drop passed drop function
				scope.$apply(function() {
					scope.drop({
						evt : event
					});
				});
				return false;
			}, false);
		}
	};
});

