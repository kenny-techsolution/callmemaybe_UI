'use strict';

app.directive('header', ['SessionService', 'UserPermissionsService',
function(SessionService, UserPermissionsService){
	return {
		restrict:'A',
		scope:{
			isFilterBarVisible: '=showFilterbar',
			bootstrapContainer: '=?'
		},
		templateUrl:'views/partials/header.html',
		link: function(scope, element, attrs){
			var firstName = SessionService.getFirstname(),
				userName = null;

			if(firstName){
				userName = firstName.charAt(0).toUpperCase() + firstName.toLowerCase().slice(1) + ' ' + SessionService.getLastname().substring(0,1);
			}

			scope.user = userName;
			scope.bootstrapContainer = scope.bootstrapContainer || 'container-fluid';
			scope.isInternal = SessionService.isInternal();
			scope.isAdmin = UserPermissionsService.isAdmin();
			scope.isSuperAdmin = UserPermissionsService.isSuperAdmin();
		}
	};
}]);
