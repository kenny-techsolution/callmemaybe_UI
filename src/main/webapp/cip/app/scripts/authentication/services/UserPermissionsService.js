'use strict';

angular.module('cip.authentication')
.service('UserPermissionsService', ['AuthenticateUserService', 'SessionService', '$location', '$q', 'USER_ROLES',
	function(AuthenticateUserService, SessionService, $location, $q, USER_ROLES) {

		function doesUserHaveRole(permittedRole){
			var hasRole = false,
				userRoles = SessionService.getUserRole();

			if (!angular.isArray(permittedRole)) {
				permittedRole = [permittedRole];
			}

			angular.forEach(userRoles, function(role, key){
				if(permittedRole.indexOf(role) !== -1){
					hasRole = true;
				}
			});

			return hasRole;
		}

		this.isPermitted = function(permittedRole){
			var permitted = false,
				defer = $q.defer();

			if(AuthenticateUserService.isAuthenticated()){
				permitted = doesUserHaveRole(permittedRole);
			} else {
				//TODO: use $boardcast for login
				defer.reject('logged out');
				$location.path('/');
			}

			permitted ? defer.resolve('user permitted') : defer.reject('user denied');

			return defer.promise;
		};

		this.isAdmin = function(){
			return doesUserHaveRole(USER_ROLES.admin);
		};

		this.isSuperAdmin = function(){
			return doesUserHaveRole(USER_ROLES.super);
		};
	}
]);
