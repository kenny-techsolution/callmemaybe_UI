app.service('poiService',['$http','$q', 'ENV', 'envDomainHandler',function($http,$q, ENV, envDomainHandler){
    'use strict';
    var poisCanceler;
    var baseUrl = envDomainHandler.getServiceDomain();
    return{
        getPoisByBounds: function (bounds, callback) {
            if (poisCanceler) {
                poisCanceler.resolve();
            }

            poisCanceler = $q.defer();
            $http.get(baseUrl + ENV.poiAPI.endpoints.getPoisByBBox + bounds._northEast.lat +
                '&neLng=' + bounds._northEast.lng +
                '&swLat=' + bounds._southWest.lat +
                '&swLng=' + bounds._southWest.lng, {timeout: poisCanceler.promise}).then(function (result) {

                callback(null, result.data);
            }, function (err) {
                callback(err);
            });
        }
    };
}]);