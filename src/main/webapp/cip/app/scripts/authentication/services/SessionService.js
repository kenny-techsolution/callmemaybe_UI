'use strict';

angular.module('cip.authentication')
.factory('SessionService', ['$cookieStore', 'ENV', '$http', '$q',
	function($cookieStore, ENV, $http, $q) {

		function getCookie(value){

			var cipUserData = $cookieStore.get('cip-user') || undefined;

			if(value && cipUserData){
				cipUserData = cipUserData[value];
			}

			return cipUserData || false;
		}

		return {
			getUser: function(){
				return getCookie();
			},

			//TODO: remove default accound ID once we get data in couchbase
			//TODO: User data doesn't include account id, we might need it
			getAccountId: function(){
				return getCookie('accountId') || 'account|736471ad-431f-4671-ac06-4c5907007978';
			},

			getUserId: function(){
				return getCookie('id');
			},

			getUsername: function(){
				return getCookie('firstname') + ' ' + getCookie('lastname');
			},

			getFirstname: function(){
				return getCookie('firstname');
			},

			getLastname: function(){
				return getCookie('lastname');
			},

			getUserRole: function(){
				return getCookie('roles');
			},

			getUserProducts: function(){
				return getCookie('products');
			},

			getEmail: function(){
				return getCookie('email');
			},

			getStatus: function(){
				return getCookie('status');
			},

			//TODO: Might want to format date before returning
			getCreatedDate: function(){
				return getCookie('createData');
			},

			getGeoFences: function(){
				return getCookie('geofences');
			},

			getGeoFenceGroups: function(){
				return getCookie('geofenceGroups');
			},

			isPasswordReset: function(){
				//converting string "false" || "true" into a boolean value
				return typeof getCookie('resetPassword') === 'string' ? JSON.parse(getCookie('resetPassword').toLowerCase()) : getCookie('resetPassword');
			},

			isInternal: function(){
				//converting string "false" || "true" into a boolean value
				return typeof getCookie('internal') === 'string' ? JSON.parse(getCookie('internal').toLowerCase()) : getCookie('internal');
			},

			create: function (userData) {
				$cookieStore.put('cip-user', userData);
			},

			destroy: function () {
				$cookieStore.remove('cip-user');
			}
		};
	}
]);