'use strict';

/**

@properties
{
  timeoutDuration: 1000 * 60 * 60, //60 minutes
  warningDuration: 1000 * 60 * 45, //45 minutes
  showWarning: false, // serves as a warning to let users know they are running out of time. 
  broadcastName: 'userInactive' // name of broadcasted event to bind to. $rootScope.$on
}


UserTimeout.started();

	Returns a boolean value and tells you whether or not timeout has started.

UserTimeout.init({
  timeoutDuration: 1000 * 60 * 45, //45 minutes
  warningDuration: 1000 * 60 * 15, //15 minutes
  showWarning: false,
  broadcastName: 'userInactive'
});

	Initializes timeout, you have to option to pass settings.

UserTimeout.restart({});

	Restarts timeout, you need to repass your current setting if you sent any in the .init() call

UserTimeout.stop();

	Stops all timeouts

$rootScope.$on('userInactive', function (event){
	
});

	This is broadcasted when the 'timeoutDuration' has past and used the 'broadcastName'

$rootScope.$on('userInactiveWarning', function (event){

});

	This is broadcasted when the 'warningDuration' has past and used the 'broadcastName' + Warning

*/



angular.module('ui.att.userTimeout', [])

.service('UserTimeout', ['$rootScope', '$timeout', 'userTimeoutConfig',
	function($rootScope, $timeout, userTimeoutConfig) {
	

	var UserTimeout = {},
		activeTimeout = null,
		activeTimeoutWarning;

	UserTimeout.started = function(){
		return activeTimeout || false;
	};

	UserTimeout.init = function (settings) {
		var settings = angular.extend(userTimeoutConfig, settings);

		activeTimeout = $timeout(function(){
			$rootScope.$broadcast(settings.broadcastName);
			this.stop();
		}, settings.timeoutDuration);

		if(settings.showWarning){
			activeTimeoutWarning = $timeout(function(){
				$rootScope.$broadcast(settings.broadcastName + 'Warning');
			}, settings.warningDuration);
		}
	};

	//TODO: fix to not need to pass settings
	UserTimeout.restart = function (settings) {
		if(this.started()){
			this.stop();

			this.init(settings);
		}
	};

	UserTimeout.stop = function () {
		$timeout.cancel(activeTimeout);
		$timeout.cancel(activeTimeoutWarning);
	};

	return UserTimeout;

}])

.constant('userTimeoutConfig', {
  timeoutDuration: 1000 * 60 * 60, //60 minutes
  warningDuration: 1000 * 60 * 45, //45 minutes
  showWarning: false,
  broadcastName: 'userInactive'
});