'use strict';

var app = angular.module('cip', ['config','chart.js','timer']);

app.run(['$rootScope', '$location', '$route', '$filter', 'ENV', '$q', 'UserTimeout', '$modal',
  function ($rootScope, $location, $route, $filter, ENV, $q, UserTimeout, $modal) {

}]).config(['$routeProvider', '$httpProvider', 'USER_ROLES',
	function ($routeProvider, $httpProvider, USER_ROLES) {

	$httpProvider.interceptors.push('httpInterceptor');

	$routeProvider
		.when('/', {
			templateUrl: 'views/landing.html',
			controller: 'landingCtrl'
		})
		.when('/admin', {
			templateUrl: 'views/admin.html',
			controller: 'adminCtrl'
		})
		.when('/rep', {
			templateUrl: 'views/rep.html',
			controller: 'repCtrl'
		})
		.otherwise({
			//TODO: probably want to create a 404 page
			redirectTo: '/'
		}
	);

	//THIS IS ONLY FOR DEV ENVIRONMENT.  NEED TO REMOVE ONCE WE FIGURE OUT WERE SERVICES RESIDE.
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];

}]);
