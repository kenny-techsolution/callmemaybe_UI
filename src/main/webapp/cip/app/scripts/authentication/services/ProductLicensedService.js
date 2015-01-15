'use strict';

angular.module('cip.authentication')
.service('ProductLicensedService', ['$q', 'SessionService',
	function($q, SessionService) {

		this.isLicensed = function(product){
			var licensed = false,
				licensedProducts = SessionService.getUserProducts(),
				defer = $q.defer();

			product = product.replace(/-/g, ' ');

			for(var i = 0; licensedProducts.length > i; i++){
				if(product === licensedProducts[i].name && licensedProducts[i].active){
					licensed = true;
				}
			}

			licensed ? defer.resolve(true) : defer.reject(false);

			return defer.promise;
		};
	}
]);
