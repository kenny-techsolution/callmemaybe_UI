'use strict';
app.directive('progressOverlay', ['overLay','$rootScope', 'ENV', function(overLay, $rootScope, ENV){
	return {
		restrict: 'EA',
		template:'<div id="progress-overlay" ng-show="overlay.show"><div class="message-body"><div class="spinner"/><div class="loading-text">Loading...</div></div>',
		scope: {},
		controller: function($scope) {
			$scope.overlay = overLay;
			overLay.scope = $scope;
			overLay.rootScope = $rootScope;

			CrossBIRTFilter.exposeAngularElements(overLay, ENV);
		}
	};
}])
.value('overLay',
	{
		show : false,
		scope: {},
		jsapiLoaded : false,
		dataFileLoaded : false,
		setShow: function(value, sectionFinished){
			if(sectionFinished === 'jsapi'){
				this.jsapiLoaded = true;
			}
			else if(sectionFinished === 'data'){
				this.dataFileLoaded = true;
			}
			if(value === false && !(this.dataFileLoaded === true && this.jsapiLoaded === true)){
				//both pieces not loaded. do not hide loader
				return;
			}
			
			if(this.show !== value){

				this.show = value;
				if (this.scope.$$phase === null && this.rootScope.$$phase === null) {
                    this.scope.$apply();
				}
			}
		}
	}
);