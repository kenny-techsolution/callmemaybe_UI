angular.module('cip.outOfHome').directive('campaignResultsPanel', ['itemStorage', '$compile', 'campaignLookups', 'campaignDateService', 'campaignSelection', 'defaultAudienceForm', 'pickYourOwnBoards',
function(itemStorage, $compile, campaignLookups, campaignDateService, campaignSelection, defaultAudienceForm, pickYourOwnBoards) {
	'use strict';
	return {
		restrict : 'A',
		scope : {},
		templateUrl : 'views/partials/CampaignResults.html',
		controller : ['$scope', '$http', '$filter',
		function($scope, $http, $filter) {
			$scope.errorService = campaignSelection.errorService;

			function fillAudienceInfo(board) {
				$scope.toggleProjectionMenu();
				//first find board in gross
				var gross, i, curr;
				for ( i = 0; i < campaignSelection.campaignResponseData.grossProjection.length; i++) {
					curr = campaignSelection.campaignResponseData.grossProjection[i];
					if (curr.billboard.key[0] === board.key[0]) {
						gross = curr;
						break;
					}
				}

				//next if primary exists get that
				var primary;
				if (campaignSelection.campaignResponseData.primaryProjection.length !== 0) {
					for ( i = 0; i < campaignSelection.campaignResponseData.primaryProjection.length; i++) {
						curr = campaignSelection.campaignResponseData.primaryProjection[i];
						if (curr.billboard.key[0] === board.key[0]) {
							primary = curr;
							break;
						}
					}
				}

				//next if secondary exists get that
				var secondary;
				if (campaignSelection.campaignResponseData.secondaryProjection.length !== 0) {
					for ( i = 0; i < campaignSelection.campaignResponseData.secondaryProjection.length; i++) {
						curr = campaignSelection.campaignResponseData.secondaryProjection[i];
						if (curr.billboard.key[0] === board.key[0]) {
							secondary = curr;
							break;
						}
					}
				}
				var assignValues = function(audience, projection) {
					for (var j = 0; j < audience.display.length; j ++) {
						var display = audience.display[j];
						display.value = (projection === undefined) ? 0 : projection[display.lookup];
						if (display.lookup === 'freq') {
							display.value = (projection['targetImp'] / projection['reach']).toFixed(1);
						}
					}
				};

				assignValues($scope.grossAudience, gross);


				if (primary !== undefined) {
					assignValues($scope.primaryAudience, primary);
				}

				if (secondary !== undefined) {
					assignValues($scope.secondaryAudience, secondary);
				}
				cleanupValues();
			}

			function dollarifyNumber(number, trimDecimal) {
				return '$' + prettifyNumber(number, trimDecimal);
			}

			function prettifyNumber(number, trimDecimal) {
				var num = '';
				var decimal = '';

				if (number.toString().indexOf('.') !== -1) {
					num = number.toString().substring(0, number.toString().indexOf('.'));
					decimal = number.toString().substring(number.toString().indexOf('.'), number.length);
				} else {
					num = number.toString();
				}

				if (num.length > 3) {
					var pos = num.length - 3;
					while (pos > 0) {
						num = num.split('');
						num.splice(pos, 0, ',');
						num = num.join('');
						pos = pos - 3;
					}
				}
				var ret = (trimDecimal === true) ? num : num.concat(decimal);
				return ret;
			}

			function impressions(imp) {
				var ret = parseInt(imp);
				var unitsArray = [{
					cap : 1000000,
					divisor : 1000,
					unit : 'K'
				}, {
					cap : 1000000000,
					divisor : 1000000,
					unit : 'M'
				}, {
					cap : Number.POSITIVE_INFINITY,
					divisor : 1000000000,
					unit : 'B'
				}];

				var currUnit;
				for (var i = 0; i < unitsArray.length; i++) {
					currUnit = unitsArray[i];
					if (ret < currUnit.cap) {
						ret = ret / currUnit.divisor;
						ret = Math.round(ret * 10) / 10;
						ret = ret.toFixed(1);

						if (ret >= 1000 && currUnit !== 'B') {
							ret = parseInt(imp);
							continue;
						}
						break;
					}
				}

				return ret + currUnit.unit + ' imps.';
			}

			function cleanupValues(section) {
				function clean(audience) {
					for (var j = 0; j < audience.display.length; j ++) {
						var display = audience.display[j];
						if (display.pretty) {
							display.value = prettifyNumber(display.value, display.trimDecimal);
						} else if (display.dollar) {
							display.value = dollarifyNumber(display.value, display.trimDecimal);
						}
					}
				}
				if (section === undefined || section === 'gross') {
					clean($scope.grossAudience);
				}
				if (section === undefined || section === 'primary') {
					clean($scope.primaryAudience);
				}
				if (section === undefined || section === 'secondary') {
					clean($scope.secondaryAudience);
				}
			}

			//visibility variables
			$scope.boards = false;
			$scope.gross = false;
			$scope.primary = true;
			$scope.secondary = true;
			$scope.numWeeks = campaignSelection.campaignDetails.numWeeks;
			$scope.primaryDisplay = (campaignSelection.campaignResponseData.primaryProjection.length !== 0) ? true : false;
			$scope.secondaryDisplay = (campaignSelection.campaignResponseData.secondaryProjection.length !== 0) ? true : false;

			//high level board detail variables
			var dateFormat = 'MMM d, y';
			var start = campaignSelection.campaignDetails.startDate;
			$scope.startDate = $filter('date')(start, dateFormat);
			$scope.endDate = $filter('date')(campaignDateService.getEndDate(start, campaignSelection.campaignDetails.numWeeks), dateFormat);
			$scope.numBoards = 0;
			$scope.totalCost = 0;

			if (pickYourOwnBoards.pickYourOwnBoards) {
				start = pickYourOwnBoards.dateForm.startDate;
				$scope.numWeeks = pickYourOwnBoards.dateForm.numWeeks;
				$scope.startDate = $filter('date')(start, dateFormat);
				$scope.endDate = $filter('date')(campaignDateService.getEndDate(start, pickYourOwnBoards.dateForm.numWeeks), dateFormat);
			}

			//section details
			$scope.title = 'Campaign Details';
			$scope.projectionTitle = 'Campaign Projections';
			$scope.currentView = true;
			//true= boardlist, false= single board
			$scope.currentBoard = undefined;
			$scope.currentBoardNumber = 0;

			$scope.toggleMenu = function(menu) {
				if ($scope[menu] === true) {
					$scope[menu] = false;
				} else {
					$scope[menu] = true;
				}
			};

			$scope.switchView = function() {
				$scope.currentView = !$scope.currentView;
				if ($scope.currentView) {
					$scope.title = 'Campaign Details';
					$scope.primaryAudience = angular.copy($scope.aggregateAudience.primaryAudience);
					$scope.secondaryAudience = angular.copy($scope.aggregateAudience.secondaryAudience);
					$scope.grossAudience = angular.copy($scope.aggregateAudience.grossAudience);
					$scope.hoverBillboardId = null;
					$scope.clickedBillboardId = null;

					var poisArray = campaignSelection.getBoardsFromResult();
					CrossBIRTFilter.setDataFile( {user:'demo', context:'OOH', locations: JSON.stringify(poisArray)});
				} else {
					$scope.title = 'Board Details';
				}
				$('.tab-span').html('Campaign Projection');
			};

			$scope.boardHover = function(board) {
				$scope.hoverBillboardId = board;
			};

			$scope.isHoveredBoard = function(board) {
				if ($scope.hoverBillboardId === board.key[0]) {
					return true;
				}
				return false;
			};

			$scope.boardSelect = function(board, index) {
				$scope.currentBoard = board;
				$scope.currentBoardNumber = index + 1;
				$scope.switchView();
				$scope.hoverBillboardId = board.key[0];
				$scope.clickedBillboardId = board.key[0];

				CrossBIRTFilter.setDataFile( {user:'demo', context:'OOH', locations: JSON.stringify([{'fenceId': $scope.clickedBillboardId, 'timeCellId': '201404m'}])} );
				fillAudienceInfo($scope.currentBoard);
				$('.tab-span').html('Board Projection');
			};

			$scope.nextBoard = function() {
				if ($scope.currentBoardNumber === $scope.billboards.length) {
					$scope.currentBoardNumber = 1;
				} else {
					$scope.currentBoardNumber += 1;
				}
				$scope.currentBoard = $scope.billboards[$scope.currentBoardNumber - 1];
				$scope.clickedBillboardId = $scope.currentBoard.key[0];

				CrossBIRTFilter.setDataFile( {user:'demo', context:'OOH', locations: JSON.stringify([{'fenceId': $scope.clickedBillboardId, 'timeCellId': '201404m'}])} );

				fillAudienceInfo($scope.currentBoard);
			};

			$scope.prevBoard = function() {
				if ($scope.currentBoardNumber === 1) {
					$scope.currentBoardNumber = $scope.billboards.length;
				} else {
					$scope.currentBoardNumber -= 1;
				}
				$scope.currentBoard = $scope.billboards[$scope.currentBoardNumber - 1];
				$scope.clickedBillboardId = $scope.currentBoard.key[0];

				CrossBIRTFilter.setDataFile( {user:'demo', context:'OOH', locations: JSON.stringify([{'fenceId': $scope.clickedBillboardId, 'timeCellId': '201404m'}])} );

				fillAudienceInfo($scope.currentBoard);
			};

			$scope.toggleProjectionMenu = function() {
				if ($scope.currentView === true) {
					$scope.projectionTitle = 'Campaign Projections';
				} else {
					$scope.projectionTitle = 'Projections for ' + $scope.currentBoard.tabCode;
				}
			};

			$scope.isProjectionShown = function (projectionItem) {
				return ([true, undefined].indexOf(projectionItem.onlyInPickYourOwnBoards) !== -1);
			};

			//audience variables
			$scope.aggregateAudience = {
				primaryAudience : undefined,
				secondaryAudience : undefined,
				grossAudience : undefined
			};

			$scope.primaryAudience = campaignSelection.audiences.primary;
			$scope.primaryAudience.cost = 0;
			$scope.primaryAudience.reach = 0;
			$scope.primaryAudience.display = [{
				'lookup' : 'targetImp',
				'name' : 'Target Imps.',
				'value' : 0,
				'pretty' : true,
				'dollar' : false,
				'trimDecimal' : true
			}, {
				'lookup' : 'reach',
				'name' : 'Target Reach',
				'value' : 0,
				'pretty' : true,
				'dollar' : false,
				'trimDecimal' : true
			}, {
				'lookup' : 'freq',
				'name' : 'Target Frequency',
				'value' : 0,
				'pretty' : true,
				'dollar' : false,
				'trimDecimal' : false
			}, {
				'lookup' : 'cpm',
				'name' : 'CPM',
				'value' : 0,
				'pretty' : false,
				'dollar' : true,
				'trimDecimal' : true
			}];

			// add additional fields. this var can also be accessed from pickYourOwnBoardsCtrl

			$scope.secondaryAudience = campaignSelection.audiences.secondary;
			$scope.secondaryAudience.cost = 0;
			$scope.secondaryAudience.reach = 0;
			$scope.secondaryAudience.display = [{
				'lookup' : 'targetImp',
				'name' : 'Target Imps.',
				'value' : 0,
				'pretty' : true,
				'dollar' : false,
				'trimDecimal' : true
			}, {
				'lookup' : 'reach',
				'name' : 'Target Reach',
				'value' : 0,
				'pretty' : true,
				'dollar' : false,
				'trimDecimal' : true
			}, {
				'lookup' : 'freq',
				'name' : 'Target Frequency',
				'value' : 0,
				'pretty' : false,
				'dollar' : false,
				'trimDecimal' : false
			}, {
				'lookup' : 'cpm',
				'name' : 'CPM',
				'value' : 0,
				'pretty' : false,
				'dollar' : true,
				'trimDecimal' : true
			}];

			$scope.grossAudience = {};
			$scope.grossAudience.cost = 0;
			$scope.grossAudience.reach = 0;
			$scope.grossAudience.display = [{
				'lookup' : 'targetImp',
				'name' : 'Gross Imps.',
				'value' : 0,
				'pretty' : true,
				'dollar' : false,
				'trimDecimal' : true
			}, {
				'lookup' : 'tabTargetImp',
				'name' : 'TAB Gross Imps',
				'value' : 0,
				'pretty' : false,
				'dollar' : false,
				'trimDecimal' : false,
				'onlyInPickYourOwnBoards' : pickYourOwnBoards.pickYourOwnBoards
			}, {
				'lookup' : 'reach',
				'name' : 'Unique Reach',
				'value' : 0,
				'pretty' : true,
				'dollar' : false,
				'trimDecimal' : true
			}, {
				'lookup' : 'freq',
				'name' : 'Frequency',
				'value' : 0,
				'pretty' : false,
				'dollar' : false,
				'trimDecimal' : false
			}, {
				'lookup' : 'cpm',
				'name' : 'CPM',
				'value' : 0,
				'pretty' : false,
				'dollar' : true,
				'trimDecimal' : true
			}];

			// populate primary projection
			var i, j, tempList = [], cpmIndex, freqIndex;
			var primaryProjectionLength = campaignSelection.campaignResponseData.primaryProjection.length;
			if (primaryProjectionLength !== 0) {
				for ( i = 0; i < primaryProjectionLength; i++, $scope.numBoards++) {
					tempList.push(campaignSelection.campaignResponseData.primaryProjection[i].billboard);
				}

				$scope.billboards = tempList;

				for ( i = 0; i < $scope.primaryAudience.display.length; i++) {
					for ( j = 0; j < primaryProjectionLength; j++) {
						$scope.primaryAudience.display[i].value += campaignSelection.campaignResponseData.primaryProjection[j][$scope.primaryAudience.display[i].lookup];
					}

					if ($scope.primaryAudience.display[i].lookup === 'cpm') {
						cpmIndex = i;
					} else if ($scope.primaryAudience.display[i].lookup === 'freq') {
						freqIndex = i;
					}
				}

				for ( j = 0; j < primaryProjectionLength; j++) {
					$scope.primaryAudience.cost += campaignSelection.campaignResponseData.primaryProjection[j].billboard.cost;
					$scope.primaryAudience.reach += campaignSelection.campaignResponseData.primaryProjection[j].reach;
				}

				// calculate cpm
				$scope.primaryAudience.display[cpmIndex].value = ($scope.primaryAudience.cost * 1000) / $scope.primaryAudience.display[0].value;
				if (!isFinite($scope.primaryAudience.display[cpmIndex].value)) {
					$scope.primaryAudience.display[cpmIndex].value = 0;
				}

				// calculate frequency - divide by number of boards
				$scope.primaryAudience.display[freqIndex].value = ($scope.primaryAudience.display[freqIndex].value / primaryProjectionLength).toFixed(1);
				if (!isFinite($scope.primaryAudience.display[freqIndex].value)) {
					$scope.primaryAudience.display[freqIndex].value = 0;
				}

				// populate secondary projection
				var secondaryProjectionLength = campaignSelection.campaignResponseData.secondaryProjection.length;
				if (secondaryProjectionLength !== 0) {
					cpmIndex = 0, freqIndex = 0;
					for ( i = 0; i < $scope.secondaryAudience.display.length; i++) {
						for ( j = 0; j < secondaryProjectionLength; j++) {
							$scope.secondaryAudience.display[i].value += campaignSelection.campaignResponseData.secondaryProjection[j][$scope.secondaryAudience.display[i].lookup];
						}
						if ($scope.secondaryAudience.display[i].lookup === 'cpm') {
							cpmIndex = i;
						} else if ($scope.secondaryAudience.display[i].lookup === 'freq') {
							freqIndex = i;
						}
					}
					for ( j = 0; j < secondaryProjectionLength; j++) {
						$scope.secondaryAudience.cost += campaignSelection.campaignResponseData.secondaryProjection[j].billboard.cost;
						$scope.secondaryAudience.reach += campaignSelection.campaignResponseData.secondaryProjection[j].reach;
					}

					// calculate cpm
					$scope.secondaryAudience.display[cpmIndex].value = ($scope.secondaryAudience.cost * 1000) / $scope.secondaryAudience.display[0].value;
					if (!isFinite($scope.secondaryAudience.display[cpmIndex].value)) {
						$scope.secondaryAudience.display[cpmIndex].value = 0;
					}
					// calculate frequency
					$scope.secondaryAudience.display[freqIndex].value = ($scope.secondaryAudience.display[freqIndex].value / secondaryProjectionLength).toFixed(1);
					if (!isFinite($scope.secondaryAudience.display[freqIndex].value)) {
						$scope.secondaryAudience.display[freqIndex].value = 0;
					}
				}
			} else {
				for ( i = 0; i < campaignSelection.campaignResponseData.grossProjection.length; i++, $scope.numBoards++) {
					tempList.push(campaignSelection.campaignResponseData.grossProjection[i].billboard);
				}

				$scope.billboards = tempList;
			}
			//populate grossAudience
			cpmIndex = 0, freqIndex = 0;
			var grossProjectionLength = campaignSelection.campaignResponseData.grossProjection.length;
			for ( i = 0; i < $scope.grossAudience.display.length; i++) {
				for ( j = 0; j < grossProjectionLength; j++) {
					$scope.grossAudience.display[i].value += campaignSelection.campaignResponseData.grossProjection[j][$scope.grossAudience.display[i].lookup];
				}
				if ($scope.grossAudience.display[i].lookup === 'cpm') {
					cpmIndex = i;
				} else if ($scope.grossAudience.display[i].lookup === 'freq') {
					freqIndex = i;
				}
			}
			for ( j = 0; j < grossProjectionLength; j++) {
				$scope.grossAudience.cost += campaignSelection.campaignResponseData.grossProjection[j].billboard.cost;
				$scope.grossAudience.reach += campaignSelection.campaignResponseData.grossProjection[j].reach;
			}

			// calculate cpm
			$scope.grossAudience.display[cpmIndex].value = ($scope.grossAudience.cost * 1000) / $scope.grossAudience.display[0].value;
			if (!isFinite($scope.grossAudience.display[cpmIndex].value)) {
				$scope.grossAudience.display[cpmIndex].value = 0;
			}
			// calculate frequency
			$scope.grossAudience.display[freqIndex].value = ($scope.grossAudience.display[freqIndex].value / grossProjectionLength).toFixed(1);
			if (!isFinite($scope.grossAudience.display[freqIndex].value)) {
				$scope.grossAudience.display[freqIndex].value = 0;
			}

			for ( i = 0; i < $scope.billboards.length; i++) {
				var curr = $scope.billboards[i];
				curr.cost = Math.round(curr.cost * 100) / 100;
				$scope.totalCost += curr.cost;
			}

			$scope.totalCost = dollarifyNumber($scope.totalCost, true);
			campaignSelection.numberOfBoards = $scope.numBoards;

			//impression variables
			$scope.impressions = impressions($scope.grossAudience.display[0].value);
			$scope.primaryImpressions = impressions($scope.primaryAudience.display[0].value);
			$scope.secondaryImpressions = impressions($scope.secondaryAudience.display[0].value);

			cleanupValues();
			$scope.hoverBillboardId = null;
		}],
		link : function(scope, element, attrs) {

			var chartsToAdd = [6, 4, 3];

			if (scope.primaryAudience.form.income !== '6') {
				chartsToAdd.push(5);
			}
			if (scope.primaryAudience.form.household !== '3') {
				chartsToAdd.push(2);
				chartsToAdd.push(11);
			}
			if (scope.primaryAudience.form.ethnicity !== '7') {
				chartsToAdd.push(7);
			}


			if (scope.secondaryAudience.form.income !== '6') {
				if (chartsToAdd.indexOf(5) === -1) {
					chartsToAdd.push(5);
				}
			}
			if (scope.secondaryAudience.form.household !== '3') {
				if (chartsToAdd.indexOf(2) === -1) {
					chartsToAdd.push(2);
				}
				if(chartsToAdd.indexOf(11) === -1) {
					chartsToAdd.push(11);
				}
			}
			if (scope.secondaryAudience.form.ethnicity !== '7') {
				if (chartsToAdd.indexOf(7) === -1) {
					chartsToAdd.push(7);
				}
			}

			// since campaign results can be triggered multiple times
			// by adding boards standalone, reset the chart icons
			for (var i = 0; i < itemStorage.charts.length; i ++) {
				var c = itemStorage.charts[i];
				c.active = false;
			}

			for (var chart = 0; chart < chartsToAdd.length; chart++) {
				var options = itemStorage.getItem('charts', chartsToAdd[chart], true, 'id');
				var elem;
				if (options.id === 6) {
					elem = $compile('<cip-map align-zoom-controls="true" class="chartContainer map" current-view="currentView" hover-billboard-id="hoverBillboardId" height="525" width="715" clicked-billboard-id="clickedBillboardId" billboards="cipMap.billboards" style="z-index: 100"></cip-map>')(scope);
					elem.css({
						'height' : elem.attr('height') + 'px',
						'width' : elem.attr('width') + 'px'
					});
				} else {
					elem = $compile($('<div chart-container='+chartsToAdd[chart]+'></div>'))(scope);
				}
				var size = options.size;
				chartWindow.addItemToCanvas(elem, size);
				options.active = true;
			}

			// create comma-separated list of demographics selected
			var createDemographicsSnapshot = function(audience) {
				scope[audience].demographicsSnapshot = '';
				scope[audience].showDetailLine = false;
				for (var i in scope[audience].form) {
					if (scope[audience].form[i] !== defaultAudienceForm[i] || i === 'age') {
						scope[audience].showDetailLine = true;
						scope[audience].demographicsSnapshot += campaignLookups[i][scope[audience].form[i]] + ', ';
					}
				}
				scope[audience].demographicsSnapshot = scope[audience].demographicsSnapshot.substring(0, scope[audience].demographicsSnapshot.length - 2);
			};

			createDemographicsSnapshot('primaryAudience');
			createDemographicsSnapshot('secondaryAudience');

			scope.aggregateAudience.primaryAudience = angular.copy(scope.primaryAudience);
			scope.aggregateAudience.secondaryAudience = angular.copy(scope.secondaryAudience);
			scope.aggregateAudience.grossAudience = angular.copy(scope.grossAudience);

			scope.cipMap = {
				billboards : scope.billboards
			};
		}
	};
}]);
