// Tguard https://webtest.tguard.att.com and the CSP dev environments https://webtest.csp.att.com both
// use the code on demolake 10.0.14.103/cip/. So when it comes to putting service domains in a config file
// and building for that environment it doesn't work because they all point to demolake.
// This factory creates the correct domain for each enviroment based on the current url.
'use strict';
app.factory('envDomainHandler', ['$location', '$http', '$window', 'envDomainHandlerConfig', 'ENV',
	function($location, $http, $window, envDomainHandlerConfig, ENV) {
		var origin = $window.location.origin,
			pathname = $window.location.pathname,
			serviceDomain = '';

		return {
			isTarget : function(){
				return origin === envDomainHandlerConfig.tguard;
			},
			isCSPDev : function(){
				return origin === envDomainHandlerConfig.cspDev;
			},
			isCSP : function(){
				return origin === envDomainHandlerConfig.cspLive;
			},
			setServiceDomain : function(url){
				serviceDomain = url;
			},
			getServiceDomain : function(){
				var serviceAddress = origin;

				if(this.isTarget() || this.isCSPDev()){
					serviceAddress = origin + pathname.replace('cip/', '');
				} else if(this.isCSP()){
					serviceAddress = origin + pathname;
				}

				if(ENV.name === "localhost") {
					serviceDomain = ENV.envDomainUrl;
				} else {
					serviceDomain = serviceAddress.slice(-1) === '/' ? serviceAddress.slice(0, - 1) : serviceAddress;
				}
				return serviceDomain;
			}
		};
	}
])

.factory('envDomainHandlerConfig', ['ENV',
	function(ENV){
		return {
			tguard: ENV['envDomain.tguard'],
			cspDev: ENV['envDomain.cspDev']
		};
	}
]);
