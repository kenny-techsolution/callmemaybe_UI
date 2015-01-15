angular.module('cip-map', ['ui.bootstrap'], function () {
})
    .run(['$templateCache', '$http', function ($templateCache, $http) {
        "use strict";
        $http.get('svgs/cip_map_pin_dot_orange.svg').success(function (svg) {
            $templateCache.put('markerPinOrange', svg);
        });
        $http.get('svgs/cip_map_pin_dot_green.svg').success(function (svg) {
            $templateCache.put('markerPinGreen', svg);
        });
        $http.get('svgs/cip_map_orange_circle.svg').success(function (svg) {
            $templateCache.put('clusterCircleOrange', svg);
        });
        $http.get('svgs/cip_map_green_circle.svg').success(function (svg) {
            $templateCache.put('clusterCircleGreen', svg);
        });
        $http.get('svgs/cip_map_pin_star_orange.svg').success(function (svg) {
            $templateCache.put('markerStarOrange', svg);
        });
        $http.get('svgs/cip_map_pin_star_green.svg').success(function (svg) {
            $templateCache.put('markerStarGreen', svg);
        });

        $templateCache.put('plus', '<svg class="leaflet-control-zoom-in-content" width="20" height="20" xmlns="http://www.w3.org/2000/svg">' +
            '<g>' +
            '<title>Layer 1</title>' +
            '<path d="m15.30005,11.29999h-2.59998v2.59998c0,1.20001 -1,2.20001 -2.20007,2.20001c-1.19995,0 -2.19995,-1 -2.19995,' +
            '-2.20001v-2.59998h-2.59998c-1.20007,0 -2.20007,-1 -2.20007,-2.20001c0,-1.20001 1,-2.20001 2.20007,-2.20001h2.59998v-2.59998c0,' +
            '-1.20001 1,-2.20001 2.19995,-2.20001c1.20007,0 2.20007,1 2.20007,2.20001v2.59998h2.59998c1.19995,0 2.19995,1 2.19995,2.20001c0,' +
            '1.20001 -1,2.20001 -2.19995,2.20001" fill="#CBCBCB"' +
            '</g>' +
            '</svg>')

        $templateCache.put('minus', '<svg class="leaflet-control-zoom-out-content" width="20" height="20" xmlns="http://www.w3.org/2000/svg">' +
            '<g>' +
            '<path d="m17.30005,10.29999h-9.69995c-1.20007,0 -2.20007,-1 -2.20007,-2.20001s1,-2.20001 2.20007,-2.20001h9.69995c1.19995,' +
            '0 2.19995,1 2.19995,2.20001s-0.90002,2.20001 -2.19995,2.20001" fill="#CBCBCB" clip-path="url(#SVGID_4_)"/>' +
            '</g>' +
            '</svg>')

        $templateCache.put('poi', '<svg width="22" height="29"><g><path fill="black" stroke="#fff" stroke-width="1" d="m10.90002,5.8c-2.60004,0 -4.60004,2.10001 ' +
            '-4.60004,4.60001c0,2.60001 2.10004,4.60001 4.60004,4.60001c2.59998,0 4.59998,-2.10001 4.59998,-4.60001c0.09998,-2.5 -2,-4.60001 ' +
            '-4.59998,-4.60001m-0.40002,21.60001l0,-0.19998c-0.29999,-0.20001 -0.40002,-0.5 -0.5,-0.70001c-0.09998,-0.20001 -2.90002,-5 ' +
            '-3.40002,-5.79999c-0.5,-0.80002 -1.5,-1.90002 -1.5,-1.90002c-1.79999,-1.59998 -4.29999,-4.19998 -4.29999,-8.29999c0,-5.60001 ' +
            '4.60004,-10.10001 10.20001,-10.10001c5.70001,0 10.20001,4.60001 10.20001,10.10001c0,4 -2.29999,6.60001 -4.29999,8.29999c0,0 ' +
            '-1,1.10001 -1.40002,1.90002c-0.5,0.79999 -3.29999,5.59998 -3.40002,5.79999c-0.19995,0.29999 -0.39996,0.79999' +
            ' -1,0.79999h-0.59998l0,0.10001z"/></g></svg>');

        $templateCache.put('billboard', '<svg width="41" height="40"  stroke-width="2"> <g>' +
            '<path id="svg_1" d="m40.806,23.025002l0,-18.182001c0,-1.221001 -0.737,-3.530001 -3.528,-3.530001l-33.306999,0c-1.220001,' +
            '0 -3.527,0.737 -3.527,3.530001l0,18.182001c0,1.220997 0.737,3.529999 3.527,3.529999l13.124001,0l0,9.224998c0,1.948002 ' +
            '1.584,3.533001 3.530998,3.533001c1.945,0 3.528,-1.584999 3.528,-3.533001l0,-9.224998l13.124001,0c1.220001,0 3.528,-0.737999 3.528,-3.529999" fill="#010101"/>' +
            '<path id="svg_2" d="m40.806,23.025002l0,-18.182001c0,-1.221001 -0.737,-3.530001 -3.528,-3.530001l-33.306999,0c-1.220001,' +
            '0 -3.527,0.737 -3.527,3.530001l0,18.182001c0,1.220997 0.737,3.529999 3.527,3.529999l13.124001,0l0,9.224998c0,1.948002 1.584,' +
            '3.533001 3.530998,3.533001c1.945,0 3.528,-1.584999 3.528,-3.533001l0,-9.224998l13.124001,0c1.220001,0 3.528,-0.737999 3.528,-3.529999z" stroke-miterlimit="10" stroke="#FFFFFF" fill="none"/>' +
            '<path id="svg_3" d="m8.171,8.040001c0,0 -0.999999,0 -0.999999,1l0,9.959999c0,0 0,1 0.999999,1l24.907999,0c0,0 1,0 1,-1l0,-9.959999c0,0 0,-1 -1,-1l-24.907999,0z" fill="#676767"/></g></svg>');
    }])
    .filter('toThousands', function () {
        return function (num) {
            var number = parseInt(num);

            if (number < 1000) {
                return number;
            }

            number = number / 1000;
            if (number < 1000) {
                return Math.round(number) + ' K';
            }
            return (number / 1000).toFixed(3) + ' M';
        }
    })
    .filter('abbreviationFilter', function () {
        return function (str, maxLength) {
            "use strict";
            if (!str || str.length < maxLength) return str;

            return str.substring(0, maxLength - 3) + '...';
        }
    }).filter('searchTextFilter', ['stateConversionTableService', function (stateConversionTableService) {

        return function (val) {
            'use strict';
            if (val.model.address.road && val.model.address.road !== '') {
                val.model.address.road = compassAbbreviation(val.model.address.road);
            }
            var state = stateConversionTableService[val.model.address.state.toUpperCase()];
            var address = (val.model.address.house_number ? val.model.address.house_number + ' ' : '' ) +
                (val.model.address.road ? val.model.address.road + ', ' : '' ) +
                (val.model.address.city ? val.model.address.city + ', ' : '') +
                (val.model.address.city ? '' : val.model.address.county ? val.model.address.county + ' ' : '') +
                ( state ? state + ' ' : '') + (val.model.address.postcode ? val.model.address.postcode : '');

            if (address === state) {
                address = val.model.address.state;
            }
            else {
                address = (val.model.address.house_number ? val.model.address.house_number + ' ' : '' ) +
                    (val.model.address.road ? val.model.address.road + ', ' : '' ) +
                    (val.model.address.city ? val.model.address.city + ', ' : '') +
                    (val.model.address.city ? '' : val.model.address.county ? val.model.address.county + ' ' : '') +
                    ( state ? state + ' ' : '') + (val.model.address.postcode ? val.model.address.postcode : '');
            }
            return address;
        };

        function compassAbbreviation(val) {
            var separators = [' ', ','];
            var arr = val.split(new RegExp(separators.join('|'), 'g'));

            for (var i = 0; i < arr.length; i++) {
                if (arr[i].toLowerCase().indexOf('northeast') !== -1 ||
                    arr[i].toLowerCase().indexOf('northwest') !== -1 ||
                    arr[i].toLowerCase().indexOf('southeast') !== -1 ||
                    arr[i].toLowerCase().indexOf('southwest') !== -1) {

                    switch (arr[i].toLowerCase()) {
                        case 'northeast':
                        {
                            arr[i] = 'NE';
                            break;
                        }
                        case 'northwest':
                        {
                            arr[i] = 'NW';
                            break;
                        }
                        case 'southeast':
                        {
                            arr[i] = 'SE';
                            break;
                        }
                        case 'southwest':
                        {
                            arr[i] = 'SW';
                            break;
                        }
                    }

                }
            }
            return arr.join(' ');

        }
    }])
    .directive('cipMap', [ 'itemStorage', '$interval', '$timeout', '$templateCache', '$compile', 'searchTextFilterFilter', 'angularBridgeService', 'layerNameFormatterFilter','campaignSelection', 'inZoomRangeFilter',
        function (itemStorage, $interval, $timeout, $templateCache, $compile, searchTextFilterFilter, angularBridgeService, layerNameFormatterFilter,campaignSelection, inZoomRangeFilter) {
            "use strict";
            return {
                templateUrl: './modules/cip-map/cip-map-template.html',
                restrict: 'EA',
                scope: {
                    width: '=',
                    height: '=',
                    pois: '=',
                    billboards: '=',
                    next10Pois: '&',
                    searchResource: '&',
                    getLocations: '&',
                    showSearchResults: '&',
                    searchHidden: '=',
                    alignZoomControls:'=',
                    clickedArea: '=',

                    //ooh
                    clickedPoi: '=',
                    selectedSecondaryTab: '=',
                    areas: '=',
                    bboxAreas: '=',
                    selectedLayer: '=',
                    clearSearchBox: '&',
                    isCampaign: '=',
                    loadingBounds: '=',
                    hoveredLayer: '=',

                    hoverBillboardId: '=',
                    clickedBillboardId: '=',
                    visitorAnalysis: '=',
                    currentView: '=',
                    choroplethZips: '='
                },
                controller: function () {
                },
                link: function (scope, el, attrs) {
                    scope.dayMapSelected = true;
                    window.onresize = windowSizeChanged;
                    if (scope.visitorAnalysis) {
                        $('.map-title-text').remove();
                    }
                    var privates = {
                        __map: null,
                        __poiFeatureGroup: L.featureGroup(),

                        __billboardClusterGroup: new L.MarkerClusterGroup({showCoverageOnHover: false,
                            zoomToBoundsOnClick: true,
                            iconCreateFunction: function (cluster) {
                                if (cluster.getChildCount().toString().length === 4) {
                                    return new L.DivIcon({
                                        html: $templateCache.get('billboard') + '<div class="cip-marker-cluster-cluster-group-div" style="width: 53px;"><span>' + cluster.getChildCount() + '</span></div>',
                                        className: 'cip-billboard-icon-cluster'
                                    });
                                }
                                else if (cluster.getChildCount().toString().length === 3) {
                                    return new L.DivIcon({
                                        html: $templateCache.get('billboard') + '<div class="cip-marker-cluster-cluster-group-div" style="width: 45px"><span>' + cluster.getChildCount() + '</span></div>',
                                        className: 'cip-billboard-icon-cluster'
                                    });
                                }
                                else if (cluster.getChildCount().toString().length === 2) {
                                    return new L.DivIcon({
                                        html: $templateCache.get('billboard') + '<div class="cip-marker-cluster-cluster-group-div" style="width: 34px;"><span>' + cluster.getChildCount() + '</span></div>',
                                        className: 'cip-billboard-icon-cluster'
                                    });
                                }
                                else if (cluster.getChildCount().toString().length === 1) {
                                    return new L.DivIcon({
                                        html: $templateCache.get('billboard') + '<div class="cip-marker-cluster-cluster-group-div" style="width: 27px;"><span>' + cluster.getChildCount() + '</span></div>',
                                        className: 'cip-billboard-icon-cluster'});
                                }
                                else {
                                    return new L.DivIcon({
                                        html: $templateCache.get('billboard') + '<div class="cip-marker-cluster-cluster-group-div" style="width: 47px;">' + cluster.getChildCount() + '</div>',
                                        className: 'cip-billboard-icon-cluster'});
                                }
                            }
                        }),
                        __poiGroupACurrentPage: new L.MarkerClusterGroup({showCoverageOnHover: false,
                            iconCreateFunction: function (cluster) {

                                if (cluster.getChildCount().toString().length === 4) {
                                    return new L.DivIcon({
                                        html: $templateCache.get('markerPinOrange') + '<div class="poi-cluster-div" style="width: 45px;">' + cluster.getChildCount() + '</div>',
                                        className: 'cip-poi-icon-cluster'
                                    });
                                }
                                else if (cluster.getChildCount().toString().length === 3) {
                                    return new L.DivIcon({
                                        html: $templateCache.get('markerPinOrange') + '<div class="poi-cluster-div" style="width: 34px;">' + cluster.getChildCount() + '</div>',
                                        className: 'cip-poi-icon-cluster'
                                    });
                                }
                                else if (cluster.getChildCount().toString().length === 2) {
                                    return new L.DivIcon({
                                        html: $templateCache.get('markerPinOrange') + '<div class="poi-cluster-div" style="width: 27px;">' + cluster.getChildCount() + '</div>',
                                        className: 'cip-poi-icon-cluster'
                                    });
                                }
                                else if (cluster.getChildCount().toString().length === 1) {
                                    return new L.DivIcon({
                                        html: $templateCache.get('markerPinOrange') + '<div class="poi-cluster-div" style="width: 25px;">' + cluster.getChildCount() + '</div>',
                                        className: 'cip-poi-icon-cluster'});
                                }
                                else {
                                    return new L.DivIcon({
                                        html: $templateCache.get('markerPinOrange') + '<div class="poi-cluster-div" style="width: 47px;">' + cluster.getChildCount() + '</div>',
                                        className: 'cip-poi-icon-cluster'});
                                }
                            }
                        }).on('click', handlePoiClick),
                        __poiGroupBCurrentPage: new L.MarkerClusterGroup({showCoverageOnHover: false,
                            iconCreateFunction: function (cluster) {

                                if (cluster.getChildCount().toString().length === 4) {
                                    return new L.DivIcon({
                                        html: $templateCache.get('markerPinGreen') + '<div class="poi-cluster-div" style="width: 45px;">' + cluster.getChildCount() + '</div>',
                                        className: 'cip-poi-icon-cluster'
                                    });
                                }
                                else if (cluster.getChildCount().toString().length === 3) {
                                    return new L.DivIcon({
                                        html: $templateCache.get('markerPinGreen') + '<div class="poi-cluster-div" style="width: 34px;">' + cluster.getChildCount() + '</div>',
                                        className: 'cip-poi-icon-cluster'
                                    });
                                }
                                else if (cluster.getChildCount().toString().length === 2) {
                                    return new L.DivIcon({
                                        html: $templateCache.get('markerPinGreen') + '<div class="poi-cluster-div" style="width: 27px;">' + cluster.getChildCount() + '</div>',
                                        className: 'cip-poi-icon-cluster'
                                    });
                                }
                                else if (cluster.getChildCount().toString().length === 1) {
                                    return new L.DivIcon({
                                        html: $templateCache.get('markerPinGreen') + '<div class="poi-cluster-div" style="width: 25px;">' + cluster.getChildCount() + '</div>',
                                        className: 'cip-poi-icon-cluster'});
                                }
                                else {
                                    return new L.DivIcon({
                                        html: $templateCache.get('markerPinGreen') + '<div class="poi-cluster-div" style="width: 47px;">' + cluster.getChildCount() + '</div>',
                                        className: 'cip-poi-icon-cluster'});
                                }
                            }
                        }).on('click', handlePoiClick),
                        __poiGroupARemain: new L.MarkerClusterGroup({showCoverageOnHover: false,
                            iconCreateFunction: createClusterAIcon
                        }).on('click', handlePoiClick),
                        __poiGroupBRemain: new L.MarkerClusterGroup({showCoverageOnHover: false,
                            iconCreateFunction: createClusterBIcon
                        }).on('click', handlePoiClick),

                        __poiGroupAOut: new L.MarkerClusterGroup({showCoverageOnHover: false,
                            iconCreateFunction: createBlurClusterAIcon
                        }).on('click', handlePoiClick),

                        __poiGroupBOut: new L.MarkerClusterGroup({showCoverageOnHover: false,
                            iconCreateFunction: createBlurClusterBIcon
                        }).on('click', handlePoiClick),
                        __poiClusterGroup: new L.MarkerClusterGroup({showCoverageOnHover: false,
                            iconCreateFunction: function (cluster) {

                                if (cluster.getChildCount().toString().length === 4) {
                                    return new L.DivIcon({
                                        html: $templateCache.get('poi') + '<div style="margin-left: 4px; margin-top: -9px; height: 20px;border-radius: 50px;border: solid 1px #ffffff;background-color: #333333;color: #ffffff;width: 45px;text-align: center;">' + cluster.getChildCount() + '</div>',
                                        className: 'cip-poi-icon-cluster'
                                    });
                                }
                                else if (cluster.getChildCount().toString().length === 3) {
                                    return new L.DivIcon({
                                        html: $templateCache.get('poi') + '<div style="margin-left: 4px; margin-top: -9px; height: 20px;border-radius: 50px;border: solid 1px #ffffff;background-color: #333333;color: #ffffff;width: 34px;text-align: center;">' + cluster.getChildCount() + '</div>',
                                        className: 'cip-poi-icon-cluster'
                                    });
                                }
                                else if (cluster.getChildCount().toString().length === 2) {
                                    return new L.DivIcon({
                                        html: $templateCache.get('poi') + '<div style="margin-left: 4px; margin-top: -9px; height: 20px;border-radius: 50px;border: solid 1px #ffffff;background-color: #333333;color: #ffffff;width: 27px;text-align: center;">' + cluster.getChildCount() + '</div>',
                                        className: 'cip-poi-icon-cluster'
                                    });
                                }
                                else if (cluster.getChildCount().toString().length === 1) {
                                    return new L.DivIcon({
                                        html: $templateCache.get('poi') + '<div style="margin-left: 4px; margin-top: -9px; height: 20px;border-radius: 50px;border: solid 1px #ffffff;background-color: #333333;color: #ffffff;width: 21px;text-align: center;">' + cluster.getChildCount() + '</div>',
                                        className: 'cip-poi-icon-cluster'});
                                }
                                else {
                                    return new L.DivIcon({
                                        html: $templateCache.get('poi') + '<div style="margin-left: 4px; margin-top: -9px; height: 20px;border-radius: 50px;border: solid 1px #ffffff;background-color: #333333;color: #ffffff;width: 47px;text-align: center;">' + cluster.getChildCount() + '</div>',
                                        className: 'cip-poi-icon-cluster'});
                                }
                            }
                        }),
                        __choroplethFeatureGroup: L.featureGroup(),
                        __droppedPoiGroup: L.featureGroup().on('click', handlePoiClickOOH),
                        __InvertedShapeFeatureGroup: L.featureGroup().on('click', closeLayerPopup()),
                        __EsriDayLarge: null,
                        __EsriSatLarge: {},
                        __oldAreas: null,
                        __shapes: L.featureGroup()
                            .on('click', handleShapeClick)
                            .on('mousemove', handleShapeMouseMove)
                            .on('mouseout', handleMouseOut),
                        __bboxShapes: L.featureGroup()
                            .on('mousemove', handleBboxShapeMouseMove)
                            .on('mouseout', handleBboxMouseOut)
                            .on('click', handleBboxShapeClick),
                        __selectedLayer: L.featureGroup(),
                        __hoveredShape: null,
                        __EsriDaySmall: null,
                        __EsriSatSmall: {},
                        __mouseEvent: null,
                        __selectedGroupA: {},
                        __selectedGroupB: {},
                        __choroplathColorArray: ['#8490b8', '#80bad5', '#a0e2f7', '#cdeff8', '#eff9fb'],
                        __selectedPoiPopup: null,
                        __poiPopup: L.popup({closeButton: false, minWidth: 200, offset: [0, -35], autoPanPadding: [100, 100], keepInView: true})
                    };

                    function isBeyondXMilesApart(miles, LatLngA, LatLngB) {
                        var deg2rad = function(deg) {
                            return deg * (Math.PI / 180)
                        };

                        var R = 3958; // Radius of the earth in mile
                        var dLat = deg2rad(LatLngB.lat - LatLngA.lat);
                        var dLng = deg2rad(LatLngB.lng - LatLngA.lng);
                        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(LatLngA.lat)) * Math.cos(deg2rad(LatLngB.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
                        var c = 2 * Math.atan2(Math.sqrt(a), Math
                            .sqrt(1 - a));
                        var d = R * c; // Distance in mile
                        return d >= miles;
                    }

                    function setNationalView(clusterGroup) {
                        var northEast = clusterGroup.getBounds()._northEast;
                        var southWest = clusterGroup.getBounds()._southWest;
                        var midLat = Math.round(((northEast.lat + southWest.lat) / 2) * 100000) / 100000;
                        var midLng = Math.round(((northEast.lat + southWest.lat) / 2) * 100000) / 100000;
                        var verticalA = {
                            lat: northEast.lat,
                            lng: midLng
                        };
                        var verticalB = {
                            lat: southWest.lat,
                            lng: midLng
                        };
                        var horizentalA = {
                            lat: northEast.lat,
                            lng: northEast.lng
                        };
                        var horizentalB = {
                            lat: southWest.lat,
                            lng: southWest.lng
                        };
                        if (isBeyondXMilesApart(1500, horizentalA, horizentalB) || isBeyondXMilesApart(1500, verticalA, verticalB)) {
                            //set national view.
                            privates.__map.setView([39.5, -98], 4);
                        } else {
                            //set normal view.
                            privates.__map.fitBounds(clusterGroup.getBounds(), {paddingTopLeft: [250, 50]});
                        }
                    }
                    /*************************************************** WATCHERS ****************************************************/

                    scope.$watch('choroplethZips', function (newData) {
                        privates.__choroplethFeatureGroup.clearLayers();
                        if (!newData || newData.length === 0) {
                            return;
                        }
                        if (scope.pois.choroplethMode) {
                            for (var i = 0; i < newData.length; i++) {

                                L.polygon(newData[i].geometry.coordinates, {
                                    fillColor: privates.__choroplathColorArray[newData[i].stepRatio - 1],
                                    color: 'white',
                                    weight: 2,
                                    fillOpacity: 0.7
                                })
                                    .addTo(privates.__choroplethFeatureGroup);
                            }
                        }
                    });

                    scope.$watchCollection('areas', function (newAreas) {
                        privates.__shapes.clearLayers();

                        closePoiPopupOOH();
                        if (!newAreas || newAreas.length === 0) {
                            return;
                        }
                        var shapes = createAreas(newAreas, true, true);
                        if (shapes && shapes.length > 0) {
                            removeLayerFromBBox(shapes.length - 1);
                            scope.selectedLayer = null;
                            closeLayerPopup();

                            _.each(shapes, function (shape) {
                                shape.on('drop', scope.handleDrop);
                                privates.__shapes.addLayer(shape);
                            });
                            privates.__map.fitBounds(privates.__shapes.getBounds(), {padding: [100, 180]});
                            if (shapes[shapes.length - 1].area) {
                                setOpacityEffect(shapes[shapes.length - 1].area, shapes[shapes.length - 1]);
                            }
                        }
                    });

                    scope.$watch('clickedArea', function (area) {
                        if (!area){
                            return;
                        }

                        scope.clickedArea = null;
                        var layer = _.find(privates.__shapes.getLayers(), function (layer) {
                            return area.id === layer.id;
                        });
                        if (layer) {
                            if(layer.area === scope.selectedLayer){
                                privates.__map.fitBounds(privates.__selectedLayer.getBounds(), {padding: [100, 180]})
                            }else {
                                scope.selectedLayer = layer.area;
                            }
                        }


                    });

                    scope.$watch('clickedPoi', function (poi) {

                        if (!poi){
                            return;
                        }
                        scope.clickedPoi = null;
                        privates.__map.panTo(poi.latLng);
                        openPoiPopupOOH(poi);
                    });
                    scope.$watchCollection('bboxAreas', function (newAreas) {
                        if(privates.__bboxShapes){
                            privates.__bboxShapes.clearLayers();
                        }
                        if (!newAreas || newAreas.length === 0) {
                            return;
                        }
                        privates.__map.removeLayer(privates.__bboxShapes);
                        var shapes = createAreas(newAreas, false);
                        _.each(shapes, function (shape){
                            var inAres = _.find(scope.areas,function(area){
                                return area.id === shape.id;
                            });
                            if(!inAres) {
                                privates.__bboxShapes.addLayer(shape);
                            }
                        });
                        privates.__bboxShapes.addTo(privates.__map);
                    });


                    scope.$watch('pois.selectedPois', function (newValue) {
                        privates.__droppedPoiGroup.clearLayers();
                        if (!newValue || newValue.length === 0) {
                            campaignSelection.cipMap.isPOIOpen = false;
                            return;
                        }
                        privates.__map.removeLayer(privates.__droppedPoiGroup);
                        campaignSelection.cipMap.isPOIOpen = true;
                        _.each(newValue, function (poi) {
                            var marker = L.marker(poi.latLng, {icon: L.divIcon({
                                html: $templateCache.get('markerPinOrange'),
                                iconAnchor: [5, 29],
                                className: 'cip-poi-icon'
                            })});
                            marker.poi = poi;
                            marker.shapeType = 'marker';
                            privates.__droppedPoiGroup.addLayer(marker);
                            var circle = L.circle(poi.latLng, poi.radius * 1609, { // convert KM to miles
                                fillColor: '#42c6f3',
                                fillOpacity: 0.23,
                                color: '#0079b5',
                                weight: 1
                            });
                            circle.poi = poi;
                            zoomOutIfNeeded(marker, circle);
                            circle.shapeType = 'circle'
                            privates.__droppedPoiGroup.addLayer(circle);
                        });

                        privates.__droppedPoiGroup.addTo(privates.__map);
                    }, true);

                    scope.$watch('selectedLayer', function (newArea, oldArea) {

                        if (!oldArea && !newArea) {
                            return;
                        }
                        privates.__selectedLayer.clearLayers();
                        privates.__map.removeLayer(privates.__selectedLayer);

                        if (oldArea) {
                            var oldLayerName = layerNameFormatterFilter(oldArea.properties.layerType.toLowerCase()).toLowerCase();
                            var oLayer = _.find(scope.areas, function (area) {
                                return oldArea.id === area.id;
                            })
                            if (!oLayer && oldLayerName === scope.selectedSecondaryTab.toLowerCase() && inZoomRangeFilter(oldLayerName, privates.__map.getZoom())) {
                                oldArea.isAnimated = false;
                                scope.bboxAreas.push(oldArea);
                            }
                        }

                        if (scope.layerPopup) {
                            closeLayerPopup();
                        }
                        if (!newArea) {
                            return;
                        }
                        scope.currentLayer = newArea;
                        var shapes = createAreas([newArea]);
                        privates.__selectedLayer.addLayer(shapes[0]);
                        privates.__selectedLayer.addTo(privates.__map);
                        privates.__map.fitBounds(privates.__selectedLayer.getBounds(), {padding: [100, 180]})

                        shapes[0].setStyle({
                            fillOpacity: shapes[0].ops.colors.hovered.opacity,
                            opacity: 1
                        });

                        openPopup(shapes[0]);

                    });

                    scope.$watch('hoveredLayer', function (area) {
                        if (!area) {
                            return;
                        }
                        var layer = _.find(privates.__shapes.getLayers(), function (ar) {
                            return ar.id === area.layer.id;
                        });
                        if (!area.isHovered) {
                            if (layer) {
                                layer.setStyle({
                                    fillOpacity: layer.ops.colors.selected.opacity,
                                    fillColor: layer.ops.colors.selected.color
                                });
                            }
                        } else {
                            if (layer) {
                                if (layer) {
                                    layer._path.classList.remove('cip-map-layer-animation');

                                    layer.setStyle({
                                        fillOpacity: layer.ops.colors.selectedHovered.opacity
                                    });
                                    return;

                                }
                            }
                        }
                    });

                    scope.$watch('windowSizeChange', function (newVal, oldValue) {
                        if (!newVal) {
                            return;
                        }
                        if (newVal && !oldValue) {
                            return;
                        }

                        windowSizeChangeMap();
                    });

                    scope.$watch('reset', function (isToReset) {
                        if (!isToReset) {
                            return;
                        }
                        scope.reset = false;
                        console.log('doing everything needed to reset the directive');
                        scope.areas = null;
                    });

					//VA
					scope.$watchCollection('pois.groupA.allPoi', function (newPois, oldPois) {
                        if (!newPois || newPois.length === 0) {
                            return;
                        }
                        storeAllAPoi(scope.pois.groupA.allPoi);
                    });
                    scope.$watchCollection('pois.groupB.allPoi', function (newPois, oldPois) {
                        if (!newPois || newPois.length === 0) {
                            return;
                        }
                        storeAllBPoi(scope.pois.groupB.allPoi);
                    });

                    scope.$watch('pois.groupA.isGroupOnCharts', function (newVal) {
                        if (newVal) {
                            redrawGroupB();
                            redrawGroupA();
                        } else {
                        	return;
                        }

                        if (newVal && privates.__selectedGroupA && privates.__selectedGroupA.poi) {
                        	return;
                        } else {
                        	setNationalView(privates.__poiGroupAAll);
                        }
                    });

                    scope.$watch('pois.groupB.isGroupOnCharts', function (newVal) {
                        if (newVal) {
                            redrawGroupA();
                            redrawGroupB();
                        } else {
                        	return;
                        }

                        if (newVal && privates.__selectedGroupB && privates.__selectedGroupB.poi) {
                        	return;
                        } else {
                        	setNationalView(privates.__poiGroupBAll);
                        }

                    });

                    scope.$watchCollection('pois.groupA.currentPagePoi', function (newPois, oldPois) {
                        drawCurrentAPoi(newPois);
                    });

                    scope.$watchCollection('pois.groupA.remainPoi', function (newPois) {
                        if (!newPois || newPois.length === 0) {
                            return;
                        }
                        drawRemainAPoi(newPois)
                    });

                    scope.$watchCollection('pois.groupB.currentPagePoi', function (newPois, oldPois) {
                        if (!newPois) {
                            return;
                        }
                        drawCurrentBPoi(newPois);
                    });

                    scope.$watchCollection('pois.groupB.remainPoi', function (newPois) {
                        drawRemainBPoi(newPois);
                    });

                    scope.$watchCollection('pois.groupA.filteredOut', function (newPois) {
                        drawFilteredOutA(newPois);
                    });

                    scope.$watchCollection('pois.groupB.filteredOut', function (newPois) {
                        drawFilteredOutB(newPois);
                    });

                    scope.$watch('pois.groupA.selected', function (newPoi, oldPoi) {
                        closeSelectedPoiPopup();
                        closePoiPopup();
                        if (!newPoi && !oldPoi) {
                            return;
                        }
                        redrawGroupB();
                        redrawGroupA();
                    });

                    scope.$watch('pois.groupB.selected', function (newPoi, oldPoi) {
                        closeSelectedPoiPopup();
                        closePoiPopup()
                        if (!newPoi && !oldPoi) {
                            return;
                        }
                        redrawGroupA();
                        redrawGroupB();
                    });

                    scope.$watch('pois.groupA.hovered', function (newValue, oldValue) {
                        if (!newValue && !oldValue) {
                            return;
                        }
                        var layers = privates.__poiGroupACurrentPage.getLayers();
                        var layer = null;
                        var addClass = false;
                        if (!newValue && oldValue) {
                            $("._id" + oldValue.id).removeClass('cip-poi-icon-hover');
                            layer = _.find(layers, function (l) {
                                return l.poi.id === oldValue.id
                            });
                        } else {
                            addClass = true;
                            layer = _.find(layers, function (l) {
                                return l.poi.id === newValue.id
                            });
                            $("._id" + newValue.id).addClass('cip-poi-icon-hover');
                        }

                        if (layer) {
                            var cluster = privates.__poiGroupACurrentPage.getVisibleParent(layer);
                            if (cluster && $(cluster._icon).hasClass('cip-poi-icon-cluster')) {
                                if (addClass) {
                                    $(cluster._icon).addClass('cip-poi-icon-cluster-hover');
                                }
                                else {
                                    $(cluster._icon).removeClass('cip-poi-icon-cluster-hover');
                                }
                            }

                        }
                    });

                    scope.$watch('pois.groupB.hovered', function (newValue, oldValue) {
                        if (!newValue && !oldValue) {
                            return;
                        }
                        if (!newValue && oldValue) {
                            $("._id" + oldValue.id).removeClass('cip-poi-icon-hover');
                        } else {
                            $("._id" + newValue.id).addClass('cip-poi-icon-hover');
                        }


                    });

                    scope.$watch('pois.hovered', function (newValue, oldValue) {

                        if (!newValue && !oldValue) {
                            return;
                        }
                        var layer = _.find(privates.__droppedPoiGroup.getLayers(), function (layer) {
                            return layer.poi === newValue;
                        });

                        if (layer) {
                            $(layer._icon).addClass('cip-poi-icon-hover');
                        }

                        if (!oldValue) {
                            return;
                        }
                        layer = _.find(privates.__droppedPoiGroup.getLayers(), function (layer) {
                            return layer.poi === oldValue;
                        });

                        if (layer) {
                            $(layer._icon).removeClass('cip-poi-icon-hover');
                        }


                    });

                    scope.$watch('pois.choroplethMode', function (newValue, oldValue) {
                        if (!newValue && !oldValue) {
                            return;
                        }
                        if (scope.pois.groupB.isGroupOnCharts) {
                            redrawGroupA();
                            redrawGroupB();
                        } else {
                            redrawGroupB();
                            redrawGroupA();
                        }


                        if (newValue) {
                            closeSelectedPoiPopup();
                        }

                    });

                    scope.$watch('currentView', function(newValue, oldValue) {
                        if (newValue === true) {
                            privates.__map.panTo(privates.__billboardClusterGroup.getBounds().getCenter());
                            privates.__map.fitBounds(privates.__billboardClusterGroup.getBounds(), {padding : [20, 20]});
                        }
                    });

                    scope.$watch('billboards', function (billboards) {
                        privates.__billboardClusterGroup.clearLayers();
                        if (!billboards || billboards.length === 0) return;

                        for (var i = 0; i < billboards.length; i++) {
                            var marker = L.marker([billboards[i].latitude, billboards[i].longitude], { icon: L.divIcon({
                                html: $templateCache.get('billboard'),
                                iconAnchor: [11, 20],
                                className: 'cip-billboard-icon id_' + billboards[i].key
                            })}).on('click', billboardMouseHover).on('mouseout', billboardMouseOut);
                            marker.key = billboards[i].key[0];
                            marker.billboard = billboards[i];
                            privates.__billboardClusterGroup.addLayer(marker);
                        }
                        privates.__map.panTo(privates.__billboardClusterGroup.getBounds().getCenter());

                        setNationalView(privates.__billboardClusterGroup);
                        privates.__billboardClusterGroup.addTo(privates.__map);

                    });

                    scope.$watch('hoverBillboardId', function (newValue, oldValue) {
                        if (!newValue && !oldValue) {
                            return;
                        }
                        if (!scope.currentView) {
                            return;
                        }
                        var layers;
                        var layer;
                        if (!newValue) {
                            layers = privates.__billboardClusterGroup.getLayers();
                            layer = _.find(layers, function (l) {
                                return l.key === oldValue;
                            });
                            var cluster = privates.__billboardClusterGroup.getVisibleParent(layer);
                            if (cluster && !cluster.key) {
                                $(cluster._icon).removeClass('cip-billboard-icon-cluster-hovered');
                            } else {
                                $('.id_' + layer.key).removeClass('cip-billboard-icon-hovered');
                            }
                            return;
                        }

                        layers = privates.__billboardClusterGroup.getLayers();
                        layer = _.find(layers, function (l) {
                            return l.key === newValue;
                        });
                        var cluster = privates.__billboardClusterGroup.getVisibleParent(layer);
                        if (cluster && !cluster.key) {
                            $(cluster._icon).addClass('cip-billboard-icon-cluster-hovered');
                        } else {
                            $('.id_' + layer.key).addClass('cip-billboard-icon-hovered');
                        }
                    })

                    scope.$watch('poi.radius', function (newValue, oldValue) {
                        if (!newValue && !oldValue) {
                            return;
                        }


                    });
                    scope.$watch('clickedBillboardId', function (newValue, oldValue) {
                        var layers = privates.__billboardClusterGroup.getLayers();
                        if (!newValue && !oldValue) {
                            return;
                        }
                        var layer = _.find(privates.__billboardClusterGroup.getLayers(), function (l) {
                            return l.key === newValue;
                        })
                        if (!layer) {
                            removeHoveredClass(layers, oldValue, layer, null);
                            return;
                        }
                        var cluster = privates.__billboardClusterGroup.getVisibleParent(layer);
                        if (cluster && !cluster.key) {
                            privates.__billboardClusterGroup.zoomToShowLayer(layer, function () {
                                $('.id_' + layer.key).addClass('cip-billboard-icon-hovered');
                            })

                        }
                        else {
                            $('.id_' + layer.key).addClass('cip-billboard-icon-hovered');
                        }
                        if (oldValue) {
                            removeHoveredClass(layers, oldValue, layer, cluster);
                        }
                        privates.__map.panTo(layer.getLatLng());
                        privates.__map.zoomIn(privates.__map.getMaxZoom());
                    });

                    //scope functions
                    scope.searchContentChanged = function (evt) {
                        if ($(evt.target).val() !== '') {
                            scope.searchDirty = true;
                            return;
                        }
                        scope.searchDirty = false;
                        removeMarkers();
                    };

                    scope.searchResource = function (val) {

                        return scope.getLocations({value: val});

                    };

                    scope.handleDrop = function (e) {
                        if (privates.__map) {
                            scope.$apply(function () {
                                var latLng = privates.__map.mouseEventToLatLng(e.originalEvent);
                                var poi = {latLng: latLng, radius: 1, title: "Dropped POI", address: latLng.toString().replace("LatLng(", "").replace(")", "")};
                                if (e.parentLayer && e.parentLayer.area) {
                                    poi.area = e.parentLayer.area;
                                }
                                openPoiPopupOOH(poi);
                                scope.pois.selectedPois.push(poi);
                            });
                        }


                    };

                    scope.$on('cip-map:poiStartDragBroadcast', function () {

                        privates.__InvertedShapeFeatureGroup.clearLayers();
                        closePoiPopupOOH();
                        scope.$apply(function () {
                            scope.poiSelectionState = true;
                            scope.selectedLayer = null;
                        });
                        var coordinatesArray = [];
                        _.each(scope.areas, function (area) {
                            var layerName = layerNameFormatterFilter(area.properties.layerType.toLowerCase()).toLowerCase();
                            coordinatesArray.push(area.geometry.coordinates);


                        });

                        var invertedShape = createMultiPolygon(coordinatesArray, {
                            color: 'black',
                            weight: 2,
                            opacity: 0.0,
                            fillColor: 'black',
                            fillOpacity: 0.3

                        });
                        privates.__InvertedShapeFeatureGroup.addLayer(invertedShape);
                        privates.__InvertedShapeFeatureGroup.addTo(privates.__map);
                        privates.__map.removeLayer(privates.__bboxShapes);
                        if (scope.areas && scope.areas.length != 0) {
                            _.each(privates.__shapes.getLayers(), function (shape) {
                                shape.setStyle({fillOpacity: 0.0, weight: 3, opacity: 0.5});
                            });
                        }


                    });

                    scope.$on('cip-map:poiEndDragBroadcast', function () {


                        scope.poiSelectionState = false;
                        privates.__InvertedShapeFeatureGroup.clearLayers();
                        privates.__map.removeLayer(privates.__InvertedShapeFeatureGroup);
                        privates.__bboxShapes.addTo(privates.__map);
                        _.each(privates.__shapes.getLayers(), function (shape) {
                            shape.setStyle({fillOpacity: shape.ops.colors.selected.opacity, weight: 1});
                        });


                    });


                    scope.cleanSearch = function () {
                        $('.fade-header input', el).val('');
                        $('.typeahead.dropdown-menu', el).hide();
                        scope.searchDirty = false;
                        removeMarkers();
                    };

                    scope.showSearchResults = function (res) {
                        privates.__map.fitBounds([
                            [res.boundingbox[0], res.boundingbox[2]],
                            [res.boundingbox[1], res.boundingbox[3]]
                        ]);
                        removeMarkers();
                        var icon = L.icon({
                            iconUrl: '/modules/cip-map/images/orange-dot.png',
                            iconAnchor: [13, 5]
                        });
                        res.model = res;
                        var searchText = searchTextFilterFilter(res);
                        var marker = L.marker([res.lat, res.lon],

                            {icon: icon}).bindPopup('<label class="marker-popup">' + searchText + '</label>',
                            {
                                autoPan: false,
                                closeOnClick: true,
                                closeButton: false
                            }).addTo(privates.__map);

                        marker.openPopup();
                        privates.__map.panTo([res.lat, res.lon]);
                        scope.markersList.push(marker);
                        $timeout(function () {
                            $('.fade-header-search input', el).val(searchText);
                        }, 2)
                    };

                    scope.removePoiOOH = function (poi) {
                        closePoiPopupOOH();
                        scope.pois.selectedPois.remove(poi);
                    }
                    scope.removeSelectedPoi = function (poi) {
                        closeSelectedPoiPopup();
                        if (poi.properties.group === 'group A') {
                            scope.pois.groupA.selected = null;
                        } else {
                            scope.pois.groupB.selected = null;
                        }
                    };

                    scope.selectedPoi = function (poi) {
                        if (poi.properties.group === 'group A') {
                            scope.pois.groupA.selected = poi;
                        } else {
                            scope.pois.groupB.selected = poi;
                        }
                    };

                    scope.searchParams = scope.$viewValue;
                    scope.fromWindowChange = false;
                    //initialization of leaflet map
                    initializeMap(scope, el);

                    /****************************************************** PRIVATE FUNCTIONS *******************************************************/
                    function removeMarkers() {
                        for (var i = 0; i < scope.markersList.length; i++) {
                            privates.__map.removeLayer(scope.markersList[i]);
                        }
                    }

                    function setOpacityEffect(area, shape) {
                        var duration = area.options.creation.animationDuration * 1000 / (Math.abs(area.options.creation.opacityRange[0] - area.options.creation.opacityRange[1]) * 100);
                        var currentOpacity = area.options.creation.opacityRange[0];
                        var stopOpacity = false;
                        var interval = $interval(function () {
                            shape.setStyle({fillOpacity: currentOpacity});
                            if ((currentOpacity) > area.options.creation.opacityRange[1]) {
                                currentOpacity -= 0.1;
                            }
                            else {
                                shape.setStyle({fillOpacity: area.options.colors.selected.opacity});
                                $interval.cancel(interval);
                            }
                        }, duration);
                        return {duration: duration, currentOpacity: currentOpacity, stopOpacity: stopOpacity};
                    }

                    function createAreas(areas, isAddedAreas, droppable) {
                        var shapes = [];
                        for (var i = 0; i < areas.length; i++) {
                            var shape;
                            var opacity = 0;
                            if (isAddedAreas) {
                                if (i + 1 === areas.length) {
                                    opacity = areas[i].options.creation.opacityRange[0];
                                } else {
                                    opacity = areas[i].options.creation.opacityRange[1];
                                }
                            }
                            switch (areas[i].geometry.type.toLowerCase()) {

                                case 'polygon':
                                {
                                    shape = L.polygon(areas[i].geometry.coordinates, {
                                        fillColor: areas[i].options.colors.selected.color,
                                        fillOpacity: opacity,
                                        color: areas[i].options.colors.selected.color,
                                        className: areas[i].isAnimated ? 'cip-map-layer-animation' : '',
                                        opacity: areas[i].isAnimated ? 1 : 0,
                                        droppable: droppable ? true : false,
                                        weight: 1
                                    });

                                    break;
                                }
                                case 'circle':
                                {
                                    shape = L.circle(areas[i].points[0], areas[i].radius, {
                                        fillColor: areas[i].options.colors.selected.color,
                                        fillOpacity: opacity,
                                        color: areas[i].options.colors.selected.color,
                                        className: areas[i].isAnimated ? 'cip-map-layer-animation' : '',
                                        opacity: areas[i].isAnimated ? 1 : 0,
                                        weight: 1
                                    });
                                    break;
                                }
                                case 'point':
                                {
                                    shape = L.circle(areas[i].properties.layerCenter, 50, {
                                        fillColor: areas[i].options.colors.selected.color,
                                        fillOpacity: opacity,
                                        color: areas[i].options.colors.selected.color,
                                        className: areas[i].isAnimated ? 'cip-map-layer-animation' : '',
                                        opacity: areas[i].isAnimated ? 1 : 0,
                                        weight: 1
                                    });
                                    break;
                                }
                                case 'rectangle':
                                {
                                    shape = L.rectangle(areas[i].points, {
                                        fillColor: areas[i].options.colors.selected.color,
                                        fillOpacity: opacity,
                                        color: areas[i].options.colors.selected.color,
                                        className: areas[i].isAnimated ? 'cip-map-layer-animation' : '',
                                        opacity: areas[i].isAnimated ? 1 : 0,
                                        weight: 1
                                    });
                                    break;
                                }
                            }
                            if (shape) {
                                shape.id = areas[i].id;
                                shape.type = areas[i].geometry.type.toLowerCase();
                                shape.ops = areas[i].options;
                                shape.area = areas[i];
                                shapes.push(shape);
                                bindLabelToShape(shape);
                            }

                        }
                        return shapes;
                    }

                    function bindLabelToShape(shape) {
                        var layerName = shape.area.properties.layerType.toLocaleLowerCase();
                        var labelContent = layerName === 'zip' ? shape.area.properties.layerCode : shape.area.properties.name;

                        if (layerName === 'zip') {
                            shape.bindLabel(labelContent, {'size': 1, 'bgClass': 'cip-map-poly-background-zip', 'fClass': 'cip-map-poly-foreground'});
                        } else if (layerName === 'county')
                            shape.bindLabel(labelContent, {'size': 4, 'bgClass': 'cip-map-poly-background-county', 'fClass': 'cip-map-poly-foreground'});
                    }

                    function initializeMapsControllers() {
                        var tileProtocol = (window.location.protocol !== 'https:') ? 'http:' : 'https:';

                        L.esri.BasemapLayer.TILES.openStreetMap = {
                            urlTemplate: tileProtocol + '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        };
                        privates.__EsriDayLarge = L.esri.basemapLayer('openStreetMap').addTo(privates.__map);
                        privates.__EsriSatLarge.baseMap = L.esri.basemapLayer('Imagery');
                        privates.__EsriSatLarge.baseLabel = L.esri.basemapLayer('ImageryLabels');
                        privates.__EsriSatLarge.baseRoads = L.esri.basemapLayer('ImageryTransportation', {opacity: 0.4});
                        privates.__EsriDaySmall = L.esri.basemapLayer('openStreetMap');
                        privates.__EsriSatSmall.baseMap = L.esri.basemapLayer('Imagery');
                        privates.__EsriSatSmall.baseLabel = L.esri.basemapLayer('ImageryLabels');
                    }

                    function windowSizeChangeMap() {
                        var mapEl = $(el.children()[0]);
                        scope.regularMapSelected = true;
                        scope.satMapSelected = false;
                        el.attr('style', 'display:block');
                        var parentHeight = el.parent().height() + 'px';
                        var parentWidth = el.parent().parent().width() + 'px';
                        el.height(scope.height ? scope.height + 'px' : parentHeight);
                        el.width(scope.width ? scope.width + 'px' : parentWidth);
                        mapEl.height(scope.height ? scope.height - 2 + 'px' : parentHeight);
                        mapEl.width(scope.width ? scope.width - 2 + 'px' : parentWidth);
                        scope.markersList = [];
                        return mapEl;
                    }

                    function initializeMap() {
                        var mapEl = windowSizeChangeMap();
                        if (campaignResults === true) {
                            privates.__map = L.map(mapEl[0], {
                                maxZoom: 17,
                                minZoom: 3,
                                zoomControl: false
                            }).setView([32.902276, -96.756437], 14);
                        }
                        else {
                            privates.__map = L.map(mapEl[0], {
                                maxZoom: 17,
                                minZoom: 3,
                                zoomControl: false
                            }).setView([39.5, -98], 4);
                        }
                        scope.fromWindowChange = false;

                        window.__map = privates.__map;
                        scope.mapZoom = 7;
                        privates.__map.on('moveend', function () {
                            if (!scope.$$phase && !scope.$root.$$phase) {
                                scope.$apply(function () {
                                    if (scope.billboardPopup){
                                        closeBillboardPopup();
                                    }
								});
                                return;
                            }

                            if (scope.billboardPopup){
                                closeBillboardPopup();
                            }
                        });

                        privates.__map.on('click', function () {
                            scope.$apply(function () {
                                scope.showMapLayersPopup = false;
                                if (scope.selectedLayer === undefined) {
                                    return;
                                }
                                scope.selectedLayer = null;
                            });
                        });
                        privates.__poiGroupAOut.addTo(privates.__map);
                        privates.__poiGroupBOut.addTo(privates.__map);
                        privates.__poiGroupARemain.addTo(privates.__map);
                        privates.__poiGroupBRemain.addTo(privates.__map);
                        privates.__poiGroupACurrentPage.addTo(privates.__map);
                        privates.__poiGroupBCurrentPage.addTo(privates.__map);
                        privates.__choroplethFeatureGroup.addTo(privates.__map);
                        privates.__poiClusterGroup.addTo(privates.__map);
                        privates.__billboardClusterGroup.addTo(privates.__map);
                        privates.__droppedPoiGroup.addTo(privates.__map);
                        privates.__map.addControl(new L.control.zoom(
                            {position: 'bottomright'}
                        ));

                        initializeMapsControllers();
                        initializeMiniMap();

                        if (scope.isCampaign) {
                            $('.leaflet-bottom.leaflet-right').attr('style', 'right:21px !important;bottom:19px !important');
                        }

                        var mapLayersTemplate = $templateCache.get('mapLayersTemplate.html');
                        mapLayersTemplate = $compile(mapLayersTemplate)(scope);
                        $(el).append(mapLayersTemplate);
                        $('.map_layers_popup', el).mousemove(function (evt) {
                            evt.stopPropagation();
                        });

                        $('.leaflet-control-zoom-in', el).html($templateCache.get('plus'));
                        $('.leaflet-control-zoom-out', el).html($templateCache.get('minus'));
                        var zoomToSee = $templateCache.get('zoom-to-see.html');
                        var zoomToSeeTemplate = $compile(zoomToSee)(scope);
                        $(zoomToSeeTemplate).insertBefore('.leaflet-control-zoom-in');
                        $('.cip-map-zoom-to-see').hide();
                        scope.selectedBillboard = {};
                        if (scope.visitorAnalysis) {
                            var atlanta = [
                                {'lat': 33.16749, 'lon': -83.330612},
                                {'lat': 33.185321, 'lon': -83.436782},
                                {'lat': 33.131923, 'lon': -83.815347},
                                {'lat': 33.181782, 'lon': -83.824024},
                                {'lat': 33.193586, 'lon': -83.840265},
                                {'lat': 33.20269, 'lon': -84.039813},
                                {'lat': 32.953897, 'lon': -84.043969},
                                {'lat': 32.931504, 'lon': -84.054146},
                                {'lat': 32.932182, 'lon': -84.12316},
                                {'lat': 32.801884, 'lon': -84.12429},
                                {'lat': 32.791675, 'lon': -84.153785},
                                {'lat': 32.690603, 'lon': -84.202323},
                                {'lat': 32.738571, 'lon': -84.238523},
                                {'lat': 32.725318, 'lon': -84.25482},
                                {'lat': 32.779024, 'lon': -84.347395},
                                {'lat': 32.779178, 'lon': -84.380398},
                                {'lat': 32.834531, 'lon': -84.414908},
                                {'lat': 32.826247, 'lon': -84.450723},
                                {'lat': 32.860313, 'lon': -84.490276},
                                {'lat': 32.875132, 'lon': -84.475114},
                                {'lat': 32.883399, 'lon': -84.497042},
                                {'lat': 32.845179, 'lon': -84.570669},
                                {'lat': 32.844591, 'lon': -84.692509},
                                {'lat': 32.869626, 'lon': -84.760187},
                                {'lat': 32.870513, 'lon': -85.179206},
                                {'lat': 33.108078, 'lon': -85.232377},
                                {'lat': 33.106636, 'lon': -85.653379},
                                {'lat': 33.495886, 'lon': -85.643481},
                                {'lat': 33.498577, 'lon': -85.763854},
                                {'lat': 33.469349, 'lon': -85.782734},
                                {'lat': 33.469442, 'lon': -85.887772},
                                {'lat': 33.556198, 'lon': -85.796134},
                                {'lat': 33.556062, 'lon': -85.745771},
                                {'lat': 33.594435, 'lon': -85.742341},
                                {'lat': 33.606614, 'lon': -85.724745},
                                {'lat': 33.627167, 'lon': -85.655809},
                                {'lat': 33.660506, 'lon': -85.638577},
                                {'lat': 33.773266, 'lon': -85.638059},
                                {'lat': 33.802028, 'lon': -85.58601},
                                {'lat': 33.844281, 'lon': -85.585227},
                                {'lat': 33.846496, 'lon': -85.636881},
                                {'lat': 33.867647, 'lon': -85.637022},
                                {'lat': 33.88975, 'lon': -85.601858},
                                {'lat': 33.889153, 'lon': -85.532482},
                                {'lat': 33.941719, 'lon': -85.520046},
                                {'lat': 33.964168, 'lon': -85.403415},
                                {'lat': 34.282452, 'lon': -85.461391},
                                {'lat': 34.286092, 'lon': -85.387346},
                                {'lat': 34.368903, 'lon': -85.335937},
                                {'lat': 34.435979, 'lon': -85.180633},
                                {'lat': 34.580284, 'lon': -85.111248},
                                {'lat': 34.587184, 'lon': -85.060498},
                                {'lat': 34.622451, 'lon': -85.060379},
                                {'lat': 34.615719, 'lon': -84.926362},
                                {'lat': 34.634063, 'lon': -84.908298},
                                {'lat': 34.615862, 'lon': -84.898916},
                                {'lat': 34.608314, 'lon': -84.78035},
                                {'lat': 34.623103, 'lon': -84.734454},
                                {'lat': 34.614325, 'lon': -84.714209},
                                {'lat': 34.612763, 'lon': -84.731318},
                                {'lat': 34.59907, 'lon': -84.731223},
                                {'lat': 34.583283, 'lon': -84.664397},
                                {'lat': 34.593686, 'lon': -84.654506},
                                {'lat': 34.733204, 'lon': -84.653877},
                                {'lat': 34.780333, 'lon': -84.637567},
                                {'lat': 34.821639, 'lon': -84.583166},
                                {'lat': 34.866108, 'lon': -84.622738},
                                {'lat': 34.98833, 'lon': -84.621482},
                                {'lat': 34.987336, 'lon': -84.005409},
                                {'lat': 35.02031, 'lon': -83.962496},
                                {'lat': 35.0515, 'lon': -83.959358},
                                {'lat': 35.08296, 'lon': -83.905335},
                                {'lat': 35.137072, 'lon': -83.857142},
                                {'lat': 35.160571, 'lon': -83.748814},
                                {'lat': 35.153739, 'lon': -83.649696},
                                {'lat': 35.140199, 'lon': -83.654296},
                                {'lat': 35.08697, 'lon': -83.583906},
                                {'lat': 35.00286, 'lon': -83.521945},
                                {'lat': 34.993081, 'lon': -83.101164},
                                {'lat': 34.955241, 'lon': -83.124377},
                                {'lat': 34.939242, 'lon': -83.114833},
                                {'lat': 34.877936, 'lon': -83.234406},
                                {'lat': 34.846268, 'lon': -83.248192},
                                {'lat': 34.841654, 'lon': -83.270176},
                                {'lat': 34.821965, 'lon': -83.268242},
                                {'lat': 34.817397, 'lon': -83.304714},
                                {'lat': 34.788692, 'lon': -83.324059},
                                {'lat': 34.758565, 'lon': -83.318738},
                                {'lat': 34.731584, 'lon': -83.351055},
                                {'lat': 34.684082, 'lon': -83.345008},
                                {'lat': 34.675296, 'lon': -83.365285},
                                {'lat': 34.488674, 'lon': -83.456274},
                                {'lat': 34.445321, 'lon': -83.388838},
                                {'lat': 34.319073, 'lon': -83.388808},
                                {'lat': 34.263523, 'lon': -83.339143},
                                {'lat': 34.223551, 'lon': -83.355009},
                                {'lat': 34.26317, 'lon': -83.301289},
                                {'lat': 34.243154, 'lon': -83.244049},
                                {'lat': 34.241328, 'lon': -83.166961},
                                {'lat': 34.273565, 'lon': -83.115695},
                                {'lat': 34.224335, 'lon': -83.077946},
                                {'lat': 34.164544, 'lon': -83.09774},
                                {'lat': 34.147922, 'lon': -83.061014},
                                {'lat': 34.083354, 'lon': -83.019627},
                                {'lat': 34.02752, 'lon': -82.934243},
                                {'lat': 34.022918, 'lon': -82.943519},
                                {'lat': 34.008078, 'lon': -82.92809},
                                {'lat': 34.011972, 'lon': -82.908355},
                                {'lat': 33.984451, 'lon': -82.864401},
                                {'lat': 33.987194, 'lon': -82.819789},
                                {'lat': 33.962511, 'lon': -82.782248},
                                {'lat': 33.922577, 'lon': -82.873138},
                                {'lat': 33.78698, 'lon': -82.985115},
                                {'lat': 33.737989, 'lon': -82.951891},
                                {'lat': 33.696411, 'lon': -82.993598},
                                {'lat': 33.66584, 'lon': -82.9535},
                                {'lat': 33.614675, 'lon': -82.980123},
                                {'lat': 33.625538, 'lon': -82.997114},
                                {'lat': 33.603283, 'lon': -82.989781},
                                {'lat': 33.586461, 'lon': -83.009659},
                                {'lat': 33.489939, 'lon': -82.985592},
                                {'lat': 33.359725, 'lon': -83.158358},
                                {'lat': 33.313507, 'lon': -83.147125},
                                {'lat': 33.277768, 'lon': -83.222428},
                                {'lat': 33.257779, 'lon': -83.228244},
                                {'lat': 33.2597, 'lon': -83.248333},
                                {'lat': 33.19131, 'lon': -83.27524},
                                {'lat': 33.16749, 'lon': -83.330612}
                            ];
                            var invertedShape = createMultiPolygon([atlanta],{
                                color: 'white',
                                weight: 3,
                                opacity: 1,
                                fillColor: 'white',
                                fillOpacity: 0.7

                            });
                            privates.__InvertedShapeFeatureGroup.addLayer(invertedShape);
                            privates.__InvertedShapeFeatureGroup.addTo(privates.__map);
                        }
                        privates.__shapes.addTo(privates.__map);

                    }

                    function createMultiPolygon( coordinatesArray,style){
                        var canvas = [
                            [ 115.31249999999999, 88.82185609405268],
                            [ 115.31249999999999, -72.3957057065326],
                            [-387.421875, -72.3957057065326],
                            [-387.421875, 88.82185609405268]
                        ];

                        var coordinates = [canvas];
                        for (var i = 0; i < coordinatesArray.length; i++) {
                            var holePart = [];
                            for (var j = 0; j < coordinatesArray[i].length; j++) {
                                holePart.push([coordinatesArray[i][j].lon, coordinatesArray[i][j].lat])
                            }
                            coordinates.push(holePart);
                        }

                        var mp = {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'MultiPolygon',
                                'coordinates': [
                                    coordinates
                                ]
                            },
                            'properties': {
                                'name': 'MultiPolygon',
                                'style': style ? style : {
                                    color: 'black',
                                    weight: 1,
                                    opacity: 0,
                                    fillColor: 'black',
                                    fillOpacity: 1
                                }
                            }
                        };
                        return new L.GeoJSON(mp, {
                            style: function (feature) {
                                return feature.properties.style
                            }
                        });
                    }
                    function initializeMiniMap() {
                        scope.selectedMap = 'nokiaDay';
                        scope.selectSatMap = function () {
                            scope.showMapLayersPopup = false;
                            scope.dayMapSelected = false;
                            scope.regularMapSelected = false;
                            scope.satMapSelected = true;
                            if (scope.selectedMap === 'nokiaDay') {
                                scope.selectedMap = 'nokiaSat';
                                privates.__map.removeLayer(privates.__EsriDayLarge);
                                privates.__EsriSatLarge.baseMap.addTo(privates.__map);
                                privates.__EsriSatLarge.baseRoads.addTo(privates.__map);
                                privates.__EsriSatLarge.baseLabel.addTo(privates.__map);
                            }
                        };

                        scope.selectRegularMap = function () {
                            scope.regularMapSelected = true;
                            scope.satMapSelected = false;
                            scope.dayMapSelected = true;
                            if (scope.selectedMap === 'nokiaSat') {
                                scope.selectedMap = 'nokiaDay';
                                privates.__map.removeLayer(privates.__EsriSatLarge.baseMap);
                                privates.__map.removeLayer(privates.__EsriSatLarge.baseLabel);
                                privates.__map.removeLayer(privates.__EsriSatLarge.baseRoads);
                                privates.__EsriDayLarge.addTo(privates.__map);
                            }
                            scope.showMapLayersPopup = false;
                        };
                        scope.addLayerToAreas = function () {
                            scope.areas.push(scope.selectedLayer);
                        };

                        scope.removeLayerFromAreas = function () {


                                for(var i=0 ; i< scope.areas.length;i++){
                                    var area = scope.areas[i];
                                    if (area.id === scope.selectedLayer.id){
                                        var removedArea = scope.areas.splice(i,1);
                                        continue;
                                    }
                                }

                                if (!removedArea || removedArea.length === 0 ) {
                                    return;
                                }

                                scope.pois.selectedPois = _.reject(scope.pois.selectedPois,function(poi){
                                    return poi.area && poi.area.id === removedArea[0].id;
                                });
                                scope.selectedLayer = null;

                                scope.clearSearchBox();
                        }


                    }
                    function removeLayerFromBBox(layer){
                        var index = 0;
                        var removeLayerFromBBox = _.find(scope.bboxAreas,function(ar){
                            index++;
                            return ar.id === layer.id;
                        });
                        scope.bboxAreas.splice(index,1);
                    }

                    function findLayer(layer, group) {
                        return  _.find(group.filteredOut, function (f) {
                            return f.id === layer.poi.id;
                        });
                    }

                    function removeHoveredClass(layers, oldValue, layer, cluster) {
                        var prevLayer = _.find(layers, function (l) {
                            return l.key === oldValue;
                        });
                        if (prevLayer)
                            var prevCluster = privates.__billboardClusterGroup.getVisibleParent(prevLayer);
                        if (prevLayer) {
                            $('.id_' + prevLayer.key).removeClass('cip-billboard-icon-hovered');
                        }
                        if (prevCluster && !prevCluster.key && prevCluster !== cluster) {
                            $(prevCluster._icon).removeClass('cip-billboard-icon-cluster-hovered');
                        }
                    }
                    /*************************************************** SHAPES EVENTS CALLBACKS ****************************************************/
                    function handlePoiClick(evt) {
                        var layer = {}
                        if (evt.layer) {
                            layer = evt.layer;
                            openPoiPopup(evt.layer);
                        } else {
                            layer = evt.target;
                            openSelectedPoiPopup(evt.target);
                        }

                        var filtered = findLayer(layer, scope.pois.groupA);
                        if (!filtered) {
                            filtered = findLayer(layer, scope.pois.groupB);
                        }
                        scope.$apply(function () {
                            if (filtered) {
                                scope.isInFilteredOut = true;
                            } else {
                                scope.isInFilteredOut = false;
                            }
                        })


                    }

                    function handlePoiClickOOH(evt){
                        if(evt.layer && evt.layer.poi) {
                            scope.$apply(function () {
                                openPoiPopupOOH(evt.layer.poi);
                            });
                        }

                    }

                    function handleShapeClick(evt) {
                        closePoiPopupOOH()
                        scope.showMapLayersPopup = false;
                        openPopup(evt.layer);
                        scope.$apply(function () {
                            scope.currentLayer = evt.layer.area;
                            scope.selectedLayer = evt.layer.area;
                        })


                    }

                    function handleShapeMouseMove(evt) {
                        if (scope.poiSelectionState){
                            return;
                        }
                        var area = _.find(scope.areas,function(ar){
                            return evt.layer.id===ar.id;
                        });

                        scope.$apply(function () {
                            area.hovered = true;
                        });

                        //TODO: check ie9 support
                        evt.layer._path.classList.remove('cip-map-layer-animation');

                        evt.layer.setStyle({
                            fillOpacity: evt.layer.ops.colors.selectedHovered.opacity,
                            fillColor: evt.layer.ops.colors.selectedHovered.color
                        });

                        privates.__hoveredShape = evt.layer;

                    }

                    function handleMouseOut(evt) {
                        if (scope.poiSelectionState){
                            return;
                        }
                        var area = _.find(scope.areas,function(ar){
                            return evt.layer.id===ar.id;
                        });

                        scope.$apply(function () {
                            area.hovered = false;
                        });

                        privates.__hoveredShape.setStyle({
                            fillOpacity: privates.__hoveredShape.ops.colors.selected.opacity,
                            fillColor: privates.__hoveredShape.ops.colors.selected.color
                        });


                    }

                    function handleBboxShapeMouseMove(evt) {
                        if (scope.poiSelectionState){
                            return;
                        }
                        evt.layer.setStyle({
                            fillOpacity: evt.layer.ops.colors.hovered.opacity,
                            opacity: 1
                        });
                    }

                    function handleBboxMouseOut(evt) {
                        if (scope.poiSelectionState){
                            return;
                        }
                        evt.layer.setStyle({
                            fillOpacity: 0,
                            opacity: 0
                        });
                    }

                    function handleBboxShapeClick(evt) {
                        scope.$apply(function () {
                            scope.showMapLayersPopup = false;
                            scope.bboxAreas.remove(evt.layer.area);
                            scope.selectedLayer = evt.layer.area;
                        });


                    }

                    /*************************************************** SHAPES EVENTS CALLBACKS END ****************************************************/

                    function getPolygonUpperPoint(points) {
                        var maxLat = 0;
                        var point;
                        for (var i = 0; i < points.length; i++) {
                            if (points[i].lat != undefined) {
                                if (i === 0)
                                    point = points[i];
                                if (points[i].lat > maxLat) {
                                    maxLat = points[i].lat;
                                    point = points[i];
                                }
                            }
                            else {
                                if (i === 0)
                                    point = {lat: points[i].latLng.lat, lng: points[i].latLng.lng};
                                if (points[i].latLng.lat > maxLat) {
                                    maxLat = points[i].latLng.lat;
                                    point = {lat: points[i].latLng.lat, lng: points[i].latLng.lng};
                                }

                            }
                        }
                        return point;
                    }

                    //TODO: refactor below functions as they almost the same
                    function createBlurClusterAIcon(cluster) {
                        return createClusterIcon(cluster, 'Orange', true);
                    }

                    function createBlurClusterBIcon(cluster) {
                        return  createClusterIcon(cluster, 'Green', true);
                    }

                    function createClusterAIcon(cluster, opcity) {
                        return createClusterIcon(cluster, 'Orange', false);
                    }

                    function createClusterBIcon(cluster, fade) {
                        return  createClusterIcon(cluster, 'Green', false);
                    }

                    function createClusterIcon(cluster, color, fade, icon) {
                        if (cluster.getChildCount().toString().length === 4) {
                            return new L.DivIcon({
                                html: $templateCache.get('clusterCircle' + color) + '<div class="poi-circle-cluster-div" style="width: 45px;">' + cluster.getChildCount() + '</div>',
                                className: fade ? 'cip-poi-circle-icon-cluster cip-poi-circle-icon-fade' : 'cip-poi-circle-icon-cluster'
                            });
                        }
                        else if (cluster.getChildCount().toString().length === 3) {
                            return new L.DivIcon({
                                html: $templateCache.get('clusterCircle' + color) + '<div class="poi-circle-cluster-div" style="width: 34px;">' + cluster.getChildCount() + '</div>',
                                className: fade ? 'cip-poi-circle-icon-cluster cip-poi-circle-icon-fade' : 'cip-poi-circle-icon-cluster'
                            });
                        }
                        else if (cluster.getChildCount().toString().length === 2) {
                            return new L.DivIcon({
                                html: $templateCache.get('clusterCircle' + color) + '<div class="poi-circle-cluster-div" style="width: 27px;">' + cluster.getChildCount() + '</div>',
                                className: fade ? 'cip-poi-circle-icon-cluster cip-poi-circle-icon-fade' : 'cip-poi-circle-icon-cluster'

                            });
                        }
                        else if (cluster.getChildCount().toString().length === 1) {
                            return new L.DivIcon({
                                html: $templateCache.get('clusterCircle' + color) + '<div class="poi-circle-cluster-div" style="width: 25px;">' + cluster.getChildCount() + '</div>',
                                className: fade ? 'cip-poi-circle-icon-cluster cip-poi-circle-icon-fade' : 'cip-poi-circle-icon-cluster'});
                        }
                        else {
                            return new L.DivIcon({
                                html: $templateCache.get('clusterCircle' + color) + '<div class="poi-circle-cluster-div" style="width: 47px;">' + cluster.getChildCount() + '</div>',
                                className: fade ? 'cip-poi-circle-icon-cluster cip-poi-circle-icon-fade' : 'cip-poi-circle-icon-cluster'});
                        }
                    }

                    function openPopup(layer) {
                        var isInAraes = _.find(scope.areas, function (area) {
                            return area.id === layer.id;
                        });

                        scope.hideAddAreaTemplate = isInAraes ? true : false;
                        closePoiPopupOOH();
                        scope.layerPopupTemplet = $compile($templateCache.get('layerPopup.html'))(scope)[0];
                        scope.layerPopup = L.popup({closeButton: false, minWidth: 200, keepInView: true, autoPanPadding: [100, 100]})
                            .setLatLng(getPolygonUpperPoint(layer.getLatLngs()))
                            .setContent(scope.layerPopupTemplet)
                            .openOn(privates.__map);
                    }

                    function popupOpen(layer) {
                        if ((scope.pois.groupA.selected && layer.poi.id === scope.pois.groupA.selected.id) || (scope.pois.groupB.selected && layer.poi.id === scope.pois.groupB.selected.id)) {
                            scope.hideAddPoiTemplate = true;
                        }
                        else {
                            if (layer.poi.properties.group === 'group A') {
                                scope.groupB = false;
                            }
                            else {
                                scope.groupB = true;
                            }
                            scope.hideAddPoiTemplate = false;
                        }
                        scope.poi = layer.poi;
                        scope.poiPopupTemplet = $compile($templateCache.get('poiPopup.html'))(scope)[0];
                        if (privates.__poiPopup === null) {
                            privates.__poiPopup = L.popup({closeButton: false, minWidth: 200, offset: [-5, -35],keepInView: true,autoPanPadding: [100, 100]})
                        }
                        else {
                            privates.__map.removeLayer(privates.__poiPopup);
                        }
                        privates.__poiPopup.setLatLng(layer.getLatLng()).setContent(scope.poiPopupTemplet);
                        scope.currentMarker = layer;
                        privates.__map.addLayer(privates.__poiPopup);


                    }


                    function openPoiPopupOOH(poi) {

                        scope.poi = poi;
                        closeLayerPopup();
                        scope.selectedLayer = null;
                        scope.poiPopupTemplet = $compile($templateCache.get('droppedPoiPopup.html'))(scope)[0];
                        if(privates.__poiPopup===null){
                            privates.__poiPopup = L.popup({closeButton: false, minWidth: 200, offset: [-5, -35],autoPanPadding:[100,100], keepInView: true})
                        }
                        else{
                            privates.__map.removeLayer(privates.__poiPopup);
                        }
                        privates.__poiPopup.setLatLng(poi.latLng).setContent(scope.poiPopupTemplet);

                        privates.__map.addLayer(privates.__poiPopup);
                        var poiLayers = _.filter(privates.__droppedPoiGroup.getLayers(),function(layer){
                            return layer.poi === poi;
                        })
                        if(poiLayers && poiLayers.length === 2) {
                            if(poiLayers[0].layerType === 'circle'){
                                zoomOutIfNeeded(poiLayers[1],poiLayers[0]);
                            }else{
                                zoomOutIfNeeded(poiLayers[0],poiLayers[1]);
                            }

                        }

                    }
                    function zoomOutIfNeeded(marker, circle){
                        if (!marker || !circle){
                            return ;
                        }
                        if (privates.__map.getBounds().contains(marker.getLatLng()) && !privates.__map.getBounds().contains(circle.getBounds())){
                           privates.__map.fitBounds(circle.getBounds(),{padding: [0, 40]});
                        }
                    }
                    function closePoiPopupOOH(){
                        if (privates.__poiPopup!==null) {
                            privates.__map.removeLayer(privates.__poiPopup);

                        }
                    }
                    function closePoiPopupOOH(){
                        if (privates.__poiPopup!==null) {
                            privates.__map.removeLayer(privates.__poiPopup);
                        }
                    }
                    function selectedPopupOpen(layer) {
                        closePoiPopup();
                        if ((scope.pois.groupA.selected && layer.poi.id === scope.pois.groupA.selected.id) || (scope.pois.groupB.selected && layer.poi.id === scope.pois.groupB.selected.id)) {
                            scope.hideAddPoiTemplate = true;
                        }
                        else {
                            if (layer.poi.properties.group === 'group A') {
                                scope.groupB = false;
                            }
                            else {
                                scope.groupB = true;
                            }
                            scope.hideAddPoiTemplate = false;
                        }
                        if (privates.__selectedPoiPopup === null) {
                            privates.__selectedPoiPopup = L.popup({closeButton: false, minWidth: 200, offset: [-5, -35], autoPanPadding: [100, 100], closeOnClick: false,keepInView:true})
                        }
                        else {
                            privates.__map.removeLayer(privates.__selectedPoiPopup);
                        }
                        scope.selectedPoiP = layer.poi;
                        scope.poiPopupTemplet = $compile($templateCache.get('selectedPoiPopup.html'))(scope)[0];
                        privates.__selectedPoiPopup.setLatLng(layer.getLatLng()).setContent(scope.poiPopupTemplet)
                        privates.__map.addLayer(privates.__selectedPoiPopup);

                        scope.currentMarker = layer;
                        privates.__map.zoomIn(privates.__map.getMaxZoom());
                        privates.__map.panTo([scope.currentMarker.poi.geometry.coordinates[0].lat, scope.currentMarker.poi.geometry.coordinates[0].lon]);
                    }

                    function openPoiPopup(layer) {
                        if (!scope.$parent.$$phase) {
                            scope.$apply(function () {
                                popupOpen(layer);
                            });
                        }
                        else {
                            popupOpen(layer)
                        }
                    }

                    function openSelectedPoiPopup(layer) {
                        if (!scope.$parent.$$phase) {
                            scope.$apply(function () {
                                selectedPopupOpen(layer);
                            });
                        }
                        else {
                            selectedPopupOpen(layer)
                        }
                    }

                    function closeLayerPopup() {
                        if (scope.layerPopup) {
                            scope.layerPopup._close();
                        }
                    }

                    function closePoiPopup() {
                        if (privates.__poiPopup !== null) {
                            privates.__map.removeLayer(privates.__poiPopup);
                        }
                    }

                    function closeSelectedPoiPopup() {
                        if (privates.__selectedPoiPopup !== null) {
                            privates.__map.removeLayer(privates.__selectedPoiPopup);
                        }
                    }


                    function closeBillboardPopup() {
                        scope.billboardPopup._close();
                    }

                    function openBillboardPopup(center, offset, billboard) {
                        scope.billboardPopupTemplet = $compile($templateCache.get('billboardPopup.html'))(scope)[0];
                        scope.$apply(function () {

                            scope.selectedBillboard.billboardType = billboard.subtype;
                            scope.selectedBillboard.billboardNumber = billboard.key[0];
                            scope.selectedBillboard.address = billboard.panelDescription;
                        });

                        scope.billboardPopup = L.popup({closeButton: false, minWidth: 200, offset: offset})
                            .setContent(scope.billboardPopupTemplet)
                            .setLatLng(center)
                            .openOn(privates.__map);
                    }

                    function billboardMouseHover(evt) {
                        openBillboardPopup(evt.target.getLatLng(), [10, -15], evt.target.billboard);
                        scope.$apply(function () {
                            scope.hoverBillboardId = evt.target.key;
                        });
                    }

                    function billboardMouseOut() {
                        scope.$apply(function () {
                            scope.hoverBillboardId = null;
                        });
                    }

                    function windowSizeChanged() {
                        if (!scope.$$phase && !scope.$root.$$phase) {
                            scope.$apply(function () {
                                if (scope.windowSizeChange !== window.innerWidth) {
                                    scope.windowSizeChange = window.innerWidth;
                                }
                                else {
                                    scope.windowSizeChange = window.innerHeight;
                                }
                            });
                        } else {
                            if (scope.windowSizeChange !== window.innerWidth) {
                                scope.windowSizeChange = window.innerWidth;
                            }
                            else {
                                scope.windowSizeChange = window.innerHeight;
                            }
                        }

                    }

                    function removePrevSelectedPoi(poi, secondaryGroupArray) {
                        if (poi.properties.group === 'group A') {
                            scope.groupB = false;
                            var fromSecondary = false;
                            var marker = _.find(privates.__poiGroupACurrentPage.getLayers(), function (m) {
                                return m.poi.id == poi.id;
                            });
                            if (!marker) {
                                fromSecondary = true;
                                marker = _.find(secondaryGroupArray, function (m) {
                                    return m.poi.id == poi.id;
                                });
                            }

                            if (marker) {
                                if (!fromSecondary) {
                                    marker.setIcon(L.divIcon({
                                        html: $templateCache.get('markerPinOrange'),
                                        iconAnchor: [11, 29],
                                        className: 'cip-poi-icon _id' + poi.id
                                    }))
                                } else {
                                    marker.setIcon(L.divIcon({
                                        html: $templateCache.get('clusterCircleOrange'),
                                        iconAnchor: [11, 29],
                                        className: 'cip-poi-circle-icon-cluster _id' + poi.id
                                    }))
                                }

                            }
                        } else {
                            scope.groupB = true;
                            marker = _.find(privates.__poiGroupBCurrentPage.getLayers(), function (m) {
                                return m.poi.id == poi.id;
                            });
                            if (!marker) {
                                fromSecondary = true;
                                marker = _.find(secondaryGroupArray, function (m) {
                                    return m.poi.id == poi.id;
                                });
                            }

                            if (marker) {
                                if (!fromSecondary) {
                                    marker.setIcon(L.divIcon({
                                        html: $templateCache.get('markerPinGreen'),
                                        iconAnchor: [11, 29],
                                        className: 'cip-poi-icon _id' + poi.id
                                    }));
                                } else {
                                    marker.setIcon(L.divIcon({
                                        html: $templateCache.get('clusterCircleGreen'),
                                        iconAnchor: [11, 29],
                                        className: 'cip-poi-circle-icon-cluster _id' + poi.id
                                    }));
                                }
                            }
                        }
                    }

                    function setSelectedPoi(newPoi, oldPoi, groupArray, group, secondaryGroupArray) {
                        scope.groupB = group;

                        if (!newPoi && oldPoi) {
                            scope.hideAddPoiTemplate = false;
                            scope.hideAddPoiGroupATemplate = true;
                            closePoiPopup();
                            removePrevSelectedPoi(oldPoi, secondaryGroupArray);
                            return;
                        }
                        var marker = _.find(groupArray, function (m) {
                            return m.poi.id === newPoi.id;
                        });
                        if (!marker)
                            marker = _.find(secondaryGroupArray, function (m) {
                                return m.poi.id === newPoi.id;
                            });

                        var markerClass = 'markerStarGreen';
                        if (!group) {
                            privates.__poiGroupACurrentPage.zoomToShowLayer(marker, function () {
                            });
                            markerClass = 'markerStarOrange';
                        }
                        else {
                            privates.__poiGroupBCurrentPage.zoomToShowLayer(marker, function () {
                            });
                        }
                        marker.setIcon(L.divIcon({
                            html: $templateCache.get(markerClass),
                            iconAnchor: [11, 29],
                            className: 'cip-poi-icon _id' + newPoi.id
                        }));
                        openPoiPopup(marker);
                        scope.currentMarker = marker;
                        scope.hideAddPoiTemplate = true;
                        if (oldPoi) {
                            removePrevSelectedPoi(oldPoi, secondaryGroupArray);
                        }
                    }

                    function handleHoverOnPoi(evt) {
                        if (evt.target.poi.properties.group === 'group A') {
                            scope.$apply(function () {
                                scope.pois.groupA.hovered = evt.target.poi;
                            });
                            return;
                        }
                        scope.$apply(function () {
                            scope.pois.groupB.hovered = evt.target.poi;
                        });

                        return;
                    }

                    function handleHoverOutPoi(evt) {
                        if (evt.target.poi.properties.group === 'group A') {
                            scope.$apply(function () {
                                scope.pois.groupA.hovered = null;
                            });
                            return;
                        }
                        scope.$apply(function () {
                            scope.pois.groupB.hovered = null;
                        });
                        return;
                    }


                    function redrawGroupA() {
                        drawCurrentAPoi(scope.pois.groupA.currentPagePoi);
                        drawRemainAPoi(scope.pois.groupA.remainPoi);
                        drawFilteredOutA(scope.pois.groupA.filteredOut);
                        drawSelectedAPoi(scope.pois.groupA.selected);
                    }

                    function redrawGroupB() {
                        drawCurrentBPoi(scope.pois.groupB.currentPagePoi);
                        drawRemainBPoi(scope.pois.groupB.remainPoi);
                        drawFilteredOutB(scope.pois.groupB.filteredOut);
                        drawSelectedBPoi(scope.pois.groupB.selected);
                    }

                    function drawSelectedAPoi(newPoi) {
                        closeSelectedPoiPopup();
                        closePoiPopup();
                        if (privates.__selectedGroupA) {
                            privates.__map.removeLayer(privates.__selectedGroupA);
                            privates.__selectedGroupA = null;
                        }
                        if (newPoi && (!scope.pois.choroplethMode || (scope.pois.choroplethMode && scope.pois.groupA.isGroupOnCharts))) {
                            scope.hideAddPoiTemplate = true;
                            var marker = L.marker([newPoi.geometry.coordinates[0].lat, newPoi.geometry.coordinates[0].lon], { icon: L.divIcon({
                                html: $templateCache.get('markerStarOrange'),
                                iconAnchor: [11, 29],
                                className: 'cip-poi-icon-hover _id' + newPoi.id
                            })}).on('click', handlePoiClick);
                            marker.poi = newPoi;
                            marker.addTo(privates.__map);
                            privates.__selectedGroupA = marker;
                            openSelectedPoiPopup(marker);
                        } else {
                            if (scope.poiPopup) {
                                scope.hideAddPoiTemplate = false;
                                closePoiPopup();
                            }
                        }
                    }

                    function drawCurrentAPoi(newPois) {
                        privates.__poiGroupACurrentPage.clearLayers();
                        if (!newPois || (scope.pois.choroplethMode && !scope.pois.groupA.isGroupOnCharts)) {
                            return;
                        }


                        for (var i = 0; i < newPois.length; i++) {
                            if (!scope.pois.groupA.selected || scope.pois.groupA.selected.id !== newPois[i].id) {
                                var marker = L.marker([newPois[i].geometry.coordinates[0].lat, newPois[i].geometry.coordinates[0].lon], {
                                    icon: L.divIcon({
                                        html: $templateCache.get('markerPinOrange'),
                                        iconAnchor: [11, 29],
                                        className: 'cip-poi-icon _id' + newPois[i].id
                                    })}).on('mouseover', handleHoverOnPoi).on('mouseout', handleHoverOutPoi);
                                marker.poi = newPois[i];
                                marker.group = 'currentPagePoi';
                                privates.__poiGroupACurrentPage.addLayer(marker);
                            }
                        }
                        if (scope.pois.groupA.isGroupOnCharts) {
                            fitSearchBounds(scope.pois.groupA.currentPagePoi, scope.pois.groupA.remainPoi)
                        }
                    }

                    function drawRemainAPoi(newPois) {
                        privates.__poiGroupARemain.clearLayers();
                        if (!newPois || newPois.length === 0 || (scope.pois.choroplethMode && !scope.pois.groupA.isGroupOnCharts)) {
                            return;
                        }
                        for (var i = 0; i < newPois.length; i++) {
                            var index = i + 11;
                            if (!scope.pois.groupA.selected || scope.pois.groupA.selected.id !== newPois[i].id) {

                                var marker = L.marker([newPois[i].geometry.coordinates[0].lat, newPois[i].geometry.coordinates[0].lon], { icon: L.divIcon({
                                    html: $templateCache.get('clusterCircleOrange'),
                                    iconAnchor: [11, 29],
                                    className: 'cip-poi-circle-icon-cluster'
                                })});

                                marker.poi = newPois[i];
                                marker.poi.properties.title = ' #' + index + '.' + newPois[i].properties.name;
                                marker.group = 'remainAPoi';

                                privates.__poiGroupARemain.addLayer(marker);
                            } else {
                                scope.pois.groupA.selected.index = index;
                            }

                        }
                        if (scope.pois.groupA.isGroupOnCharts) {
                            fitSearchBounds(scope.pois.groupA.currentPagePoi, scope.pois.groupA.remainPoi);
                        }
                    }

                    function drawFilteredOutA(newPois) {
                        privates.__poiGroupAOut.clearLayers();
                        if (!newPois || (scope.pois.choroplethMode && !scope.pois.groupA.isGroupOnCharts)) {
                            return;
                        }
                        for (var i = 0; i < newPois.length; i++) {
                            var marker = L.marker([newPois[i].geometry.coordinates[0].lat, newPois[i].geometry.coordinates[0].lon], { icon: L.divIcon({
                                html: $templateCache.get('clusterCircleOrange'),
                                iconAnchor: [11, 29],
                                className: 'cip-poi-circle-icon-cluster cip-poi-circle-icon-fade'
                            })}).on('mouseover', handleHoverOnPoi).on('mouseout', handleHoverOutPoi);
                            ;
                            marker.poi = newPois[i];
                            marker.group = 'filteredOutA';
                            marker.poi.properties.title = newPois[i].properties.name;
                            privates.__poiGroupAOut.addLayer(marker);
                        }
                    }

                    function drawSelectedBPoi(newPoi) {
                        closeSelectedPoiPopup();
                        closePoiPopup();
                        if (privates.__selectedGroupB) {
                            privates.__map.removeLayer(privates.__selectedGroupB);
                            privates.__selectedGroupB = null;
                        }
                        if (newPoi && (!scope.pois.choroplethMode || (scope.pois.choroplethMode && scope.pois.groupB.isGroupOnCharts))) {
                            scope.hideAddPoiTemplate = true;
                            var marker = L.marker([newPoi.geometry.coordinates[0].lat, newPoi.geometry.coordinates[0].lon], { icon: L.divIcon({
                                html: $templateCache.get('markerStarGreen'),
                                iconAnchor: [11, 29],
                                className: 'cip-poi-icon-hover _id' + newPoi.id
                            })}).on('click', handlePoiClick);
                            marker.poi = newPoi;
                            marker.addTo(privates.__map);
                            privates.__selectedGroupB = marker;
                            openSelectedPoiPopup(marker);
                        } else {
                            if (scope.poiPopup) {
                                scope.hideAddPoiTemplate = false;
                                closePoiPopup();
                            }
                        }
                    }

                    function drawFilteredOutB(newPois) {
                        privates.__poiGroupBOut.clearLayers();
                        if (!newPois || (scope.pois.choroplethMode && !scope.pois.groupB.isGroupOnCharts)) return;
                        for (var i = 0; i < newPois.length; i++) {
                            var marker = L.marker([newPois[i].geometry.coordinates[0].lat, newPois[i].geometry.coordinates[0].lon], { icon: L.divIcon({
                                html: $templateCache.get('clusterCircleGreen'),
                                iconAnchor: [11, 29],
                                className: 'cip-poi-circle-icon-cluster cip-poi-circle-icon-fade'
                            })}).on('mouseover', handleHoverOnPoi).on('mouseout', handleHoverOutPoi);
                            marker.poi = newPois[i];
                            marker.group = 'filteredOutB';
                            marker.poi.properties.title = newPois[i].properties.name;
                            privates.__poiGroupBOut.addLayer(marker);
                        }
                    }

                    function drawCurrentBPoi(newPois) {
                        privates.__poiGroupBCurrentPage.clearLayers();
                        if (!newPois || (scope.pois.choroplethMode && !scope.pois.groupB.isGroupOnCharts)) {
                            return;
                        }
                        for (var i = 0; i < newPois.length; i++) {
                            if (!scope.pois.groupB.selected || scope.pois.groupB.selected.id !== newPois[i].id) {
                                var marker = L.marker([newPois[i].geometry.coordinates[0].lat, newPois[i].geometry.coordinates[0].lon], {
                                    icon: L.divIcon({
                                        html: $templateCache.get('markerPinGreen'),
                                        iconAnchor: [11, 29],
                                        className: 'cip-poi-icon _id' + newPois[i].id
                                    })}).on('mouseover', handleHoverOnPoi).on('mouseout', handleHoverOutPoi);
                                marker.poi = newPois[i];
                                privates.__poiGroupBCurrentPage.addLayer(marker);
                            }
                        }
                        if (scope.pois.groupB.isGroupOnCharts) {
                            fitSearchBounds(scope.pois.groupB.currentPagePoi, scope.pois.groupB.remainPoi)
                        }
                    }

                    function drawRemainBPoi(newPois) {
                        privates.__poiGroupBRemain.clearLayers();
                        if (!newPois || newPois.length === 0 || (scope.pois.choroplethMode && !scope.pois.groupB.isGroupOnCharts)) {
                            return;
                        }
                        for (var i = 0; i < newPois.length; i++) {
                            var index = i + 11;
                            if (!scope.pois.groupB.selected || scope.pois.groupB.selected.id !== newPois[i].id) {
                                var marker = L.marker([newPois[i].geometry.coordinates[0].lat, newPois[i].geometry.coordinates[0].lon], { icon: L.divIcon({
                                    html: $templateCache.get('clusterCircleGreen'),
                                    iconAnchor: [11, 29],
                                    className: 'cip-poi-circle-icon-cluster'
                                })});
                                marker.poi = newPois[i];
                                marker.poi.properties.title = ' #' + index + '.' + newPois[i].properties.name;
                                privates.__poiGroupBRemain.addLayer(marker);
                            } else {
                                scope.pois.groupB.selected.index = index;
                            }

                        }
                        if (scope.pois.groupB.isGroupOnCharts) {
                            fitSearchBounds(scope.pois.groupB.currentPagePoi, scope.pois.groupB.remainPoi)
                        }

                    }

					function storeAllAPoi(newPois) {
						var markers =[];
                        if (!newPois || (scope.pois.choroplethMode && !scope.pois.groupA.isGroupOnCharts)) {
                            return;
                        }
                        for (var i = 0; i < newPois.length; i++) {
                            var marker = new L.marker([newPois[i].geometry.coordinates[0].lat, newPois[i].geometry.coordinates[0].lon]);
                            marker.poi = newPois[i];
                            markers.push(marker);
                        }
						privates.__poiGroupAAll = new L.featureGroup(markers);
					}

					function storeAllBPoi(newPois) {
						var markers = [];
                        if (!newPois || (scope.pois.choroplethMode && !scope.pois.groupA.isGroupOnCharts)) {
                            return;
                        }
                        for (var i = 0; i < newPois.length; i++) {
                            var marker = L.marker([newPois[i].geometry.coordinates[0].lat, newPois[i].geometry.coordinates[0].lon]);
                            marker.poi = newPois[i];
                            markers.push(marker);
                        }
                        privates.__poiGroupBAll = new L.featureGroup(markers);
					}

                    function fitSearchBounds(firstArr, secondArr) {
                        var bounds = [];
                        for (var i = 0; i < firstArr.length; i++) {
                            bounds.push([firstArr[i].geometry.coordinates[0].lat, firstArr[i].geometry.coordinates[0].lon]);
                        }
                        for (var i = 0; i < secondArr.length; i++) {
                            bounds.push([secondArr[i].geometry.coordinates[0].lat, secondArr[i].geometry.coordinates[0].lon]);
                        }
                        privates.__map.fitBounds(bounds);
                    }

                }

            };
        }]);
