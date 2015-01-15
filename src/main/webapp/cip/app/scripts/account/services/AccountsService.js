'use strict';

angular.module('cip.account')
.factory('AccountsService', ['$cookieStore', 'ENV', '$http', '$q', 'envDomainHandler',
	function($cookieStore, ENV, $http, $q, envDomainHandler) {

		var accountsService = envDomainHandler.getServiceDomain() + ENV.authenticateAPI.endpoints.accounts,
			account = null;

		return {
			getAccountName: function(accountId){
				var defer = $q.defer();

				if(account){
					defer.resolve(account.name);
				} else {
					this.getAccount(accountId).then(function(data){
						defer.resolve(account.name);
					}, function(failed){
						defer.reject(failed);
					});
				}

				return defer.promise;
			},
			getAccountUsers: function(accountId){
				var defer = $q.defer();

				if(account){
					defer.resolve(account.users);
				} else {
					this.getAccount(accountId).then(function(data){
						defer.resolve(account.users);
					}, function(failed){
						defer.reject(failed);
					});
				}

				return defer.promise;
			},
			getAccount: function(accountId){
				var defer = $q.defer(),
					isMatch = false;

				$http({
					method: 'GET',
					url: accountsService,
					cache: true,
					params: {
						id: accountId
					}
				}).then(function(data){
					//TODO: shouldn't need the id matching statement once I can get a single account
					for(var i=0; i < data.data.length; i++){
						if(data.data[i].id === accountId){
							isMatch = true;
							account = data.data[i];
							defer.resolve(data.data[i]);
						}
					}

					defer.reject('matched failed');
				}, function(failedReason){
					defer.reject(failedReason);
				});

				return defer.promise;
			},

			getAllAccounts: function(){
				var defer = $q.defer();

				$http({
					method: 'GET',
					url: accountsService
				}).then(function(data){
					defer.resolve(data.data);
				}, function(failedReason){
					defer.reject(failedReason);
				});

				return defer.promise;
			}
		};

	}
]);