app.factory('filterHandler',[function(){
	'use strict';
	function ChartTemplate(){
		this.id= '';
		this.filterFunction = undefined;
	}
	var handler = {
		subCharts:[],
		update: function(filters){
			function checkFilter(filter){
				if(typeof filter.values[0] === 'object'){
					for(var i in filter.values){
						if(filter.values[i].enabled === true){
							return true;
						}
					}
					return false;
				}
				else{
					return undefined;
				}
			}
			for(var filter in filters){
				var currFilter = filters[filter];
				for(var i in handler.subCharts){
					var curr = handler.subCharts[i];
					if(curr.id === filter){
						if(currFilter.values.length === 0 ){
							curr.filterFunction(false);
						}
						else{
							var check = checkFilter(currFilter);
							if(check === true){
								curr.filterFunction(true);
							}
							else if(check === false){
								curr.filterFunction(false);
							}
							else{
								curr.filterFunction(true);
							}
						}
						break;
					}
				}
			}
		},
		subscribe:function(chartid, filterFunction){
			var temp = new ChartTemplate();
			temp.id = chartid;
			temp.filterFunction = filterFunction;
			handler.subCharts.push(temp);
		},
		unsubscribe:function(chartid){
			for(var i in handler.subCharts){
				var curr = handler.subCharts[i];
				if(curr.id === chartid){
					handler.subCharts.splice(i,1);
					return true;
				}
			}
			return false;
		}
	};

	return handler;
}]);