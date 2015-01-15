angular.module('strip').service('getAreasService', ['$http', '$q', 'ENV', 'envDomainHandler', function ($http, $q, ENV, envDomainHandler) {
    "use strict";
    var boundingBoxCanceler;
    var baseUrl = envDomainHandler.getServiceDomain();
    return {
        getLayerNames: function (type, subTypes) {
            var deffered = $q.defer();
            $http.get(baseUrl +  ENV.cipMapAPI.endpoints.getLayerNames + type + extractSelectedSubType(subTypes))
                .success(function (res) {
                    deffered.resolve(res);
                })
                .error(function (err) {
                    //TODO: handle error
                });
            return deffered.promise;

        },


        getLayerById: function (layerId) {
            var deffered = $q.defer();
            $http.get(baseUrl +  ENV.cipMapAPI.endpoints.getLayerById + layerId)
                .success(function (res) {
                	if(res === '404 Not Found'){
                		deffered.reject(layerId);
                	} else {
                        deffered.resolve(res);
                	}
                })
                .error(function (err) {
                    deffered.reject(layerId);
                });

            return deffered.promise;
        },

        getLayersByBounds: function (type, subTypes, bounds,aboard) {
            if (boundingBoxCanceler) {
                boundingBoxCanceler.resolve();
            }
            if (aboard) return;
            boundingBoxCanceler = $q.defer();
            var deferred = $q.defer();

            $http.get(baseUrl +  ENV.cipMapAPI.endpoints.getLayersByBounds + type + extractSelectedSubType(subTypes) +
                    '&neLat=' + bounds.getNorthEast().lat +
                    '&neLng=' + bounds.getNorthEast().lng +
                    '&swLat=' + bounds.getSouthWest().lat +
                    '&swLng=' + bounds.getSouthWest().lng + '&limit=0',
                {timeout: boundingBoxCanceler.promise})
                .success(function (res) {
                    for (var i = 0; i < res.length; i++) {
                        res[i] = this.buildLayerObject(res[i].properties.layerType.toLowerCase(), res[i]);
                    }
                    deferred.resolve(res);
                }.bind(this))
                .error(function (err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        buildLayerObject: function (type, obj) {

            obj.options = {
                colors: {
                    hovered: {
                        opacity: 0.2
                    },
                    selected: {
                        opacity: 0.4
                    },
                    selectedHovered: {
                        opacity: 0.6
                    }
                },
                creation: {
                    opacityRange: [0.8, 0.4],
                    animationDuration: 5
                }
            };
            switch (type) {
                case 'cbsa':

                    obj.options.colors.hovered.color = '#EF6F00';
                    obj.options.colors.selected.color = '#EF6F00';
                    obj.options.colors.selectedHovered.color = '#EF6F00';
                    break;

                case 'dma':
                    obj.options.colors.hovered.color = '#B30A3C';
                    obj.options.colors.selected.color = '#B30A3C';
                    obj.options.colors.selectedHovered.color = '#B30A3C';
                    break;
                case 'zip':
                    obj.options.colors.hovered.color = '#0C2577';
                    obj.options.colors.selected.color = '#0C2577';
                    obj.options.colors.selectedHovered.color = '#0C2577';
                    break;
                case 'county':
                    obj.options.colors.hovered.color = '#4CA90C';
                    obj.options.colors.selected.color = '#4CA90C';
                    obj.options.colors.selectedHovered.color = '#4CA90C';
                    break;
                default:
                    break;
            }


            return obj;
        }
    };

    /************************************************** PRIVATE SERVICE FUNCTIONS ****************************************/

    function extractSelectedSubType(subTypes) {
        if (!subTypes) return "";
        return subTypes.metro && subTypes.micro ? "" : (subTypes.metro ? "_metro" : "_micro");
    }
}]);
