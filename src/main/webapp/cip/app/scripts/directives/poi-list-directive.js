app.directive('poiList', function () {
    'use strict';
    return {
        templateUrl: 'views/partials/poi-list-template.html',
        restrict: 'EA',
        scope: {
            poisModel: '=',
            color: '=',
            groupName: '='
        },


        controller: function ($scope, filterFilter, indexFilter) {
            var currentToggleInitiated = false;
            $scope.$watch('searchFilter', function (newVal, oldVal) {
                if (newVal && $scope.poisModel.selected){
                    return;
                }
                $scope.currentPage = 0;
                $scope.searchCiteria = newVal;
                $scope.setPoiArrays();
            });
            $scope.$watch('poisModel.hovered', function (newValue, oldValue) {

                $.each($($scope.el).find('.list-container .place-container'),function(index ,item){
                        $(item).removeClass('hovered');

                    }
                );
                var filteredArray =  filterFilter($scope.poisModel.allPoi, $scope.searchCiteria );
                var index = indexFilter($scope.poisModel.hovered ,filteredArray) ;
                if (index > -1){
                    $(($scope.el).find('.list-container .place-container')[index]).addClass('hovered');

                }
	        });
            $scope.$watch('poisModel.selected', function (newValue, oldValue) {
                if (!newValue){
                    return;
                }
                var filteredArray =  filterFilter($scope.poisModel.allPoi, $scope.searchCiteria );
                var index = indexFilter($scope.poisModel.selected ,filteredArray) ;
                if (index === -1){

                    $scope.searchFilter = '';

                }
                $scope.poisModel.isGroupOnCharts = true;
            });
            $scope.$watch('poisModel.selected', function (newValue, oldValue) {
                if (!newValue)
                {
                    return;
                }
                var filteredArray =  filterFilter($scope.poisModel.allPoi, $scope.searchCiteria );
                var index = indexFilter($scope.poisModel.selected ,filteredArray) ;
                if (index === -1){
                    $scope.searchFilter = '';

                }

            });
            $scope.$watch('isGroupToggled', function (isToggled) {
                        if (isToggled) {
                            currentToggleInitiated = true;
                            $scope.$emit('cip:poiListToggled', null);
                        }

                    }
            );


            $scope.$watch('poisModel.isGroupOnCharts', function (newValue, oldValue) {
                if (newValue && oldValue === false){ // even if isGroupOnCharts = true on initial state it should be closed
                    $scope.isGroupToggled = true;

                }
            });

            $scope.$watch('color', function (newValue, oldValue) {
                if (! newValue)
                {
                    return ;
                }
                $scope.setPoiArrays();
            });
            $scope.$on('cip:poiListToggledBroadcast', function () {
                if (currentToggleInitiated) {
                    currentToggleInitiated = false;
                    return;
                }

                $scope.isGroupToggled = false;
            });

            $scope.$on('cip:openPoiListBroadcast', function (event,groupName) {
                if ($scope.groupName === groupName) {
                    $scope.isGroupToggled = true;
                }


            });
            $scope.numberOfPages = function () {
                if (!$scope.poisModel.allPoi) {
                    return 0;
                }

                return Math.ceil(filterFilter($scope.poisModel.allPoi, $scope.searchCiteria).length / $scope.pageSize);
            };

            $scope.start = function () {
                if ($scope.currentPage > 0) {
                    $scope.currentPage = 0;
                    $scope.setPoiArrays();
                }


            };
            $scope.prev = function () {
                if ($scope.currentPage > 0) {
                    $scope.currentPage--;
                    $scope.setPoiArrays();
                }
            };
            $scope.next = function () {
                if ($scope.currentPage < $scope.numberOfPages() - 1) {
                    $scope.currentPage++;
                    $scope.setPoiArrays();
                }

            };
            $scope.end = function () {
                if ($scope.currentPage < $scope.numberOfPages() - 1) {
                    $scope.currentPage = $scope.numberOfPages() - 1;
                    $scope.setPoiArrays();
                }

            };

            $scope.selectPrev = function () {
                var filteredArray = filterFilter($scope.poisModel.allPoi, $scope.searchCiteria);
                var index = indexFilter($scope.poisModel.selected, filteredArray);
                if (index > 0) {
                    index--;
                } else if (index === 0) {
                    index = filteredArray.length - 1;
                } else {
                    index = 0;
                }
                $scope.poisModel.selected = filteredArray[index];
            };

            $scope.selectNext = function () {
                var filteredArray = filterFilter($scope.poisModel.allPoi, $scope.searchCiteria);
                var index = indexFilter($scope.poisModel.selected, filteredArray);
                if (index < filteredArray.length - 1) {
                    index++;
                } else {
                    index = 0;
                }
                $scope.poisModel.selected = filteredArray[index];

            };

            $scope.setPoiArrays = function () {

                    $scope.poisModel.remainPoi = filterFilter($scope.poisModel.allPoi, $scope.searchCiteria).slice(0);
                    $scope.poisModel.filteredOut = _.difference($scope.poisModel.allPoi, $scope.poisModel.remainPoi);
                    $scope.poisModel.currentPagePoi = $scope.poisModel.remainPoi.splice($scope.currentPage * $scope.pageSize, $scope.pageSize);

                };

            $scope.newSearch = function (evt) {
                $scope.searchCiteria = $scope.searchFilter;
                var filteredArray = filterFilter($scope.poisModel.allPoi, $scope.searchCiteria);
                var index = indexFilter($scope.poisModel.selected, filteredArray);
                if(index === -1){
                    $scope.poisModel.selected = null;
                }

                $scope.setPoiArrays();


            };
        },
        link: function (scope,el) {
            scope.currentPage = 0;
            scope.pageSize = 10;
            scope.choroplethMode = false;
            scope.Math = window.Math;
            scope.active = true;
            scope.searchCiteria = '';
            scope.el = el;
        }
    };

});

app.filter('startFrom', function () {
    'use strict';
    return function (input, start) {
        if (!input || input.length === 0) {
            return;
        }

        start = +start; //parse to int
        return input.slice(start);
    };
});

app.filter('poiFilter', function (filterFilter) {
    'use strict';
    return function (arr, exp, selected) {
        if (selected) {
            return arr;
        } else {

            return  filterFilter(arr, exp);
        }
    };
});

app.filter('withCommas', function () {
    'use strict';
    return function (number) {
        if (number)
        {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    };
});

app.filter('index', function () {
    'use strict';
    return function (item, array) {
        if (!item || array.length === 0){
            return -1;
        }
        for (var i = 0; i < array.length; i++) {
            var poi = array[i];
            if (poi.id === item.id) {
                return i;
            }
        }
        return -1;
    };
});

app.directive('ngEnter', function () {
    'use strict';
    return function (scope, element, attrs) {
        element.bind('keydown keypress', function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});


//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter

