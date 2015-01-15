app.directive('placeholder', [function () {
	'use strict';
	return {
		restrict: 'A',
		link: function (scope, el) {

			var $html = $('html');
			if (! $html.hasClass('ie9'))
			{
				return ;
			}

			var placeholderContent;
			var element = $(el);

			if ($html.hasClass('ie9')) {
				element.focus(function () {
					if (element.val() === placeholderContent) {
						element.val('');
					}
				});
				element.blur(function () {
					if (element.val() === '') {
						element.val(placeholderContent);
					}
				});
			}

			scope.$watch(function () {
				return el.attr('placeholder');
			}, function (newValue, oldValue) {
				placeholderContent = newValue;
				if (element.val() === '' || element.val() === oldValue) {
					element.val(placeholderContent);
				}
			});
		}
	};
}]);