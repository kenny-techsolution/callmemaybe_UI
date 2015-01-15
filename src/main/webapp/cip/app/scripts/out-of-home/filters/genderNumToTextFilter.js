angular.module('cip.outOfHome').filter('genderNumToTextFilter',function(){
	'use strict';
	return function (gender) {
		switch(gender) {
			case '1':
				return 'male';
			case '2':
				return 'female';
			default:
				return 'gender';
		}
	};
});