onMouseoverUnknown : function(chart) {
		var popup = $(".age-chart.chartContainer .unknown_popup");
		// stop existing fadeout animation
		clearTimeout(chart.fadeTimeout);
		popup.stop();

		popup.css("opacity", 1);
		popup.css("display", "inline-block");
},
fadeUnknownPopup : function(chart) {
		var popup = $(".age-chart.chartContainer .unknown_popup");
		this.onMouseoverUnknown(chart);

		chart.fadeTimeout = setTimeout(function() {
			popup.fadeOut(1000);
		}, 1000);
},
fadeInitialPopup : function(chart) {
		this.onMouseoverUnknown(chart);
		this.fadeUnknownPopup(chart);
},

getWarningColor : function(pct, isUnknownSelected) {
	// determine warning level based on percentage
	if (pct >= 50 && pct <= 75) {
		if (isUnknownSelected) {
			return "#FCB314";
		} else {
			return "#FEE1A1";
		}
	} else if (pct > 75) {
		if (isUnknownSelected) {
			return "#B30A3C";
		} else {
			return "#E19DB1";
		}
	}
	return "white";
},
dataMap : {
	0 : "18-23",
	1 : "24-29",
	2 : "30-39",
	3 : "40-49",
	4 : "50-59",
	5 : "60-69",
	6 : "70+",
	7 : "Unknown"
},
nonUnknownPct : 0,

beforeDrawAxis: function(axis, axisOptions, chart, axisIndex)
{
	var _this = this;
	var data = chart._chart.series[0].data;
	var dataSum = 0, dataMaxPct = 0;
	for (var i = 0; i < data.length; i ++) {
		var currentPct = data[i].percentage;
		dataSum += data[i].y;
		if (i !== data.length-1 && currentPct > dataMaxPct) {
			dataMaxPct = currentPct;
		}
	}

	if (!axis.categories) {
		var numLines = Math.round(dataMaxPct/5);
		var plotLines = [];
		var interval = 0.05 * dataSum;
		for (var i  = 0; i < numLines; i++) {
			plotLines[i] = {
				color: "rgba(255,255,255,0.5)",
				width: 1,
				value: interval * i,
				zIndex: 5
			};
		}
		axisOptions.plotLines = plotLines;
		return;
	}

	if (axisOptions.categories != null)
	{
		axisOptions.labels.formatter = function() {
			return "<div class='oval-background'>" + _this.dataMap[this.value] + "</div>";
		};

		axisOptions.labels.useHTML = true;
	}
	axisOptions.labels.y = 6.5;
},

beforeDrawSeries: function(series, seriesOptions, chart, seriesIndex)
{
	var _this = this;
	var dataSum = 0;
	for (var i = 0; i < seriesOptions.data.length; i ++) {
		dataSum += seriesOptions.data[i].y;
	}
	seriesOptions.dataLabels.y = 1;

	// take out the unknown data so that the bars aren't scaled with it included
	var unknownIndex = seriesOptions.data.length-1;
	seriesOptions.data[unknownIndex].y = 0;

	seriesOptions.dataLabels.formatter = function() {
		var pcnt = (this.y / dataSum) * 100;
		_this.nonUnknownPct += Number(pcnt.toFixed(0));
		return pcnt.toFixed(0) + "%";
	};

	//todo: find a way to fix the scaling so that the largest bar uses the width of the container.
},


beforeGeneration: function(options)
{
	options.title.x = 15;
},

beforeRendering: function(options, chart)
{
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

afterRendering: function(chart)
{
	var _this = this;
	var container = $(chart._chart.renderTo);

	// clear the mouseout function
	var seriesPoints = chart._chart.series[0].points;

	for (var i = 0; i < seriesPoints.length; i++){
		seriesPoints[i].onMouseOut = function(){};
	}

	var grey = "#CCC";
	chart.origColor = $(container).find(".highcharts-series rect").eq(0).attr("fill");
	var selection = [];
	var unknownPct = 100 - this.nonUnknownPct;

	$(container).find(".highcharts-series rect").each(function() {
		selection.push(true);
	});

	// add unknown popup and fade it out initially
	$(".age-chart.chartContainer").append("<div class='unknown_popup'><div class='unknown_label'>Unknown Age:</div>" +
		"<div class='unknown_status'>On</div><div class='divot'/></div></div>");
	_this.fadeUnknownPopup(container);

	// hide unknown row's label and bar and update the text
	$(container).find(".highcharts-series rect").eq(selection.length-1).css("display", "none");
	$(container).find(".highcharts-axis-labels .oval-background").eq(selection.length-1).css("display", "none");
	var $unknownText = $(container).find(".highcharts-data-labels g text").eq(selection.length-1);

	$(container).find(".highcharts-data-labels g").eq(selection.length-1).attr("transform", "");
	$unknownText.find("tspan").attr("x", 198);
	$unknownText.attr("y", 207);
	$unknownText.find("tspan").text("Unknown: " + unknownPct + "%");

	// add the data warning rectangle
	chart._chart.renderer
	.rect(318, 250, 24, 5, 0)
	.attr({
		class: 'unknown_warning',
		'fill': _this.getWarningColor(unknownPct, true),
		zIndex: 10
	})
	.add();

	// add the chart title
	chart._chart.renderer
	.text("AGE", 12, 25)
	.attr({
		class: 'title'
	})
	.add();

	var onClick = function(elements) {
		return function() {
			var index = $(elements).index($(this));
			var $currRect = $(container).find(".highcharts-series rect").eq(index);
			var $unknownStatus = $(".age-chart.chartContainer .unknown_status");
			var $unknownWarning = $(container).find(".unknown_warning");
			var oldUnknownStatus = $unknownStatus.text();

			var values = $(container).find(".highcharts-data-labels g text tspan");
			var labels = $(container).find(".highcharts-axis-labels .oval-background");

			if(!selection[index]){
				// update unknown status to on
				if (index === selection.length-1) {
					$unknownStatus.text("On");
					$unknownWarning.attr("fill", _this.getWarningColor(unknownPct, true));
				}
				selection[index] = true;
				$currRect.attr("fill", chart.origColor);
				values.eq(index).css({"color":"#666","fill":"#666"});
				$(container).find(".highcharts-axis-labels .oval-background").eq(index).css({"background-color":"#666"});
			}
			else{
				if(otherBarsActive(index) === true){ //all other bars active
					// update unknown status to off
					if (index !== selection.length-1) {
						$unknownStatus.text("Off");
						$unknownWarning.attr("fill", _this.getWarningColor(unknownPct, false));
					}
					$(elements).each(function(i) {selection[i] = false;});
					$(container).find(".highcharts-series rect").attr("fill", grey);
					$currRect.attr("fill", chart.origColor);
					selection[index] = true;
					values.not(values.eq(index)).css({"color":"#BBB","fill":"#BBB"});
					labels.not(labels.eq(index)).css({"background-color":"#BBB"});
				}
				else if(otherBarsInactive(index) === true){ //all other bars inactive
					// update unknown status to on
					$unknownStatus.text("On");
					$unknownWarning.attr("fill", _this.getWarningColor(unknownPct, true));

					$(elements).each(function(i) {selection[i] = true;});
					$(container).find(".highcharts-series rect").attr("fill", chart.origColor);
					values.not(values.eq(index)).css({"color":"#666","fill":"#666"});
					labels.not(labels.eq(index)).css({"background-color":"#666"});
				}
				else{ //at least one other active
					// update unknown status to off
					if (index === selection.length-1) {
						$unknownStatus.text("Off");
						$unknownWarning.attr("fill", _this.getWarningColor(unknownPct, false));
					}
					selection[index] = false;
					values.eq(index).css({"color":"#BBB","fill":"#BBB"});
					labels.eq(index).css({"background-color":"#BBB"});
				}
			}

			// show the unknown popup if clicking on another
			if ($unknownStatus.text() !== oldUnknownStatus) {
				_this.fadeUnknownPopup(container);
			}
		};
	};

	var onMouseover = function(elements) {
		return function() {
			var index = $(elements).index($(this));
			var currRect = $(container).find(".highcharts-series rect").eq(index);
			$(currRect).attr("fill-opacity",0.4);
			$(currRect).attr("fill", chart.origColor);
			if (index === selection.length-1) {
				_this.onMouseoverUnknown(container);
			}
		};
	};

	var onMouseout = function(elements) {
		return function() {
			var index = $(elements).index($(this));
			var currRect = $(container).find(".highcharts-series rect").eq(index);
			$(currRect).attr("fill-opacity",1.0);
			if (!selection[index]) {
				$(currRect).attr("fill", grey);
			}

			if (index === selection.length-1) {
				_this.fadeUnknownPopup(container);
			}
		};
	};

	function otherBarsActive(currBarIndex){
		var ret = true;
		$(container).find(".highcharts-series rect").each(function(i){
			if($(container).find(".highcharts-series rect").index($(this)) !== currBarIndex && !selection[i]){
				ret = false;
				return false;
			}
		});
		return ret;
	};

	function otherBarsInactive(currBarIndex){
		var ret = true;
		$(container).find(".highcharts-series rect").each(function(i){
			if($(container).find(".highcharts-series rect").index($(this)) !== currBarIndex && selection[i]){
				ret = false;
				return false;
			}
		});
		return ret;
	};

	var bindEvents = function() {
		var elements = [
			$(container).find(".highcharts-series rect"),
			$(container).find(".highcharts-data-labels g text"),
			$(container).find(".highcharts-axis-labels .oval-background")
		];
		for (var i = 0; i < elements.length; i ++) {
			$(elements[i])
			.click(onClick(elements[i]))
			.mouseover(onMouseover(elements[i]))
			.mouseout(onMouseout(elements[i]));
		}
	};

	bindEvents();

	return;
}