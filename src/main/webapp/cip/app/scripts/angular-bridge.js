'use strict';
var angularBridge = {
    zipUpdate: function(zipData){
        if(!zipData || zipData.length < 0){
            return;
        }

        var min = _.min(zipData, function(d){ return d.value;}).value;
        var max = _.max(zipData, function(d){ return d.value;}).value;

        var step  = (max - min) / 5;

        for(var i = 0; i < zipData.length; i++){
            var ratio = Math.round((zipData[i].value - min) / step);
            zipData[i].stepRatio = ratio;
        }

        var injector = angular.element('body').injector();
        injector.invoke(function(angularBridgeService){
            angularBridgeService.choropleth.zipData = zipData;
            angular.element('body').scope().$apply();
        });
    }
};