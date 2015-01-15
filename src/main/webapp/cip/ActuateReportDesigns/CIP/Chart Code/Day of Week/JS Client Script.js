/**
 * Called before axis instance is rendered.
 *
 * @param axis
 *            axis instance
 * @param  axisOptions
 *             axis options
 * @param  chart
 *             chart instance
 * @param  axisIndex
 *             axis index
 */
beforeDrawAxis: function(axis, axisOptions, chart, axisIndex)
{  
	if (!axis.categories) {
		var numLines = Math.round(axis.max/5);		
		var plotLines = [];
		for (var i  = 0; i < numLines; i++) {
			plotLines[i] = {
				color: "rgba(255,255,255,0.75)",
				width: 1,
				value: 5 * i,
				zIndex: 5
			};
		}
		axisOptions.plotLines = plotLines;
		return;
	}

	if (axisOptions.categories != null)
	{
		axisOptions.labels.formatter = function() {
			var ind = $.inArray(this.value, this.axis.categories);
			var val = this.axis.series[0].yData[ind];
			var bgColor = "#666";
			if (val > 500000)
				bgColor = "#666";
						return "<div class='oval-background' style='background-clip: padding-box; width: 40px; padding:5px; color:#FFFFFF; text-align: center; position: relative; top: -15px; left: 14px; background-color: " + bgColor + "; border-radius: 12px; border:1px " + "#ffffff" + "  solid; border-style:solid; border-right-width:3px; border-right-color:#ffffff'><span style='position:relative;top:2px;'>" + this.value + "</span></div>";
					};
				
		axisOptions.labels.useHTML = true;
	}
	axisOptions.labels.y = 6.2;
},
/**
 * Called before series instance is rendered.
 *
 * @param series
 *            series instance
 * @param  seriesOptions
 *             series options
 * @param  chart
 *             chart instance
 * @param  seriesIndex
 *             series index
 */
beforeDrawSeries: function(series, seriesOptions, chart, seriesIndex)
{
	seriesOptions.pointRange = 0.6;
	seriesOptions.dataLabels.y = 0;
},

/**
 * Called before chart instance is initially created.
 *
 * @param options
 *            chart options
 */
beforeGeneration: function(options)
{
	//You can change options here.
	options.chart.spacingLeft = -2;
	options.title.x = 11;
	options.title.y = 9;
	options.chart.spacingRight = -15;
},

beforeRendering: function(options, chart)
{
	//You can change options here.
	options.plotOptions = {
		series : {
			allowPointSelect: false,
			states: {
				hover: {
					enabled: false
				}						
			},
		}
	};
},

/**
 * Called after chart instance is rendered.
 *
 * @param chart
 *            chart instance
 */
afterRendering: function(chart) 
{ 
	//$("#dayOfWeek .highcharts-series rect").off();
	
	chart.origColors = []; 
	$(".dayOfWeek .highcharts-series rect").each(function(){ 
		chart.origColors[$(".dayOfWeek .highcharts-series rect").index($(this))] = $(this).attr("fill"); 
	}); 
 
	var grey = "#CCC"; 
	$(".dayOfWeek .highcharts-series rect").click(function(){
		var index = $(".dayOfWeek .highcharts-series rect").index($(this)); 
		//console.log("bar active: "+$(this).attr("active")); 
		if($(this).attr("active") == "false"){ 
			//console.log("active false"); 
			$(this).attr("fill", chart.origColors[index]).attr("active","true"); 
			$(".dayOfWeek .highcharts-data-labels g text").eq(index).css({"color":"#666","fill":"#666"}); 
			$(".dayOfWeek .highcharts-axis-labels text").eq(index).css({"color":"#666","fill":"#666"});
			$(".oval-background ").eq(index).css({"background-color":"#666"}); 
		} 
		else{ 
			if(otherBarsActive(index) === true){//all active 
				//console.log("all active"); 
				$(".dayOfWeek .highcharts-series rect").not($(this)).attr("fill", grey).attr("active","false"); 
				$(".dayOfWeek .highcharts-data-labels g text").not($(".dayOfWeek .highcharts-data-labels g text").eq(index)).css({"color":"#BBB","fill":"#BBB"}); 
				$(".dayOfWeek .highcharts-axis-labels text").not($(".dayOfWeek .highcharts-axis-labels text").eq(index)).css({"color":"#BBB","fill":"#BBB"}); 
				$(".oval-background").not($(".oval-background").eq(index)).css({"background-color":"#BBB"});
			} 
			else if(otherBarsInactive(index) === true){//all inactive 
				//console.log("all inactive"); 
				$(".dayOfWeek .highcharts-series rect").not($(this)).each(function(){ 
					$(this).attr("fill", chart.origColors[$(".dayOfWeek .highcharts-series rect").index($(this))]).attr("active","true"); 
				}); 
				$(".dayOfWeek .highcharts-data-labels g text").not($(".dayOfWeek .highcharts-data-labels g text").eq(index)).css({"color":"#666","fill":"#666"}); 
				$(".dayOfWeek .highcharts-axis-labels text").not($(".dayOfWeek .highcharts-axis-labels text").eq(index)).css({"color":"#666","fill":"#666"}); 
				$(".oval-background").not($(".oval-background").eq(index)).css({"background-color":"#666"});
			} 
			else{//at least one other active 
				//console.log("at least one active"); 
				$(".dayOfWeek .highcharts-series rect").eq(index).attr("fill", grey).attr("active",false).mouseover(); 
				$(".dayOfWeek .highcharts-data-labels g text").eq(index).css({"color":"#BBB","fill":"#BBB"}); 
				$(".dayOfWeek .highcharts-axis-labels text").eq(index).css({"color":"#BBB","fill":"#BBB"}); 
				$(".oval-background").eq(index).css({"background-color":"#BBB"});
			} 
		} 
	})	 
	.mouseover(function(){ 
		var index = $(".dayOfWeek .highcharts-series rect").index($(this)); 
		$(this).attr("fill-opacity",0.4); 
		$(this).attr("fill", chart.origColors[$(".dayOfWeek .highcharts-series rect").index($(this))]);			
		//$("#dayOfWeek .highcharts-data-labels g text").eq(index).css({"opacity":0.4}); 
		//$("#dayOfWeek .highcharts-axis-labels text").eq(index).css({"opacity":0.4}); 
	}) 
	.mouseout(function(){ 
		var index = $(".dayOfWeek .highcharts-series rect").index($(this));  
		if($(this).attr("active") == "false"){
			$(this).attr("fill-opacity",1.0);
			$(this).attr("fill", grey);
		}
		else {
			$(this).attr("fill-opacity",1.0);
			$(this).attr("fill", chart.origColors[$(".dayOfWeek .highcharts-series rect").index($(this))]);
		}
		//$("#dayOfWeek .highcharts-data-labels g text").eq(index).css({"opacity":1.0}); 
		//$("#dayOfWeek .highcharts-axis-labels text").eq(index).css({"opacity":1.0}); 
	}); 
	
	function otherBarsActive(currBarIndex){ 
		var ret = true; 
		$(".dayOfWeek .highcharts-series rect").each(function(){ 
			if($(".dayOfWeek .highcharts-series rect").index($(this)) !== currBarIndex && $(this).attr("active") == "false"){ 
				console.log("hit"); 
				ret = false; 
				return false; 
			} 
		}); 
		//console.log("active: "+ret); 
		return ret; 
	} 
 
	function otherBarsInactive(currBarIndex){ 
		var ret = true; 
		$(".dayOfWeek .highcharts-series rect").each(function(){ 
			if($(".dayOfWeek .highcharts-series rect").index($(this)) !== currBarIndex && $(this).attr("active") == "true"){ 
				ret = false; 
				return false; 
			} 
		}); 
		//console.log("inactive: "+ret); 
		return ret; 
	}
},