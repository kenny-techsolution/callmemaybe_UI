/*
describe('get ares service', function () {

    // load the controller's module
    beforeEach(module('strip'));
    beforeEach(module('config'));
    beforeEach(module('ngMockE2E'));
    var service;
    var rootScope;
    var httpBackend;

    var mockBoundingRequestObject = {
        getNorthEast: function () {
            return {};
        },
        getSouthWest: function () {
            return {};
        }
    };

    beforeEach(inject(function ($rootScope, getAreasService, $httpBackend) {
        service = getAreasService;
        rootScope = $rootScope;
        httpBackend = $httpBackend;

        httpBackend.expectGET('http://192.117.156.46:8080/geo-service/layers/bounding?layer=some&neLat=undefined&neLng=undefined&swLat=undefined&swLng=undefined&limit=0').respond(200, [
            {'geometry': {'coordinates': [
                {'lat': 36.999129, 'lon': -96.925294},
                {'lat': 36.999029, 'lon': -97.146175},
                {'lat': 37.473164, 'lon': -97.153166},
                {'lat': 37.476372, 'lon': -96.531725},
                {'lat': 37.001514, 'lon': -96.525502},
                {'lat': 36.999129, 'lon': -96.925294}
            ], 'type': 'Polygon'}, 'properties': {'pop': 11932, 'areaType': 'M2', 'layerType': 'CBSA', 'layerCode': '49060', 'layerCenter': {'lat': 37.2345068, 'lon': -96.8372468}, 'areaTypeName': 'Micro Area', 'fullName': null, 'name': 'Winfield, KS', 'key': '68bdd5f0-e4b2-11e3-87d6-8f439670fd07', 'state': 'KS'}, 'id': '68bdd5f0-e4b2-11e3-87d6-8f439670fd07'}
        ]);

    }));

    it('should get polygons and build objects successfully', function () {
        var result;
        service.getLayersByBounds('some', null, mockBoundingRequestObject).then(function (data) {
            result = data;
        }, function (err) {
            result = err;
        });

        rootScope.$apply();
        httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].options).toBeDefined();
    });
});
 */
