'use strict';

angular.module('cip.account')
.service('UsersService', ['$cookieStore', 'ENV', '$http', '$q', 'envDomainHandler',
	function($cookieStore, ENV, $http, $q, envDomainHandler) {

		var usersService = envDomainHandler.getServiceDomain() + ENV.authenticateAPI.endpoints.users;

		this.getUser = function(userId){
			var defer = $q.defer();

			$http({
				method: 'GET',
				cache: true,
				url: usersService,
				params: {
					email: userId
				}
			}).then(function(data){
				defer.resolve(data.data);
			}, function(failedReason){
				defer.reject(failedReason);
			});

			return defer.promise;
		};

		this.getAllUsers = function(){
			var defer = $q.defer();

			$http({
				method: 'GET',
				cache: true,
				url: usersService
			}).then(function(data){
				defer.resolve(data.data);
			}, function(failedReason){
				defer.reject(failedReason);
			});

			return defer.promise;
		};

	}
]);