beforeGeneration: function(options)
{
	var _this = this;
	options.plotOptions= {
		pie: {
			size: 130,
			cursor: 'pointer'
		}
	}

	options.crossbirtfilter.callbacks.pointClick = function(point) {
		_this.toggleTextStatus(point.series.data);
	};
	
	options.crossbirtfilter.categories = ['Married', 'Single', 'Unknown'];
	
	options.crossbirtfilter.unknown = {patternId: 'ms'};
	options.crossbirtfilter.colors = ['#44C8F5', '#FCB314', 'url(#ms_stripes__100__)'];

	options.crossbirtfilter.adjustModel(options);
	
	return true;
},

chartAttr: {
	colors: { 
		Married: '#44C8F5', 
		Single: '#FCB314', 
		Unknown: 'url(#ms_stripes__100__)',
	},
	labels: {
		0: {
			name: 'Married',
			text: {
				position: {
					x: 58,
					y: 136
				}
				
			},
			pctPosition: {
				x: 60,
				y: 116
			}
		},
		1: {
			name: 'Single',
			text: {
				position: {
					x: 290,
					y: 136
				}
			},
			pctPosition: {
				x: 290,
				y: 116
			}
		}
	}
},
toggleTextStatus : function(points) {
	for(var i = 0; i < points.length; i ++) {
		var point = points[i];
		if (point.name != 'Unknown') {
			var chartContainer = point.series.chart.renderTo;
			if (point.active !== undefined && !point.active) {
				$(chartContainer).find('.label.' + point.name + ' tspan').css('fill', '#CCCCCC');
			} else {
				$(chartContainer).find('.label.' + point.name + ' tspan').css('fill', '#666666');
			}
		}
	}
},
afterRendering: function(chart)
{
	var _this = this;
	var _chart = chart._chart;
	var container = $(_chart.renderTo);
	var seriesPoints = _chart.series[0].points;
	
	$(container).find('svg').attr('class', 'ms_container');

	// mouse over event
	var doMouseOver = function(point, chart) {
		return function () {
			chart.options.crossbirtfilter.pointHighlight(point.name, chart); 
		};
	}

	// mouse out event
	var doMouseOut = function(point, chart) {
		return function () {
			chart.options.crossbirtfilter.pointUnhighlight(point.name, chart); 
		};
	};
	
	// click event
	var doClick = function(point, chart) {
		return function() {
			chart.options.crossbirtfilter.pointClick(point.name, chart);
			_this.toggleTextStatus(chart.series[0].data);
		};
	};
	
	for (var i = 0; i < 3; i ++) {
	
		var pct = [
			100 - Math.round(seriesPoints[1].percentage) - Math.round(seriesPoints[2].percentage),
			Math.round(seriesPoints[1].percentage),
			Math.round(seriesPoints[2].percentage)
		];

		if (seriesPoints[i].name !== 'Unknown') {
			var slice = _this.chartAttr.labels[i];

			if (slice.text) {
				_chart.renderer
				.text(slice.name, slice.text.position.x, slice.text.position.y)
				.attr({
					class: 'label ' + slice.name,
					'text-anchor': 'middle'
				})
				.on('mouseover', doMouseOver(seriesPoints[i], chart.getCore()))
				.on('mouseout', doMouseOut(seriesPoints[i], chart.getCore()))
				.on('click', doClick(seriesPoints[i], chart.getCore()))
				.add();
			} 

			_chart.renderer.text(pct[i] + '%', slice.pctPosition.x, slice.pctPosition.y)
			.attr({
				class: 'label ' + slice.name,
				'text-anchor': 'middle'
			})
			.on('mouseover', doMouseOver(seriesPoints[i], chart.getCore()))
			.on('mouseout', doMouseOut(seriesPoints[i], chart.getCore()))
			.on('click', doClick(seriesPoints[i], chart.getCore()))
			.add();
		} else {
			$('.ms_container .highcharts-unknown-label').on('mouseover', doMouseOver(seriesPoints[i], chart.getCore()));
			$('.ms_container .highcharts-unknown-label').on('mouseout', doMouseOut(seriesPoints[i], chart.getCore()));
			$('.ms_container .highcharts-unknown-label').on('click', function(point) { 
				return function() {
					_this.toggleTextStatus(point.series.data);
				};
			}(seriesPoints[i]));
		}
	}
},