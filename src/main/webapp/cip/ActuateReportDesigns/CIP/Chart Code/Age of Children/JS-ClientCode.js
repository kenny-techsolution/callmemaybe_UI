beforeGeneration: function(options)
{
	options.xAxis.categories.splice(1,0, '');
	options.series[0].data.splice(1,0, { 'y': 0 });	
	options.chart.spacingBottom = 20;
},

beforeDrawAxis: function(axis, axisOptions, chart, axisIndex)
{
	if (!axis.categories) {
		var AxisPerc = Math.floor(axis.max/6);
		var numLines = Math.floor(axis.max/AxisPerc);
		var plotLines = [];
	
		for (var i = 0; i < numLines; i++) {
			plotLines[i] = {
				color: 'rgba(255,255,255,0.75)',
				width: 1,
				value: AxisPerc * i,
				zIndex: 5
			};
		}
		axisOptions.plotLines = plotLines;
		return;
	}
},

beforeRendering: function(options, chart)
{

},

afterRendering: function(chart)
{
	var _chart = chart._chart;
	var container = $(_chart.renderTo).attr('id');

	//set chart properties
	var chartID = '#'+container+ ' ';
	var seriesClass = ' .highcharts-series ';
	var axisLabels = ' .highcharts-axis-labels ';
	var dataLabels = ' .highcharts-data-labels ';
	//compound selectors
	var barSelector = chartID+ seriesClass + ' rect';
	var axisLabelsText = chartID + axisLabels + 'text';
	var axisLabelsTSpan = chartID + axisLabels + 'tspan';
	var dataLabelsG = chartID + dataLabels + 'g';
	var dataLabelsTSpan = chartID + dataLabels + 'text tspan';
	var dataLabelsText = chartID + dataLabels + 'text';
	var unknownText = chartID + ' svg text:eq(1) tspan';

	//remove all current event handlers
	$(barSelector).off();
	
	//save original colors
	chart.origColors = [];
	$(barSelector).each(function(){
		chart.origColors[$(barSelector).index($(this))] = $(this).attr('fill');
		$(this).attr('active','true');
	});

	//alter bar placement
	var dec = 15;	
	$(barSelector+':not(:first):not(:last)').each(function(){
		$(this).attr('x', $(this).attr('x') - dec);		
		var index = $(barSelector).index($(this));
		$(axisLabelsTSpan).eq(index).attr('x',$(axisLabelsTSpan).eq(index).attr('x') - (dec-2))
		
		if($(dataLabelsG).eq(index).attr('transform') !== undefined){
			var transform = $(dataLabelsG).eq(index).attr('transform').replace('translate(','').replace(')','');
			transform = transform.split(',');
		
			transform[0] = transform[0] - (dec-2);
			$(dataLabelsG).eq(index).attr('transform', 'translate('+transform[0]+','+transform[1]+')' );
		}
		dec -=3;
	});
	
	
	$(barSelector).eq(0).attr('x', 5.5);
	$(axisLabelsTSpan).eq(0).attr('x',34);	
	$(dataLabelsTSpan).eq(0).attr('x',4);

	
	//tweak labels
	$(axisLabelsText).attr('y','233');

	$(dataLabelsG).eq(1).hide();
	
	//interactive functions
	var grey = '#CCC';
	$(barSelector).click(function(){
		var index = $(barSelector).index($(this));
		if($(this).attr('active') == 'false'){
			$(this).attr('fill', chart.origColors[index]).attr('active','true');
			$(dataLabelsText).eq(index).css({'color':'#666','fill':'#666'});
			$(axisLabelsText).eq(index).css({'color':'#666','fill':'#666'});
		}
		else{
			if(otherBarsActive(index) === true){//all active
				$(barSelector).not($(this)).attr('fill', grey).attr('active','false');
				$(dataLabelsText).not($(dataLabelsText).eq(index)).css({'color':'#BBB','fill':'#BBB'});
				$(axisLabelsText).not($(axisLabelsText).eq(index)).css({'color':'#BBB','fill':'#BBB'});
			}
			else if(otherBarsInactive(index) === true){//all inactive
				$(barSelector).not($(this)).each(function(){
					$(this).attr('fill', chart.origColors[$(barSelector).index($(this))]).attr('active','true');
				});
				$(dataLabelsText).not($(dataLabelsText).eq(index)).css({'color':'#666','fill':'#666'});
				$(axisLabelsText).not($(axisLabelsText).eq(index)).css({'color':'#666','fill':'#666'});
			}
			else{//at least one other active
				$(barSelector).eq(index).attr('fill', grey).attr('active',false).mouseover();
				$(dataLabelsText).eq(index).css({'color':'#BBB','fill':'#BBB'});
				$(axisLabelsText).eq(index).css({'color':'#BBB','fill':'#BBB'});
			}
		}		
	})
	.mouseover(function(){
			var index = $(barSelector).index($(this));
			$(this).attr('fill-opacity',0.4);
			$(this).attr('fill', chart.origColors[$(barSelector).index($(this))]);
	})
	.mouseout(function(){
		$(this).attr('fill-opacity',1.0);
		var index = $(barSelector).index($(this));
		if($(this).attr('active') == 'true'){
			$(this).attr('fill', chart.origColors[$(barSelector).index($(this))]);
		}
		else{
			$(this).attr('fill','#CCC');
		}
	});
	
	function otherBarsActive(currBarIndex){
		var ret = true;
		$(barSelector).each(function(){
			if($(barSelector).index($(this)) !== currBarIndex && $(this).attr('active') == 'false'){
				ret = false;
				return false;			
			}
		});
		return ret;
	}
	
	function otherBarsInactive(currBarIndex){
		var ret = true;
		$(barSelector).each(function(){
			if($(barSelector).index($(this)) !== currBarIndex && $(this).attr('active') == 'true'){
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
	var popoverClassName = 'ageOfChildren-unknown-popup';
	
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
		container.css('right','-36px');
		container.css('bottom','15px');
		container.css('z-index',201);
		container.addClass(popoverClassName);
	
		$('.ageOfChildren').append(container);
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
	


	return;
}