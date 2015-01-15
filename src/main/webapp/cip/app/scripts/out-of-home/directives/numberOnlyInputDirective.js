angular.module('cip.outOfHome').directive('numberOnlyInput', function() {
	'use strict';
	return {
		restrict : 'A',
		scope : {
			classes : '=',
			ngModel : '=',
			onChange : '&'
		},
		link : function(scope, element, attrs) {
			var countDecimals = function(nString) {
				if (nString === null) {
					return 0;
				}
				var nValue = Number(nString);
				var splitArray = nString.split('.');
				if (splitArray[1]) {
					return splitArray[1].length || 0;
				} else {
					return 0;
				}
			};
			scope.lessthan = Number(attrs.inputLessthan || 1000000000);
			scope.decimals = Number(attrs.inputDecimals || 2);
			scope.$watch('ngModel', function(newValue, oldValue) {
				// Ignore initial setup and restrict the values to be of type 'string'
				if (newValue === oldValue || typeof newValue !== 'string') {
					return;
				}

				if (isNaN(newValue)) {
					scope.ngModel = oldValue;
				}

				if (Number(newValue) >= scope.lessthan) {
					scope.ngModel = oldValue;
				}

				if (countDecimals(newValue) > scope.decimals) {
					scope.ngModel = oldValue;
				}

				if (scope.decimals === 0 && newValue.indexOf('.') > -1) {
					scope.ngModel = oldValue;
				}

				if (scope.onChange) {
					scope.onChange(scope.ngModel);
				}
			});
		}
	};
});