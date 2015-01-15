app.controller('VADashboardCtrl', ['$scope', '$rootScope', '$compile', 'filterHandler','itemStorage', 'ENV', 'SessionService', 'poiService', 'angularBridgeService', 'getAreasService', 'overLay', 'jsapiHandler',
	function ($scope, $rootScope, $compile, filterHandler, itemStorage, ENV, SessionService, poiService, angularBridgeService, getAreasService, overLay, jsapiHandler) {
		'use strict';

		$rootScope.pageId = 'VA';

		$rootScope.globalStatus.context = 'VA';
		$rootScope.globalStatus.campaignCreated = false;

		function addZipChoroplethReport (callback) {
			chartWindow.container.append('<div id="zip-choropleth-report"></div>');
			CrossBIRTFilter.createWidget('zip-choropleth-report', '/CIP/ZipChoropleth-VA-uu.rptdesign', {width: 0, height: 0, type: CrossBIRTFilter.WIDGET_TYPE_TABLE, primary: 'xf-zip'});
			if(callback){
				callback();
			}
		}

		function buildDataFromZips(){
			function requestsEnd() {
				$scope.choroplethZips = dataArr;
			}

			function success(data){
				var currentZip =_.find(angularBridgeService.choropleth.zipData,function(zip){
					return data.properties.layerCode === zip.zipCode;
				});

				data.stepRatio =currentZip.stepRatio;
				dataArr.push(data);
				requestsCount--;
				if (requestsCount === 0) {
					requestsEnd();
				}
			}

			function error(err){
				requestsCount--;
				if (requestsCount === 0) {
					requestsEnd();
				}
			}

			var dataArr = [];
			var requestsCount = angularBridgeService.choropleth.zipData.length;
			for (var i = 0; i < angularBridgeService.choropleth.zipData.length; i++) {
				getAreasService
					.getLayerById('zip_' + angularBridgeService.choropleth.zipData[i].zipCode)
					.then(success,error);
			}
		}

		function handleGetPoisByBoundsResults(res) {
			if (!res || $scope.poiModel.groupA.allPoi.length > 0) {
				return;
			}
			else {
				var indexA = 0;
				var indexB = 0;
				$scope.poiModel.groupA.currentPagePoi = [];
				$scope.poiModel.groupB.currentPagePoi = [];
				var groupA = [];
				var groupB = [];
				var selectedPoi = null;
				for (var i = 0; i < res.length; i++) {
					//handle the case where the poi object does not have empty dataset value. then we will treat it as dataset 1.
					if(res[i].properties.dataset === '' && $scope.dataset === 'dataset1'){
						selectedPoi = res[i];
					} else if (res[i].properties.dataset === $scope.dataset){
						selectedPoi = res[i];
					}

					if(selectedPoi){
						if (res[i].properties.group === 'Stores targeting general population'|| res[i].properties.group === 'BK Group 1') {
							selectedPoi.properties.group = 'group A';
							groupA.push(selectedPoi);
						}
						else {
							selectedPoi.properties.group = 'group B';
							groupB.push(selectedPoi);
						}
					}
					selectedPoi = null;
				}
				$scope.poiModel.groupA.name = (groupA.length > 0) ? groupA[0].properties.group : '';
				$scope.poiModel.groupB.name = (groupB.length > 0) ? groupB[0].properties.group : '';
				$scope.poiModel.groupA.allPoi = groupA;
				$scope.poiModel.groupB.allPoi = groupB;
				$scope.poiModel.groupA.remainPoi = $scope.poiModel.groupA.allPoi.slice();
				$scope.poiModel.groupA.currentPagePoi = $scope.poiModel.groupA.remainPoi.splice(0, 10);
				$scope.poiModel.groupB.remainPoi = $scope.poiModel.groupB.allPoi.slice();
				$scope.poiModel.groupB.currentPagePoi = $scope.poiModel.groupB.remainPoi.splice(0, 10);
				$scope.pois = $scope.poiModel;
			}
		}

		//reset global campaignResults
		campaignResults = false;

		$scope.poiModel = {
			choroplethMode: false,
			groupA: {
				name: '',
				filteredOut: [],
				currentPagePoi: [],
				remainPoi: [],
				allPoi: [],
				selectedPoi: null,
				hovered: null,
				isGroupOnCharts: true
			},
			groupB: {
				name: '',
				filteredOut: [],
				currentPagePoi: [],
				remainPoi: [],
				allPoi: [],
				selectedPoi: null,
				hovered: null,
				isGroupOnCharts: false
			}
		};

		//dataset selection related.
		$scope.dataset = 'dataset1';
		$scope.datasetSelected = false;

		$scope.initializeVAdashboard = function(){
			$scope.datasetSelected = true;
			$scope.choropleth = angularBridgeService.choropleth;

			$scope.$watch('choropleth.zipData', function(){
				buildDataFromZips();
			});

			$scope.$watch('choropleth.isChoroplethShown', function (isShown) {
				if (!isShown) {
					$scope.choroplethZips = null;
					return;
				}

				buildDataFromZips();
			});

			$scope.$watch('poiModel.groupA.isGroupOnCharts', function (newVal) {
				if (newVal) {
					$scope.poiModel.groupB.isGroupOnCharts = false;
				}
				else{
					return;
				}

				//birth filter for poi
				var idPrefix;
				if($scope.poiModel.groupA.selected){
					idPrefix = $scope.poiModel.groupA.selected.properties.name.toUpperCase().replace(regex, '');
					idPrefix = idPrefix.slice(0,9);
					CrossBIRTFilter.setDataFile( {user:'demo', context:'VA', locations: JSON.stringify([{'fenceId': idPrefix + '_' + $scope.poiModel.groupA.selected.id, 'timeCellId': '201404m'}])} );
					return;
				}

				//birth filter for group
				CrossBIRTFilter.setDataFile( {user:'demo', context:'VA', locations: JSON.stringify([{'fenceId': 'STGP_2717c230-f8be-11e3-a3ac-0800200c9a66', 'timeCellId': '201404m'}])} );
			});

			$scope.$watch('poiModel.groupB.isGroupOnCharts', function (newVal) {
				if (newVal) {
					$scope.poiModel.groupA.isGroupOnCharts = false;
				} else{
					return;
				}

				//birth filter for poi
				var idPrefix;
				if($scope.poiModel.groupB.selected){
					idPrefix = $scope.poiModel.groupB.selected.properties.name.toUpperCase().replace(regex, '');
					idPrefix = idPrefix.slice(0,9);
					CrossBIRTFilter.setDataFile( {user:'demo', context:'VA', locations: JSON.stringify([{'fenceId': idPrefix + '_' + $scope.poiModel.groupB.selected.id, 'timeCellId': '201404m'}])} );
					return;
				}
				//birth filter for group
				CrossBIRTFilter.setDataFile( {user:'demo', context:'VA', locations: JSON.stringify([{'fenceId': 'STASD_0d1e2c10-f8bf-11e3-a3ac-0800200c9a66', 'timeCellId': '201404m'}])} );
			});

			var regex = new RegExp(' ', 'g');

			$scope.$watch('poiModel.groupB.selected', function (newPoi) {
				if(!newPoi && $scope.poiModel.groupB.isGroupOnCharts){
					CrossBIRTFilter.setDataFile( {user:'demo', context:'VA', locations: JSON.stringify([{'fenceId': 'STASD_0d1e2c10-f8bf-11e3-a3ac-0800200c9a66', 'timeCellId': '201404m'}])} );
					return;
				}

				if (!newPoi || !$scope.poiModel.groupB.isGroupOnCharts) {
					return;
				}

				var idPrefix = newPoi.properties.name.toUpperCase().replace(regex, '');
				idPrefix = idPrefix.slice(0,9);
				CrossBIRTFilter.setDataFile( {user:'demo', context:'VA', locations: JSON.stringify([{'fenceId': idPrefix + '_' + newPoi.id, 'timeCellId': '201404m'}])} );
			});

			$scope.$watch('poiModel.groupA.selected', function (newPoi) {
				if(!newPoi && $scope.poiModel.groupA.isGroupOnCharts){
					CrossBIRTFilter.setDataFile( {user:'demo', context:'VA', locations: JSON.stringify([{'fenceId': 'STGP_2717c230-f8be-11e3-a3ac-0800200c9a66', 'timeCellId': '201404m'}])} );
					return;
				}
				if (!newPoi || !$scope.poiModel.groupA.isGroupOnCharts) {
					return;
				}

				var idPrefix = newPoi.properties.name.toUpperCase().replace(regex, '');
				idPrefix = idPrefix.slice(0,9);
				CrossBIRTFilter.setDataFile( {user:'demo', context:'VA', locations: JSON.stringify([{'fenceId': idPrefix + '_' + newPoi.id, 'timeCellId': '201404m'}])} );
			});

			var defaultBoundingBox = {
            	_northEast : {
            		lng: -59.48,
            		lat: 49.97
            	}, _southWest: {
            		lng: -126.63,
            		lat: 24.71
            	}
            };
			poiService.getPoisByBounds(defaultBoundingBox, function (err, res) {
				handleGetPoisByBoundsResults(res);
			});


			overLay.setShow(true);
			chartWindow.init();
			//if jsapi is not initialized, initAPI will init it and initialize the CrossBIRTFilter framework.
			//once crossBirtFilter is initialized, do callback.
			//if jsapi is initialized, then we can reset the crossBirtFilter and change the context.

			if($rootScope.globalStatus.jsapiLoaded === true) {
				itemStorage.setAllChartsInactive();
				CrossBIRTFilter.reset($rootScope.globalStatus.context);
			} else {
				jsapiHandler.initAPI(function(){
					var userId = SessionService.userId || 'demo';
					var data = {
						'locations': JSON.stringify(ENV.defaultFenceId),
						'context': 'VA',
						'user': userId
					};
					CrossBIRTFilter.setDataFile(data);
					addZipChoroplethReport(function(){
						overLay.setShow(false, 'jsapi');
					});
					sidebar.mode = 'VA';
					sidebar.adjustSideBar();
				}, true);
			}
			var mapWindow = $compile('<cip-map align-zoom-controls="true" class="chartContainer" search-hidden="true" choropleth-zips="choroplethZips" visitor-analysis="true" height="525" width="715" next-10-pois="next10Pois()" selected-poi ="selectedPoi" pois ="pois" style="z-index: 100"></cip-map>')($scope);
			var size = itemStorage.getItem('charts', $scope.chartid, true, 'id').size;
			chartWindow.addItemToCanvas(mapWindow);
		};
	}
]);