beforeGeneration: function(options)
{
	var _this = this;
	options.plotOptions= {
		pie: {
			size: 130,
			cursor: 'pointer'
		}
	};

	options.crossbirtfilter.callbacks.pointClick = function(point) {
		_this.toggleImageStatus(point.series.data);
		_this.toggleTextStatus(point.series.data);
	};
	
	options.crossbirtfilter.categories = ['Female', 'Male', 'Unknown'];
	
	options.crossbirtfilter.unknown = {patternId: 'gender'};
	options.crossbirtfilter.colors = ['#DC0081', '#0079B6', 'url(#gender_stripes__100__)'];

	options.crossbirtfilter.adjustModel(options);
	
	return true;
},

makeSVG : function(tag, attrs) {
			var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
			for (var k in attrs)
				el.setAttribute(k, attrs[k]);
			return el;
},
addFemaleAndMaleIcons : function() {
	var female = this.makeSVG('path', {'class': 'image image_female', d: 'M22,16.3c4.5,0,8.1-3.6,8.1-8.1C30.2,3.6,26.5,0,22,0c-4.5,0-8.1,3.6-8.1,8.1C13.9,12.6,17.5,16.3,22,16.3' +
		'M35.6,25.5c-1.3-4-3-6.7-6.7-6.7H15.1c-3.7,0-5.7,2.8-6.7,6.7L0.2,49.2c-0.5,1.5,0.3,3.1,1.8,3.6l0.2,0.1' +
	'c1.5,0.5,3.1-0.3,3.6-1.8l6.7-19.3c0.2,0,1,0,2.2,0L3.8,63.5h8.4v31.1c0,2.1,1.7,3.9,3.9,3.9c2.1,0,3.9-1.7,3.9-3.9V63.5H22h1.9' +
	'v31.1c0,2.1,1.7,3.9,3.9,3.9c2.1,0,3.9-1.7,3.9-3.9V63.5h7.8L29.2,31.8c1.5,0,2.1,0,2.3,0l6.7,19.3c0.5,1.5,2.1,2.3,3.6,1.8l0.2-0.1' +
	'c1.5-0.5,2.3-2.1,1.8-3.6L35.6,25.5z', 'transform': 'translate(52,80)', 'fill': '#DC0081'});

	document.getElementsByClassName('gender_container')[0].appendChild(female);
	
	var male = this.makeSVG('path', {'class': 'image image_male', d: 'M17.6,16.3c4.5,0,8.1-3.6,8.1-8.1c0-4.5-3.6-8.1-8.1-8.1c-4.5,0-8.1,3.6-8.1,8.1' +
		'C9.4,12.6,13.1,16.3,17.6,16.3 M25.3,18.8H9.7c-5.4,0-9.7,4.4-9.7,9.7v1v2.9v20.4c0,1.6,1.3,2.9,2.9,2.9c1.6,0,2.9-1.3,2.9-2.9V32.4h1.9' +
		'v21.4v3.9v36.9c0,2.1,1.7,3.9,3.9,3.9c2.1,0,3.9-1.7,3.9-3.9V57.7h3.9v36.9c0,2.1,1.7,3.9,3.9,3.9c2.1,0,3.9-1.7,3.9-3.9V57.7v-3.9' +
		'V32.4h1.9v20.4c0,1.6,1.3,2.9,2.9,2.9c1.6,0,2.9-1.3,2.9-2.9V32.4v-2.9v-1C35,23.1,30.6,18.8,25.3,18.8',
		'transform': 'translate(254,80)', 'fill': '#0079B6'});
		document.getElementsByClassName('gender_container')[0].appendChild(male);
},
updateImage : function(gender, attr, val) {
	if (gender === 'Female') {
		$('.gender_container .image_female').attr(attr, val);
	} else if (gender === 'Male') {
		$('.gender_container .image_male').attr(attr, val);
	}
}, 
toggleImageStatus : function(points) {
	for(var i = 0; i < points.length; i ++) {
		var point = points[i];
		if (point.name != 'Unknown') {
			if (point.active !== undefined && !point.active) {
				this.updateImage(point.name, 'fill', '#CCCCCC');
			} else {
				this.updateImage(point.name, 'fill', this.chartAttr.colors[point.name]);
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
chartAttr: {
	colors: { 
		Female: '#DC0081', 
		Male: '#0079B6', 
		Unknown: 'url(#gender_stripes__100__)',
	},
	labels: {
		0: {
			name: 'Female',
			image: {
				width: 50,
				height: 100,
				position: {
					x: 42,
					y: 80
				}
			},
			pctPosition: {
				x: 74,
				y: 70
			}
		},
		1: {
			name: 'Male',
			image: {
				width: 50,
				height: 100,
				position: {
					x: 242,
					y: 80
				}
			},
			pctPosition: {
				x: 272,
				y: 70
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
	
	$(container).find('svg').attr('class', 'gender_container');
	
	// add gender icons
	this.addFemaleAndMaleIcons();

	// mouse over event
	var doMouseOver = function(point, chart) {
		return function () {
			if (point.active !== undefined && !point.active) {
				_this.updateImage(point.name, 'fill', _this.chartAttr.colors[point.name]);
				_this.updateImage(point.name, 'fill-opacity', 0.4);
			}
			chart.options.crossbirtfilter.pointHighlight(point.name, chart); 
		};
	}

	// mouse out event
	var doMouseOut = function(point, chart) {
		return function () {
			if (point.active !== undefined && !point.active) {
				_this.updateImage(point.name, 'fill', '#CCCCCC');
			} else {
				_this.updateImage(point.name, 'fill', _this.chartAttr.colors[point.name]);
			}

			_this.updateImage(point.name, 'fill-opacity', 1);
		
			chart.options.crossbirtfilter.pointUnhighlight(point.name, chart); 
		};
	};
	
	// click event
	var doClick = function(point, chart) {
		return function() {
			chart.options.crossbirtfilter.pointClick(point.name, chart);
			_this.toggleImageStatus(chart.series[0].data);
			_this.toggleTextStatus(chart.series[0].data);
		};
	};
	
	var imageClassMap = ['image_female', 'image_male'];
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
				.text(slice.text.value, slice.text.position.x, slice.text.position.y)
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

			var imageSvg = $('.gender_container .' + imageClassMap[i]);
			imageSvg.on('mouseover', doMouseOver(seriesPoints[i], chart.getCore()));
			imageSvg.on('mouseout', doMouseOut(seriesPoints[i], chart.getCore()));
			imageSvg.on('click', doClick(seriesPoints[i], chart.getCore())); 
		} else {
			$('.gender_container .highcharts-unknown-label').on('mouseover', doMouseOver(seriesPoints[i], chart.getCore()));
			$('.gender_container .highcharts-unknown-label').on('mouseout', doMouseOut(seriesPoints[i], chart.getCore()));
			$('.gender_container .highcharts-unknown-label').on('click', function(point) { 
				return function() {
					_this.toggleImageStatus(point.series.data);
					_this.toggleTextStatus(point.series.data);
				};
			}(seriesPoints[i]));
		}
	}
},