app.directive('passwordMatch', [ function () {
	'use strict';

	function link(scope, element, attrs, control) {
		var isMatch = function () {
			var rePassword = scope.$eval(attrs.ngModel),
				password = scope.$eval(attrs.passwordMatch);

			return rePassword === password;
		};

		scope.$watch(isMatch, function (matchBoolean) {
			control.$setValidity('match', matchBoolean);
		});
	}

	return {
		restrict: 'A',
		require: 'ngModel',
		link: link
	};
}]);