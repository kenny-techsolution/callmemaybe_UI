angular.module('strip', ['ui.bootstrap', 'ui.bootstrap.position']).run(['$templateCache',
function($templateCache) {"use strict";
	$templateCache.put('clearSearch', '<svg  width="17" height="17" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">' + '<g>' + '<path d="m14.09998,13.89999l-0.70001,0.7c-0.39996,0.40001 -1,0.40001 -1.39996,0l-2.40002,-2.5l-2.40002,2.5c-0.39996,0.40001 -1,0.40001 -1.39996,0l-0.70001,' + '-0.7c-0.40002,-0.39999 -0.40002,-1 0,-1.39999l2.40002,-2.5l-2.40002,-2.40001c-0.40002,-0.39999 -0.40002,-1 0,-1.39999l0.70001,-0.7c0.39996,-0.40001 1,-0.40001 1.39996,' + '0l2.40002,2.5l2.40002,-2.5c0.39996,-0.40001 1,-0.40001 1.39996,0l0.70001,0.7c0.40002,0.39999 0.40002,1 0,1.39999l-2.40002,2.5l2.40002,2.5c0.40002,0.3 0.29999,' + '0.90001 0,1.3m-4.5,-13.89999c-5.29999,0 -9.59998,4.5 -9.59998,10c0,5.5 4.29999,10 9.59998,10c5.29999,0 9.59998,-4.5 9.59998,-10c0.00006,-5.5 -4.29999,-10 -9.59998,-10"' + ' fill="#666666"/>' + '</g>' + ' </svg>');

	$templateCache.put('grayDropDown', '<svg version="1.1" width="20" height="20"  id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"' + 'viewBox="0 0 16 8" enable-background="new 0 0 12.8 9" xml:space="preserve">' + '<path fill="#666766" d="M5.702,8.523c0,0,0.582,0.813,1.164,0l5.521-7.71c0,0,0.582-0.813-0.418-0.813H0.6c0,0-1,0-0.418,0.813 L5.702,8.523z"/></svg>');
}]).directive('strip', ['$timeout', 'getAreasService', 'filterFilter', '$templateCache', 'wizardTabsService', 'layerNamePluralFormatterFilter',
function($timeout, getAreasService, filterFilter, $templateCache, wizardTabsService, layerNamePluralFormatterFilter) {"use strict";

	return {
		restrict : 'AE',
		templateUrl : './modules/strip/strip-template.html',
		scope : {
			currentTemplate : '=',
			areaSelected : '&',
			cbsaSubTypes : '=',
			areas : '=',
			selectedSecondaryTab : '=',
			clearSearchBoxRequest : '='
		},
		link : function(scope, elem, attrs) {
			scope.withMetro = true;
			scope.withMicro = true;
			scope.loadingAreas = false;
			scope.cbsas = [];

			scope.validZips = [];
			scope.incorrectLengthZips = [];
			scope.duplicatedZips = [];
			scope.prevExistZips = [];
			scope.notFoundZips = [];
			scope.invalidCounty = '';

			scope.checkWrongZips = function(){
				return scope.duplicatedZips.length>0 || scope.prevExistZips.length>0 || scope.notFoundZips.length>0 || scope.incorrectLengthZips.length>0;
			};

			scope.wizardTabs = wizardTabsService.wizardTabs;

			scope.currentTemplate = scope.wizardTabs.tabs[0].template;

			scope.selectedSecondaryTab = 'DMA';

			//controlling the disable state of the tabs.
			scope.$watch('$parent.campaignDetailErrorsService.errorCount', function(newVal, oldVal) {
				scope.wizardTabs.tabs[1].disabled = (newVal > 0) ? true : false;
				scope.wizardTabs.tabs[2].disabled = (scope.areas.length > 0) ? false : true;
			});
			scope.$watch('areas.length', function(newVal, oldVal) {
				scope.wizardTabs.tabs[2].disabled = (newVal === 0) ? true : false;
			});

			scope.$watch('selectedSecondaryTab', function(newVal, oldVal) {

				if (!newVal && !oldVal)
					return;

				if (oldVal) {
					var index = -1;

					$(scope.wizardTabs.tabs[scope.wizardTabs.selected].secondaryTabs.tabs).each(function(idx, tab) {

						if (tab.name === newVal) {
							index = idx;
						}
					});

					if (index >= 0 && index !== scope.wizardTabs.tabs[scope.wizardTabs.selected].secondaryTabs.selected) {

						scope.selectSecondaryTab(index);
					}
				}
			});

			scope.changeTab = function(index) {
				if (!scope.wizardTabs.tabs[index].disabled) {
					scope.wizardTabs.tabSelected = index;
				}
			};

			scope.selectSecondaryTab = function(index) {
				scope.wizardTabs.tabs[scope.wizardTabs.selected].secondaryTabs.selected = index;
				scope.selectedSecondaryTab = scope.wizardTabs.tabs[scope.wizardTabs.selected].secondaryTabs.tabs[scope.wizardTabs.tabs[scope.wizardTabs.selected].secondaryTabs.selected].name;
				scope.clearErrors();
				scope.clearSearch(false);
				scope.clearZipSearch(false);
			};

			scope.$watch('wizardTabs.tabSelected', function(newIndex, oldIndex) {
				if (newIndex === oldIndex) {
					return;
				}
				if (scope.wizardTabs.tabs[newIndex].disabled === true)
					return;
				scope.wizardTabs.selected = newIndex;
				scope.currentTemplate = scope.wizardTabs.tabs[newIndex].template;
				//if the accordion group is already opened, then don't change the state.

			});

			scope.$watch('search', function(newIndex) {
				var $searchInput = $('#ooh-strip-search');
				var $searchEvent = $.Event();
				$searchEvent.target = $searchInput;

				if ($searchInput.is(":focus")) {
                	scope.searchPlaceHolder(false, $searchEvent);
                }else{
                	scope.searchPlaceHolder(true, $searchEvent);
				}
            });

			scope.searchPlaceHolder = function(isOn, evt) {

				var $searchInput = $(evt.target);
				var searchInputModel = angular.element($searchInput).controller('ngModel');
				if (isOn && (!searchInputModel.$viewValue || searchInputModel.$viewValue.trim().length == 0)) {
					if (scope.wizardTabs.tabs[scope.wizardTabs.selected].secondaryTabs.tabs[scope.wizardTabs.tabs[scope.wizardTabs.selected].secondaryTabs.selected]) {
						$(evt.target).attr('placeholder', ' - Type to search ' + layerNamePluralFormatterFilter(scope.wizardTabs.tabs[scope.wizardTabs.selected].secondaryTabs.tabs[scope.wizardTabs.tabs[scope.wizardTabs.selected].secondaryTabs.selected].name.toLowerCase()) + ' -');
                            $timeout(function(){
                                var $dropDown = $searchInput.next('.dropdown-menu');
                                $dropDown.scrollTop(0);
                                $dropDown.hide();
                            },200) ;
						scope.searchDirty = false;
					}
				} else {
					$searchInput.attr('placeholder', '');
					scope.searchDirty = true;

				}

			};

			scope.zipSearchPlaceHolder = function(isOn, evt) {
				var $searchInput = $(evt.target);
				var searchInputModel = angular.element($searchInput).controller('ngModel');
				if (isOn && (!searchInputModel.$viewValue || searchInputModel.$viewValue.trim().length == 0)) {
					$(evt.target).attr('placeholder', ' - Type to search Zip Codes -');
					scope.searchDirty = false;
				} else {
					$searchInput.attr('placeholder', '');
					scope.searchDirty = true;
				}

			};

			scope.poiSearchPlaceHolder = function(isOn, evt) {
				var $searchInput = $(evt.target);
				var searchInputModel = angular.element($searchInput).controller('ngModel');
				if (isOn && (!searchInputModel.$viewValue || searchInputModel.$viewValue.trim().length == 0)) {
                        $(evt.target).attr('placeholder', ' - Type to search POIs -');
                        scope.searchPoiDirty = false;
				} else {
					$searchInput.attr('placeholder', '');
                        scope.searchPoiDirty = true;
				}

			};

			scope.queryAreas = function(val) {
				scope.invalidCounty = '';

				var selectedPrimeTab = scope.wizardTabs.tabs[scope.wizardTabs.selected];
				if ('Locations' === selectedPrimeTab.name) {
					var areaName = selectedPrimeTab.secondaryTabs.tabs[selectedPrimeTab.secondaryTabs.selected].name;
					var filteredAreaType = [];

					switch (areaName) {
						case 'CBSA': {

							angular.forEach(scope.$parent.lists.cbsa, function(item) {
								if ((item.areaType === 'Metro Area' && scope.withMetro) || (item.areaType === 'Micro Area' && scope.withMicro)) {
									filteredAreaType.push(item);
								}
							});
							break;
						}

						case 'DMA': {
							angular.forEach(scope.$parent.lists.dma, function(item) {
								filteredAreaType.push(item);
							});
							break;
						}

						case 'County': {
							angular.forEach(scope.$parent.lists.county, function(item) {
								filteredAreaType.push(item);
							});
							break;
						}
					}
					var filterResults = filterFilter(filteredAreaType, {
						name : val
					});

					if(filterResults.length === 0){
						if(areaName==='County') {
							scope.invalidCounty = val;
						}
					}
					return filterResults;
				}
			};

			scope.$watch('withMetro', function(state) {

				if (!state) {
					scope.withMicro = true;
				}

				if (!scope.cbsaSubTypes)
					scope.cbsaSubTypes = {};
				scope.cbsaSubTypes.metro = state;
			});
			scope.$watch('withMicro', function(state) {

				if (!state) {
					scope.withMetro = true;
				}

				if (!scope.cbsaSubTypes)
					scope.cbsaSubTypes = {};
				scope.cbsaSubTypes.micro = state;
			});

			scope.$watch('clearSearchBoxRequest', function(newValue) {
				if (newValue) {
					if (scope.wizardTabs.selected === 1) {
						scope.clearSearch(false);
						scope.clearZipSearch(false);
						scope.clearSearchBoxRequest = false;
					} else {
						scope.search = '';
						scope.zipSearch = '';
                        scope.clearSearchBoxRequest = null;
					}
				}
			});

			scope.clearErrors = function() {
				scope.validZips = [];
				scope.incorrectLengthZips = [];
				scope.duplicatedZips = [];
				scope.prevExistZips = [];
				scope.notFoundZips = [];
				scope.invalidCounty = '';
			};

			scope.clearSearch = function(focus) {
				var $dropDown = $('#ooh-strip-search').next('.dropdown-menu');

				$dropDown.scrollTop(0);
				scope.search = '';
				$dropDown.hide();

				if (focus) {
					$('#ooh-strip-search').focus();
					scope.searchDirty = true;
				} else {
					$('#ooh-strip-search').attr('placeholder', ' - Type to search ' + scope.wizardTabs.tabs[scope.wizardTabs.selected].secondaryTabs.tabs[scope.wizardTabs.tabs[scope.wizardTabs.selected].secondaryTabs.selected].name + 's -');
					scope.searchDirty = false;
				}
			};

			scope.clearZipSearch = function(focus) {
				scope.zipSearch = '';

				if (focus) {
					scope.searchDirty = true;
					$('#ooh-strip-zip-search').focus();
				} else {
					$('#ooh-strip-zip-search').attr('placeholder', ' - Type to search ' + scope.wizardTabs.tabs[scope.wizardTabs.selected].secondaryTabs.tabs[scope.wizardTabs.tabs[scope.wizardTabs.selected].secondaryTabs.selected].name + 's -');
					scope.searchDirty = false;
				}
			};

			scope.dropdown = function() {

				var searchInput = $('#ooh-strip-search');
				var searchInputModel = angular.element(searchInput).controller('ngModel');
				searchInputModel.$setViewValue(' ');
				$('#ooh-strip-search').focus();
                    scope.searchDirty = true;
				var e = $.Event('keydown');
				e.which = 0;
                    e.target = searchInput;
                    scope.searchPlaceHolder(false, e);
				$('#ooh-strip-search').trigger(e);




			};

			scope.searchResultSelected = function(selectedItem) {
				getAreasService.getLayerById(selectedItem.id).then(function(result) {
					scope.clearSearch(false);
					if (scope.areaSelected) {

						scope.areaSelected({
							area : getAreasService.buildLayerObject(scope.selectedSecondaryTab.toLowerCase(), result)
						});
					}
				});
				//if not correct. then update the error box.
				var $dropDown = $('#ooh-strip-search').next('.dropdown-menu');
				$dropDown.scrollTop(0);

			};

			scope.getZipAreas = function(zips) {
				//reset these array to capture new error zips.
				scope.currentZips= [];
				scope.clearErrors();
				scope.zipSearch = '';
				var wrongZips = [];

				function addToWrongZips(zip) {
					if(wrongZips.indexOf(zip)===-1) {
						wrongZips.push(zip);
					}
					scope.zipSearch = wrongZips.join(',');
				}

				function addNonDupZipToErrorArray(zip, zipArray) {
					if(zipArray.indexOf(zip)===-1) {
						zipArray.push(zip);
						addToWrongZips(zip);
					}
					return zipArray;
				}

				for(var i= 0; i < scope.areas.length; i++){
					if(scope.areas[i].type.substring(0,3) === 'zip'){
						scope.currentZips.push(scope.areas[i].type.substring(4,9));
					}
				}
				for(var i=0; i< zips.length; i++) {
					//check incorrect zip length
					if(zips[i].length !==5){
						scope.incorrectLengthZips = addNonDupZipToErrorArray(zips[i], scope.incorrectLengthZips);
						continue;
					}
					//check duplicate zip for the current input.
					if(scope.validZips.indexOf(zips[i])!==-1){
						scope.duplicatedZips = addNonDupZipToErrorArray(zips[i], scope.duplicatedZips);
						continue;
					}
					//check if zip already exists.
					if(scope.currentZips.indexOf(zips[i])!==-1){
						scope.prevExistZips = addNonDupZipToErrorArray(zips[i], scope.prevExistZips);
						continue;
					}
					scope.validZips.push(zips[i]);
					getAreasService.getLayerById('zip_' + zips[i]).then(function(result) {
						if (scope.areaSelected) {
							scope.areaSelected({
								area : getAreasService.buildLayerObject('zip', result)
							});
						}
					}, function(layerId){
						var zip = layerId.substring(4,9);
						scope.notFoundZips = addNonDupZipToErrorArray(zip, scope.notFoundZips);
					});
				}
			};

			function removeNonZipAreas() {
				var array = scope.areas;
				for (var i = array.length - 1; i >= 0; i--) {
					array.splice(i, 1);
				}
			}

			function scrollIntoView(element, container) {
				var containerTop = $(container).scrollTop();
				var containerBottom = containerTop + $(container).height();
				var elemTop = element.offsetTop;
				var elemBottom = elemTop + $(element).height();
				if (elemTop < containerTop) {
					$(container).scrollTop(elemTop);
				} else if (elemBottom > containerBottom) {
					$(container).scrollTop(elemBottom - $(container).height());
				}

			}


			$('#ooh-strip-search').bind('keydown', function(evt) {

				var $dropDown = $('#ooh-strip-search').next('.dropdown-menu');
				if ($dropDown && ((evt.which != 38) && (evt.which != 40))) {
					$dropDown.find('li').removeClass('active');
					$dropDown.find('li:first').addClass('active');
					$dropDown.scrollTop(0);

				} else {
					var active = $dropDown.find('li.active');
					if (active && active.length > 0)
						scrollIntoView(active[active.length - 1], $dropDown);
				}

			});
		}
	};
}]).directive('zipSearch', ['$compile', '$parse', '$templateCache', 'getAreasService', '$position',
function($compile, $parse, $templateCache, getAreasService, $position) {
	$templateCache.put('template/zip-search/zip-search-popup5.html', "<div class=\"zip-search-dropdown-menu dropdown-menu\" ng-style=\"{display: isOpen()&&'block' || 'none', top: position.top+'px', left: position.left+'px'}\">\n" + "<h4>Please Check Your Zip Codes:</h4>\n" + "<ul >\n" + "    <li ng-show='duplicates && duplicates.length > 0'>Duplicates:{{duplicates.join(', ')}}</li>\n " + "    <li ng-show='exists && exists.length > 0'>Previously added to the map:{{exists.join(', ')}}</li>\n" + "</ul></div>");
	return {
		restrict : 'A',
		require : 'ngModel',
		scope : {
			zipSearch : '=',
			messages : '=',
			duplicates : '=',
			exists : '=',
			onSelect : '&',
			areas : '='

		},
		link : function(originalScope, element, attrs, ngModel) {

			var errorsPopUpEl = angular.element('<zip-search-popup duplicates="duplicates" exists="exists" position="position" ></zip-search-popup>');
			var scope = originalScope.$new();
			var resetMessages = function() {
				scope.duplicates = [];
				scope.exists = [];

			};

			element.bind('keydown', function(evt) {
				scope.$apply(function() {
					if (evt.which === 13) {
						searchZips();
					}
				});
			});

			ngModel.$parsers.push(function(inputValue) {
				if (inputValue == undefined)
					return '';
				//we may need to call this function when implementing the error handling story.
				//resetMessages();
				var formattedInputValue = inputValue;
				var letters = /^[0-9\,]+$/;

				//this function ensure commas are inserted to the right places.
				function autoInsertCommas (inputValue) {
                	var newInputValue = '';
                	var commaDelimitedDigits = inputValue.split(/[ ,]+/);
                    var isValidEndingComma = (inputValue[inputValue.length-1]===',') && (commaDelimitedDigits[commaDelimitedDigits.length-2].length === 5);
                	inputValue = commaDelimitedDigits.join('');
					if(isValidEndingComma) inputValue += ',';
                	for(var i=0; i<inputValue.length; i++) {
                		if((i % 5) === 0 && i !== 0 && inputValue[i] !== ',') {
                			newInputValue += ',' + inputValue[i];
                		} else {
                			newInputValue += inputValue[i];
                		}
                		if((i+1) === inputValue.length) return newInputValue;
                	}
                }

                //1. remove any invalid characters
				if(!formattedInputValue.match(letters)){
					formattedInputValue = formattedInputValue.replace(/[^0-9\,]/g, ' ');
					formattedInputValue = formattedInputValue.split(/[ ,]+/).join(',');
				}

				//2. ensure the input has the right commas
				formattedInputValue = autoInsertCommas(formattedInputValue);

				//3. if formatted input is different than the original input, then overwrite the model's view value.
				if(formattedInputValue === inputValue) {
					return;
				} else {
					ngModel.$setViewValue(formattedInputValue);
					ngModel.$render();
					return;
				}

			});

			function searchZips() {
				var zips = ngModel.$viewValue;

				if (scope.onSelect) {
					scope.onSelect({
						zips : zips.split(",")
					});
				}
				scope.position = $position.position(element);
				scope.position.top = scope.position.top + element.prop('offsetHeight');
			}

			function findDuplicatesInArray(arr) {
				var uniqueList = [], duplicateList = [], l = arr.length;
				$.each(arr, function(i, zip) {
					if ($.inArray(String(zip), uniqueList) === -1) {
						uniqueList.push(String(zip));
					} else {
						duplicateList.push(String(zip));
					}
				});
				return {
					unique : uniqueList,
					duplicate : duplicateList
				};
			}


			element.after($compile(errorsPopUpEl)(scope));
		}
	};
}]).directive('searchErrorPopup', function() {"use strict";
	return {
		restrict : 'E',
		scope : {
			duplicates : '=',
			notFounds : '=',
			incorrectLengths: '=',
			exists : '=',
			checkWrongZips: '=',
			invalidCounty: '='
		},
		replace : true,
		templateUrl : 'template/zip-search/search-error-popup.html',
		link : function(scope, element, attrs) {}
	};

}).directive('letterOnlyInput', function() {
	'use strict';
	return {
		restrict : 'A',
		scope : {
			ngModel : '=',
		},
		link : function(scope, element, attrs) {
			scope.$watch('ngModel', function(newValue, oldValue) {
				if(!newValue){
					return;
				}
				var letters = /^[A-Za-z\s\.\-\,]+$/;
				if(!newValue.match(letters)){
					scope.ngModel = oldValue;
				}
			});
		}
	};
});
