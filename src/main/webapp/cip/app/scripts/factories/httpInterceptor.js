'use strict';

app.factory('httpInterceptor', ['$q', '$window', '$location', '$log', 'ENV',
	function($q, $window, $location, $log, ENV) {

	/**
		Ajax requests should go thru the cip-auth proxy for security.
		The querystring for the GET calls need to be encoded. An geo-service GET request:
			/geo-service/layers/bounding?layer=dma&neLat=34.542762387234845&neLng=-78.1512451171875&swLat=33.09154154865519&swLng=-90.4119873046875&limit=0
		becomes:
			/cip-auth/proxy?target=/geo-service/layers/bounding?layer%3Ddma%26neLat%3D34.542762387234845%26neLng%3D-78.1512451171875%26swLat%3D33.09154154865519%26swLng%3D-90.4119873046875%26limit%3D0
	*/
	function useProxy (config) {
		var newUrl = "";
		var servicesRegex = /(\/cip-services|\/geo-service)/;
		var proxyAdded = "/cip-auth/proxy?target=$1";
		var oldUrl = config.url;
		var get = oldUrl.split("?");

		if (get.length  > 1 && get[0].search(servicesRegex) > -1) {
			newUrl = get[0] + "?" + encodeURIComponent(get[1]);
		}
		else {
			newUrl = oldUrl;
		}

		config.url = newUrl.replace(servicesRegex, proxyAdded);
		return config;
	}

	return {
		'request': function(config) {
			return useProxy(config);
		},

		'requestError': function(rejection) {
			// do something on error
			return $q.reject(rejection);
		},

		'response': function(response) {
			// do something on success
			return response;
		},

		'responseError': function(rejection) {
			//TODO: create real error messages
			var status = rejection.status;

			if(status === 401){
				//TODO: create sign up page
				$location.path('/sign-up');
			} else if(status === 404){
				//TODO: create a 404 page
				$log.error('Unable to find ' + rejection.config.url + ' on server. Status = ' + status);
			} else if(status === 500){
				$log.error('An error occurred ' + rejection.config.url + ' server. Status = ' + status);
			} else if(status === 0){
				$log.error('An error occurred ' + rejection.config.url + ' server. Status = ' + status);
			}

			return $q.reject(rejection);
		}
	};
}]);
