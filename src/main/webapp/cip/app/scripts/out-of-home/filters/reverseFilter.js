angular.module('cip.outOfHome').filter('reverse', function(){
	'use strict';
	return function(items){
		return items.slice().reverse();
	};
});