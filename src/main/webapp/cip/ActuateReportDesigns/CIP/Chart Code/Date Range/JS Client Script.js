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
	seriesOptions.pointRange = 1.4;
},

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
	if (axis.categories) {
		var numBars = chart.getCore().series[0].data.length;
		
		if (numBars === 25) {
			axisOptions.tickInterval = 4;
		}
		if (numBars >= 28) {
			axisOptions.tickInterval = 7;
		}
	}
	
	if (!axis.categories) {
	
		axisOptions.max = chart.getYAxisMax();
	
		if (axisOptions.max <= 500) {
			axisOptions.max = Math.ceil(((chart.getYAxisMax())+1)/10)*10;
		}
	
		else if (axisOptions.max > 500 && axisOptions.max <= 10000) {
			axisOptions.max = Math.ceil(((chart.getYAxisMax())+1)/100)*100;
		}
		
		else if (axisOptions.max > 10000 && axisOptions.max <= 100000) {
			axisOptions.max = Math.ceil(((chart.getYAxisMax())+1)/1000)*1000;
		}
		
		axisOptions.tickInterval = axisOptions.max/4;
		axisOptions.endOnTick = false;
	
		var numLines = 9;		
		var plotLines = [];
		for (var i  = 0; i < numLines; i++) {
			plotLines[i] = {
				color: "rgba(255,255,255,0.75)",
				width: 1,
				value: axisOptions.max * (.125 * i),
				zIndex: 5
			};
		}
		axisOptions.plotLines = plotLines;
		
		return;
	}
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
	options.title.x = 0;
	options.title.y = 5;
	options.chart.spacingTop = 20;
},