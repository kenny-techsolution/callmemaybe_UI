'use strict';

angular.module('cip.authentication')
.factory('AuthenticateUserService', ['$rootScope', '$cookieStore', '$location', '$http', 'SessionService', 'ENV', '$q', '$window', 'envDomainHandler',
	function($rootScope, $cookieStore, $location, $http, SessionService, ENV, $q, $window, envDomainHandler) {

		//TODO: can be removed once CSP and TGuard is in place
		var demoUser = {
			id: '1',
			accountId: 'account|736471ad-431f-4671-ac06-4c5907007978',
			firstname: 'VA',
			lastname: 'Demo',
			email: 'demo@att.com',
			status: 'active',
			roles: ['ACCOUNT_SUPER_USER'],
			username: 'demo@att.com',
			internal: 'false',
			geofences: null,
			geofenceGroups: null,
			products: [{
				name: 'visitor analysis',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
				active: true,
				default: true
			},
			{
				name: 'out of home',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
				active: true,
				default: false
			},
			{
				name: '360 view',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
				active: false,
				default: false
			},
			{
				name: 'real estate',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
				active: false,
				default: false
			},
			{
				name: 'venue analysis',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
				active: false,
				default: false
			},
			{
				name: 'placeholder name',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
				active: false,
				default: false
			}]
		};

		//TODO: can be removed once CSP and TGuard is in place
		var oohUser = {
			id: '1',
			accountId: 'account|736471ad-431f-4671-ac06-4c5907007978',
			firstname: 'OOH',
			lastname: 'Demo',
			email: 'oohdemo@att.com',
			status: 'active',
			roles: ['ACCOUNT_ADMIN'],
			username: 'oohdemo@att.com',
			internal: 'true',
			geofences: null,
			geofenceGroups: null,
			products: [{
				name: 'visitor analysis',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
				active: true,
				default: false
			},
			{
				name: 'out of home',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
				active: true,
				default: true
			},
			{
				name: '360 view',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
				active: false,
				default: false
			},
			{
				name: 'real estate',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
				active: false,
				default: false
			},
			{
				name: 'venue analysis',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
				active: false,
				default: false
			},
			{
				name: 'placeholder name',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
				active: false,
				default: false
			}]
		};

		return {
			//TODO : remove after auth service is working
			products : function(){
				return demoUser.products;
			},

			//TEST login code
			//TODO: can be removed once CSP and TGuard is in place
			login : function(credentials){
				var fakePassword = 'password',
					status = false;

				if(credentials.password === fakePassword){
					if(credentials.username === demoUser.username){
						status = true;
						SessionService.create(demoUser);
					} else if(credentials.username === oohUser.username){
						status = true;
						SessionService.create(oohUser);
					}
				}

				return status;
			},

			logout : function(){
				SessionService.destroy();

				//Only external users can logout
				//Redirect to the TGuard logout page after clearing CIP login cookie
				$window.location.href = $window.location.protocol + '//' + $window.location.host + '/pkmslogout';
			},

			isAuthenticated : function(){
				return !!SessionService.getUser();
			},

			//TODO updated function name to be more generic for CSP and TGuard
			isCSPLoggedIn : function(location){
				var loginService = envDomainHandler.getServiceDomain() + ENV.authenticateAPI.endpoints.login,
					loginDefer = $q.defer();

				$http({
					method: 'GET',
					url: loginService
				}).then(function(data){
					//TODO: The service should be returning a success boolean, but it doesn't
					if(data.data.id){
						SessionService.create(data.data);
						loginDefer.resolve('logged in');
					} else {
						//HACK: To reload the page so that CSP login page will show up instead of running CIP code
						// hopefully this can get removed / updated in the future
						$window.location.reload();
						loginDefer.reject('login failed');
					}
				}, function(failedReason){
					loginDefer.reject('login failed');
				});

				return loginDefer.promise;
			}
		};
	}
]);
