'use strict';

/**

@param {updates=} use this attribute to update the any of the breadcrumbs parameters to your liking

<breadcrumb updates="myUpdateFunction()"></breadcrumb>

This directives default is to use the $location.path() to create the breadcrumbs. If you need to update the
display name of one of the crumbs to something more user friendly or change the route you can use the update
attribute.

The keys of the update array are also based of the $location.path(). If you are using parameters inside your route it will
use the parameter name instead of its value that is returned from $location.path().

This example is based off of this route

/accounts/:accountId/users/:userId

breadcrumb parameters available to update are

{
	displayName : 'new name'
	route : '#/'
}

$scope.myUpdateFunction = function(){
	var updates = {};

	updates.accountId = {
		displayName : 'general motors'
	};
	updates.users = { 
		route : '#/newroute'
	};

	return updates;
}
*/



angular.module('ui.att.breadcrumb', [])

.controller('BreadCrumbController', ['$scope', '$route', '$location',
	function ($scope, $route, $location) {

	//using 2 path variables to have an un altered array path
	var locationPathArray = $location.path().split('/'),
		breadcrumbOrder = $location.path().split('/');

		//remove the first item in the array because it is a blank position
		locationPathArray.shift();
		breadcrumbOrder.shift();

	this.buildBreadcrumb = function(){
		var breadcrumbArray = {},
			pathParams = $route.current.pathParams;

		for(var i=0; i < breadcrumbOrder.length; i++){
			var crumbData = {
				displayName : breadcrumbOrder[i],
				route : buildRoute(i)
			};

			//naming the individual breadcrumb object based off the parameter name
			//because the parameter name is static but the parameter itself will change
			for(var param in pathParams){
				if(breadcrumbOrder[i] === pathParams[param]){
					breadcrumbOrder[i] = param;
				}
			}

			if($scope.updates !== undefined){
				for(var key in $scope.updates){
					if(key === $scope.updates[i]){
						for(var item in $scope.updates[key]){
							crumbData[item] = $scope.updates[key][item];
						}
					}
				}
			}

			breadcrumbArray[breadcrumbOrder[i]] = {
				'route': crumbData.route,
				'displayName': crumbData.displayName
			};
		}

		return breadcrumbArray;
	};

	this.getOrder = function(){
		return breadcrumbOrder;
	}

	function buildRoute(key){
		var crumbRoute = '#';

		for(var i=0; i < (key + 1); i++){
			crumbRoute += '/' + locationPathArray[i];
		}

		return crumbRoute;
	}

	return this;

}])


.directive('breadcrumb', function () {
	return {
		scope: {
			updates: '=?'
		},
		restrict:'EA',
		controller:'BreadCrumbController',
		replace: false,
		templateUrl: 'modules/templates/breadcrumb/breadcrumb.html',
		link: function(scope, element, attrs, breadCrumbController) {

			scope.$watch('updates', function(){
				for(var key in scope.updates){
					scope.breadcrumb[key].displayName = scope.updates[key].displayName;
				}
			}, true);

			scope.breadcrumb = breadCrumbController.buildBreadcrumb();
			scope.order = breadCrumbController.getOrder();
		}
	};
});