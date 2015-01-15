'use strict';

var app = angular.module('cip', ['config', 'strip', 'cip-map','cip.outOfHome','cip.authentication','cip.account','cip.pages','ui.att.datePickerMod']);

app.run(['$rootScope', '$location', '$route', 'AuthenticateUserService', '$filter', 'ENV', '$q', 'UserTimeout', '$modal', 'SessionService',
  function ($rootScope, $location, $route, AuthenticateUserService, $filter, ENV, $q, UserTimeout, $modal, SessionService) {

	var publicRoutes = [
		'/login',
		'/password/reset',
		'/password/create',
		'/sign-up'
	],
	warningModal = false,
	UserTimeoutSettings = {
		showWarning : true
	},
	isPublicRoute = function(route){
		return publicRoutes.indexOf(route) === -1 ? false : true;
	},
	redirectUsers = function(){
		AuthenticateUserService.isCSPLoggedIn().then(function (success){
			$route.reload();
		}, function(failed){
			$location.path('/login');
		});
	};

	$rootScope.globalStatus = {
		jsapiLoaded : false,
		campaignCreated : false,
		context : ''
	};

	$rootScope.cancelTimeout = function(){
		if(!SessionService.isInternal() && UserTimeout.started() && AuthenticateUserService.isAuthenticated()){

			if(warningModal){
				warningModal.close();
			}
			UserTimeout.restart(UserTimeoutSettings);
		}
	};

	$rootScope.$on('userInactive', function (event){
		warningModal.close();
		AuthenticateUserService.logout();
	});

	$rootScope.$on('userInactiveWarning', function (event){
		warningModal = $modal.open({
			templateUrl: 'views/partials/user-activity-warning.html',
			size: 'sm'
		});

		//NEEDED for angular bootstrap $modal bug in v0.10.0
		//should be fixed in the next version
		warningModal.result.then(function() {
			//success
		}, function() {
			//cancelled
		})['finally'](function(){
			// unset modalInstance to prevent double close of modal when $routeChangeStart
			warningModal = false;
		});
	});

	$rootScope.$on('$locationChangeStart', function (event, next, current){
		var hashIndex = next.indexOf('#');

		next = next.substr(hashIndex + 1);

		// if route requires auth and user is not logged in
		// need to check both next and current paths separatly because urls can get updated by the user or through the application
		// resulting in inconsistent "next / current" url
		if (!isPublicRoute($location.path()) || !isPublicRoute(next)) {
			if (!AuthenticateUserService.isAuthenticated()) {
				event.preventDefault();
				redirectUsers();
			} else {
				//Init session timeout for external users only
				if(!SessionService.isInternal() && !UserTimeout.started()){
					UserTimeout.init(UserTimeoutSettings);
				}
			}
		}

	});

	$rootScope.$on('$routeChangeStart', function (event, next, current, rejection) {

		$rootScope.pageId = null;

	});

	$rootScope.$on('$routeChangeError', function (event, next, current, rejection) {

		if(rejection === 'logged in'){
			$location.path('/');
		} else if(rejection === 'user denied'){
			//TODO: remove alert and add redirect / modal alert feature to let the user know they cannot access current url
			alert('you are not allowed in there, please step back.');
			$location.path('/');
		}
	});

}]).config(['$routeProvider', '$httpProvider', 'USER_ROLES',
	function ($routeProvider, $httpProvider, USER_ROLES) {

	$httpProvider.interceptors.push('httpInterceptor');

	$routeProvider
		.when('/', {
			templateUrl: 'views/pages/landing.html',
			controller: 'LandingCtrl'
		})
		.when('/dashboard/:product', {
			templateUrl: function(routeParams){
				var folderNameArray = routeParams.product.split('-'),
					folderName = folderNameArray[0];

				for(var i = 0; folderNameArray.length > i; i++){
					if(i !== 0){
						folderName += folderNameArray[i].charAt(0).toUpperCase() + folderNameArray[i].toLowerCase().slice(1);
					}
				}

				return 'views/' + folderName + '/dashboard.html';
			},
			controller: 'DashboardCtrl',
			resolve: {
				licensed: ['ProductLicensedService', '$route',
					function(ProductLicensedService, $route){
						return ProductLicensedService.isLicensed($route.current.params.product);
					}
				]
			}
		})
		.when('/login', {
			templateUrl: 'views/authentication/login.html',
			controller: 'LoginCtrl',
			resolve: {
				permitted: ['AuthenticateUserService', '$q',
					function(AuthenticateUserService, $q){
						var defer = $q.defer();

						AuthenticateUserService.isAuthenticated() ? defer.reject('logged in') : defer.resolve('logged out');

						return defer.promise;
					}
				]
			}
		})
		.when('/logout', {
			template: ' ',
			controller: 'LogoutCtrl'
		})
		//TODO: Create sign up page
		.when('/sign-up', {
			template: '<h1>this is the sign up page</h1>',
			resolve: {
				permitted: ['AuthenticateUserService', '$q',
					function(AuthenticateUserService, $q){
						var defer = $q.defer();

						AuthenticateUserService.isAuthenticated() ? defer.reject('logged in') : defer.resolve('logged out');

						return defer.promise;
					}
				]
			}
		})
		//TODO: I can probably combine accounts html and controllers
		.when('/accounts', {
			templateUrl: 'views/account/accounts.html',
			controller: 'AccountsCtrl',
			resolve: {
				permitted: ['UserPermissionsService',
					function(UserPermissionsService){
						return UserPermissionsService.isPermitted([USER_ROLES.admin, USER_ROLES.super]);
					}
				]
			}
		})
		.when('/accounts/:accountId', {
			templateUrl: 'views/account/account.html',
			controller: 'AccountCtrl',
			resolve: {
				permitted: ['UserPermissionsService',
					function(UserPermissionsService){
						return UserPermissionsService.isPermitted([USER_ROLES.admin, USER_ROLES.super]);
					}
				]
			}
		})
		.when('/accounts/:accountId/users', {
			templateUrl: 'views/account/users.html',
			controller: 'UsersCtrl'
		})
		.when('/accounts/:accountId/users/:userId', {
			templateUrl: 'views/account/user.html',
			controller: 'UserCtrl'
		})
		// :status = reset || create
		.when('/password/:status', {
			templateUrl: 'views/authentication/password.html',
			controller: 'PasswordCtrl',
			resolve: {
				permitted: ['AuthenticateUserService', '$q',
					function(AuthenticateUserService, $q){
						var defer = $q.defer();

						AuthenticateUserService.isAuthenticated() ? defer.reject('logged in') : defer.resolve('logged out');

						return defer.promise;
					}
				]
			}
		})
		.otherwise({
			//TODO: probably want to create a 404 page
			redirectTo: '/login'
		}
	);

	//THIS IS ONLY FOR DEV ENVIRONMENT.  NEED TO REMOVE ONCE WE FIGURE OUT WERE SERVICES RESIDE.
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];

}]);
