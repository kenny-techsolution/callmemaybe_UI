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
				color: 'rgba(255,255,255,0.75)',
				width: 1,
				value: 5 * i,
				zIndex: 5
			};
		}
		axisOptions.plotLines = plotLines;
		return;
	}
	
	axisOptions.labels.y = 12;
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
	seriesOptions.pointRange = 1.5;
	seriesOptions.dataLabels.y = 0;
},

/**
 * Called before chart instance is rendered.
 *
 * @param options
 *            chart options
 * @param  chart
 *             chart instance
 */
beforeRendering: function(options, chart)
{
	options.title.x = 5;
	options.title.y = 5;
	options.chart.spacingTop= 20;
	options.chart.spacingLeft = 10;
	options.chart.spacingRight = 10;
	options.chart.spacingBottom = 20;
	options.title.floating = true;
	
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
	var _chart = chart._chart; 
	var container = $(_chart.renderTo).attr('id'); 
 
	//set chart properties 
	var chartID = '#'+container+ ' '; 
	var unknownText = chartID + ' svg text:eq(0) tspan';
	
	chart.origColors = []; 
	$('.numPeopleHousehold .highcharts-series rect').each(function(){ 
		chart.origColors[$('.numPeopleHousehold .highcharts-series rect').index($(this))] = $(this).attr('fill'); 
	}); 
 
	var grey = '#CCC'; 
	$('.numPeopleHousehold .highcharts-series rect').click(function(){
		var index = $('.numPeopleHousehold .highcharts-series rect').index($(this)); 
		if($(this).attr('active') == 'false'){ 
			$(this).attr('fill', chart.origColors[index]).attr('active','true'); 
			$('.numPeopleHousehold .highcharts-data-labels g text').eq(index).css({'color':'#666','fill':'#666'}); 
			$('.numPeopleHousehold .highcharts-axis-labels text').eq(index).css({'color':'#666','fill':'#666'});
		} 
		else{ 
			if(otherBarsActive(index) === true){//all active 
				$('.numPeopleHousehold .highcharts-series rect').not($(this)).attr('fill', grey).attr('active','false'); 
				$('.numPeopleHousehold .highcharts-data-labels g text').not($('.numPeopleHousehold .highcharts-data-labels g text').eq(index)).css({'color':'#BBB','fill':'#BBB'}); 
				$('.numPeopleHousehold .highcharts-axis-labels text').not($('.numPeopleHousehold .highcharts-axis-labels text').eq(index)).css({'color':'#BBB','fill':'#BBB'}); 
			} 
			else if(otherBarsInactive(index) === true){//all inactive 
				$('.numPeopleHousehold .highcharts-series rect').not($(this)).each(function(){ 
					$(this).attr('fill', chart.origColors[$('.numPeopleHousehold .highcharts-series rect').index($(this))]).attr('active','true'); 
				}); 
				$('.numPeopleHousehold .highcharts-data-labels g text').not($('.numPeopleHousehold .highcharts-data-labels g text').eq(index)).css({'color':'#666','fill':'#666'}); 
				$('.numPeopleHousehold .highcharts-axis-labels text').not($('.numPeopleHousehold .highcharts-axis-labels text').eq(index)).css({'color':'#666','fill':'#666'}); 
			} 
			else{//at least one other active 
				$('.numPeopleHousehold .highcharts-series rect').eq(index).attr('fill', grey).attr('active',false).mouseover(); 
				$('.numPeopleHousehold .highcharts-data-labels g text').eq(index).css({'color':'#BBB','fill':'#BBB'}); 
				$('.numPeopleHousehold .highcharts-axis-labels text').eq(index).css({'color':'#BBB','fill':'#BBB'}); 
			} 
		} 
	})	 
	.mouseover(function(){ 
		var index = $('.numPeopleHousehold .highcharts-series rect').index($(this)); 
		$(this).attr('fill-opacity',0.4); 
		$(this).attr('fill', chart.origColors[$('.numPeopleHousehold .highcharts-series rect').index($(this))]);			
	}) 
	.mouseout(function(){ 
		var index = $('.numPeopleHousehold .highcharts-series rect').index($(this));  
		if($(this).attr('active') == 'false'){
			$(this).attr('fill-opacity',1.0);
			$(this).attr('fill', grey);
		}
		else {
			$(this).attr('fill-opacity',1.0);
			$(this).attr('fill', chart.origColors[$('.numPeopleHousehold .highcharts-series rect').index($(this))]);
		}
	}); 
	
	function otherBarsActive(currBarIndex){ 
		var ret = true; 
		$('.numPeopleHousehold .highcharts-series rect').each(function(){ 
			if($('.numPeopleHousehold .highcharts-series rect').index($(this)) !== currBarIndex && $(this).attr('active') == 'false'){ 
				ret = false; 
				return false; 
			} 
		}); 
		return ret; 
	}

	function otherBarsInactive(currBarIndex){ 
		var ret = true; 
		$('.numPeopleHousehold .highcharts-series rect').each(function(){ 
			if($('.numPeopleHousehold .highcharts-series rect').index($(this)) !== currBarIndex && $(this).attr('active') == 'true'){ 
				ret = false; 
				return false; 
			} 
		}); 
		return ret; 
	}
	
	//unknown popover 
	var timer; 
	var hoverTimeout = 500; 
	var visible = false; 
	var on = true; 
	var clicked = false; 
	var popoverClassName = 'numPeopleHousehold-unknown-popup'; 
 
	function addPopover(){ 
		if(visible === true) return; 
		var container = $('<div class="unknown-popup-container"></div>'); 
		var background = $('<div class="unknown_popup"></div>'); 
		var text = $('<div class="unknownStatus">Unknown Children: </div>'); 
		var sp = $('<span><span>'); 
		var divot = $('<div class="divot"></div>'); 
 
		sp.html((on === true)? 'On':'Off'); 
		text.append(sp); 
		background.append(text); 
		container.append(background); 
		container.append(divot); 
		container.css($(unknownText).parent().offset()); 
		container.css('left',function(i, current) { return parseInt(current) -40; }); 
		container.css('top',function(i, current) { return parseInt(current) -40; }); 
		container.css('z-index',201); 
		container.addClass(popoverClassName); 
 
		$('body').prepend(container); 
		visible = true; 
 
		$('.'+popoverClassName+'.unknown-popup-container').css({ 
			'font-size': '12px', 
			'position': 'absolute' 
		}); 
		$('.'+popoverClassName+'.unknown-popup-container .unknown_popup').css({ 
			'background-color': 'black', 
			'background': 'rgba(0, 0, 0, 0.8)', 
			'border-radius': '6px', 
			'text-align': 'center', 
			'padding': '7px 6px', 
			'color': 'white', 
			'white-space': 'nowrap', 
			'display': 'inline-block' 
		}); 
 
		$('.'+popoverClassName+'.unknown-popup-container .unknown_popup .unknownStatus').css({ 
			'padding': '0px 3px', 
			'font-weight': 'bold' 
		}); 
 
		$('.'+popoverClassName+'.unknown-popup-container .divot').css({ 
			'border-left': '5px solid transparent', 
			'border-right': '5px solid transparent', 
			'border-top': '5px solid rgba(0, 0, 0, 0.8)', 
			'width':'0px', 
			'margin':'1px auto 0 auto' 
		}); 
	} 
 
	$(unknownText).mouseover(function(){ 
		addPopover(); 
		$(this).css('cursor','pointer'); 
	}) 
	.mouseout(function(){ 
		delay = (clicked === true)?0:2000; 
		timer = setTimeout(function(){ 
			$('.'+popoverClassName).fadeOut(function(){ $(this).remove(); }); 
			visible = false; 
			clicked = false; 
		}, delay); 
		$(this).css('cursor','auto'); 
	}) 
	.click(function(){ 
		addPopover(); 
		clicked = true; 
		setTimeout(function(){ 
			on = !on; 
			var val = (on === true)? 'On':'Off'; 
			$(unknownText).parent().css({'color': (on === true)?'#666':'#CCC','fill': (on === true)?'#666':'#CCC' }); 
			$('.'+popoverClassName+' .unknownStatus span').html(val); 
		}, 200); 
	});
},