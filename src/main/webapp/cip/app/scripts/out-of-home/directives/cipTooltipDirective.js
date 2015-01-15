//Angular Bootstrap tooltip is hard to tweak and has some functional constraints.
//This directive makes a simple tooltip that matches our AC UI design.
//TODO: make this tooltip more reusable by adding position configuration.
//right now, positioning is determined by external css.
angular.module('cip.outOfHome').directive('cipTooltip', ['$document',
function($document) {
	'use strict';
	return {
		restrict : 'A',
		scope : {
			show : '=',
			classes : '='
		},
		replace : true,
		transclude : true,
		template : '<div class="cip-tooltip {{classes}}" ng-show="show"><div class="divot"></div><div class="content" ng-transclude></div></div>',
		link : function(scope, element, attrs) {
			if (attrs.hideOnOutsideClick === 'true') {
				$document.bind('click', function(e) {
					if (!element.is(e.target) && element.has(e.target).length === 0) {
						if (scope.show === true) {
							scope.show = false;
						}
					}
				});
			}
		}
	};
}]);