//TODO: update to angular service

'use strict';
chartWindow.init = function(){

	chartWindow.initMasonry();

	chartWindow.container = $('#chart-grid > div');

	$(window).resize(function(){
		chartWindow.resizeChartWindow(false);
	}).resize();
};


chartWindow.addItemToCanvas = function(item){
	chartWindow.container.append(item);
	chartWindow.msnry.masonry('addItems',item);
	chartWindow.msnry.masonry();
};

chartWindow.removeItemFromCanvas = function(item){
	CrossBIRTFilter.deleteWidget(item.find('.innerContainer').attr('id'));
	item.remove();
	chartWindow.msnry.masonry('remove',item);
	chartWindow.msnry.masonry();
};

chartWindow.removeAllItemsFromCanvas = function() {
	var items = chartWindow.msnry.masonry('getItemElements');
	for (var i = 0; i < items.length; i ++) {
		chartWindow.removeItemFromCanvas($(items[i]));
	}
};

chartWindow.initViewer = function(item, uiopts, width, height){
	var viewer = new actuate.Viewer(item.chartID);
	viewer.setUIOptions(uiopts);
	viewer.setReportName(item.reportName);
	viewer.setReportletBookmark(item.reportBookmark);
	viewer.setSize(width, height);
	viewer.submit();
};

chartWindow.resizeChartWindow = function(){
	chartWindow.msnry.masonry();
};

chartWindow.initMasonry = function(){
	chartWindow.msnry = $('#chart-grid > div').masonry({
		columnWidth: 350,
		itemSelector: '.chartContainer',
		gutter: 14,
		isAnimated: true,
		isFitWidth: true
	});
	chartWindow.msnry.masonry();
};

chartWindow.currentMode = 'VA';
chartWindow.toggleMode = function(){
	if(chartWindow.currentMode === 'VA'){
		chartWindow.currentMode = 'OOH';
	}
	else if(chartWindow.currentMode === 'OOH'){
		chartWindow.currentMode = 'VA';
	}
	chartWindow.setMode(chartWindow.currentMode);
};

chartWindow.setMode = function(mode){
	if(mode === 'VA'){
		$('body').removeClass('pattern-fill');
	}
	else if(mode === 'OOH'){
		$('body').addClass('pattern-fill');
	}
	sidebar.setMode(mode);
};