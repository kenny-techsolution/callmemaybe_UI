//to initialize jsapi & CrossBIRTFilter
app.factory('jsapiHandler', ['SessionService', 'envDomainHandler', 'ENV', '$http', 'filterHandler' ,'$rootScope', function(SessionService, envDomainHandler, ENV, $http, filterHandler, $rootScope){
	'use strict';
	var baseUrl = envDomainHandler.getServiceDomain();
	var controller = {
		apiLoaded: false,
		controllerCallback:undefined,
		initAPI: function(callback, callbackOnLoaded){
			controller.controllerCallback = callback;
			function loadJsapi (iportalUrl) {
				$.getScript(iportalUrl + '/jsapi', function (data, textStatus, jqxhr) {
					var opts = new actuate.RequestOptions();
					var user = (ENV.iportalConfig.username!=="") ? ENV.iportalConfig.username : null;
					var pass = (ENV.iportalConfig.password!=="") ? ENV.iportalConfig.password : null;
					opts.setCustomParameters({__masterpage: 'false'});
					opts.dataServiceURL =  baseUrl + '/cip-actuate-services/GenerateData';
					CrossBIRTFilter.initialize(iportalUrl, opts, user, pass, $rootScope.globalStatus.context, controller.successCallback, controller.errorCallback, filterHandler.update);
					controller.apiLoaded = true;
					$rootScope.globalStatus.jsapiLoaded = true;
				});
			};
			if(!controller.apiLoaded){
				if(ENV.name === 'localhost') {
						loadJsapi(ENV.iportalConfig.baseUrl+'/iportal');
				} else {
					$http.get(baseUrl +'/cip-auth/getIportalSession').success(function() {
						loadJsapi(baseUrl+'/iportal');
					}).error(function(){
						console.log('iportal Session couldn\'t get established.');
					});
				}
			} else if(callbackOnLoaded){
				callback();
			}
		},
		successCallback:function(){
			if(controller.controllerCallback !== undefined){
				controller.controllerCallback();
				controller.controllerCallback = undefined;
			}
		},
		errorCallback:function(error){
			if (error.getErrorMessage) {
				console.log(error.getErrorMessage());
			}
		}
	};
	return controller;
}]);