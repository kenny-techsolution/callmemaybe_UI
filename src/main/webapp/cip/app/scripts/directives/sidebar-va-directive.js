'use strict';

angular.module('cip')
	.directive('sidebarVa', ['$rootScope', function ($rootScope) {
		return {
			restrict: 'A',
			scope: {
				poisModel: '=',
				datasetSelected:'=',
			},
			templateUrl: 'views/partials/sidebar-va-template.html',
			controller: function ($scope, $compile, itemStorage, angularBridgeService, getAreasService) {
				/*********************************************************************
				 * scope variables
				 *********************************************************************/
				$scope.charts = itemStorage.charts;
				$scope.experts = itemStorage.experts;
				$scope.snapshots = itemStorage.snapshots;
				$scope.trends = itemStorage.trends;
				$scope.product = itemStorage.product;
				$scope.cipMap = {
					billboards: null
				};
				$scope.globalStatus = $rootScope.globalStatus;

				/*********************************************************************
				 * scope methods
				 *********************************************************************/

				$scope.openCampaign = function () {
					$('#campaign').animate({
						left: '0%'
					}, 1000, function () {
						$('.side-bar-tab').hide();
					});
				};

				/*********************************************************************
				 * controller variables
				 *********************************************************************/
				sidebar.isPanelResizing = false;
				sidebar.MinPanelHeight = 50;
				sidebar.resetTimeout = undefined;

				/*********************************************************************
				 * controller methods
				 *********************************************************************/

				$scope.$on('cip:poiListToggled', function(){
					$scope.$broadcast('cip:poiListToggledBroadcast', null);
				});

				sidebar.initPanelTabs = function () {
					var isFirstRun = true,
						$accordionPanel = $('.accordion-panel');
					$accordionPanel.each(function (i, element) {
						var $this = $(element),
							$navPanel = $('.nav-panel-tabs', $this),
							$navLinks = $('ul li', $navPanel),
							$navToggle = $('.nav-tab-toggle', $navPanel),
							$navSlider = $('.slider', $this);

						$navLinks.click(function (evt) {
							var $nav = $(this).parent();
							if ($(this).hasClass('slide-tabs')) {
								navToggle($navToggle);
							} else {
								$('li', $nav).removeClass('active');
								if ($nav.hasClass('left')) {
									$this.find('.content-left > div').removeClass('active');
								} else if ($nav.hasClass('right')) {
									$this.find('.content-right > div').removeClass('active');
								} else {
									$this.find('.tab').removeClass('active');
								}
								$(this).addClass('active');
								$('#' + $(this).attr('data-tab-id')).addClass('active');
							}
						});

						$navToggle.click(function (evt) {
							navToggle($(this));
						});
						var navToggle = function ($navToggle) {
							var $this = $navToggle;
							if ($this.attr('data-position') === 'right') {
								$navPanel.parent().next().find('.content-right').fadeOut(function () {
									$navPanel.parent().next().find('.content-left').fadeIn();
								});
								$navToggle.attr('data-position', 'left');
								$navSlider.addClass('slide-left');
							} else {
								$navPanel.parent().next().find('.content-left').fadeOut(function () {
									$navPanel.parent().next().find('.content-right').fadeIn();
								});
								$navToggle.attr('data-position', 'right');
								$navSlider.removeClass('slide-left');
							}
						};
					});
				};

				sidebar.initPanelAccordion = function () {
					sidebar.adjustSideBar();

					$('.toggle-accordion').click(function () {

						$('#nav-collapsed').toggle();
						$('#nav-expanded').toggle();

						if ($('#nav-expanded').is(':visible')) {
							$('#charts').removeAttr('style');
							$('.side-bar-tab').addClass('active');

						} else {
							$('#charts').css({'max-width': '100%'});
							$('.side-bar-tab').removeClass('active');
						}
						chartWindow.resizeChartWindow();
					});

					$('#nav-collapsed').toggle();
					$('#nav-expanded').toggle();
				};

				sidebar.windowResizeHandler = function () {
					$(window).resize(function () {
						if (sidebar.isPanelResizing === false) {
							sidebar.adjustSideBar();
						}
					});
				};

				sidebar.getOtherHeights = function (id1, id2) {
					var ret = 0;
					$('#nav-accordion .accordion-panel').each(function () {
						if ($(this).attr('id') !== id1 && $(this).attr('id') !== id2) {
							ret += $(this).height();
						}
					});
					return ret;
				};

				sidebar.adjustSideBar = function () {
					var top = 0,
						thirds = Math.ceil(($('body').height() - 50) / $('#nav-expanded .accordion-panel').length);

					var sizes = {
						'VA-beforeDatasetSelected': {
							'product-container' : ($(window).height() - 50),
							'read-out-container' : 0,
							'charts-container' : 0
						},
						'VA-afterDatasetSelected': {
							'product-container': ($(window).height() - 50) - 180,
							'read-out-container': 0,
							'charts-container': 180
						}
					};

					$('#nav-accordion .accordion-panel').each(function () {
						if (sidebar.mode === undefined) {
							//set position
							$(this).css({
								'top': top + 'px',
								'height': thirds + 'px'
							});
							top += (thirds - 1);
						}
						else if (sidebar.mode==='VA'){
							var campaignSuffix = ($scope.datasetSelected === false) ? '-beforeDatasetSelected' : '-afterDatasetSelected';
							var panelHeight = sizes['VA' + campaignSuffix][$(this).attr('id')];
							var styleRules = (panelHeight !== 0) ? {
								'top' : top + 'px',
								'height' : panelHeight + 'px',
								'display' : 'block'
							} : {
								'top' : top + 'px',
								'display' : 'none'
							};
							$(this).css(styleRules);
							top += $(this).height();
						}

						if ($(this).has('div.ui-resizable-n').length) {
							// if the resizable element doesn't contain the handler, a mouse click on it will cause "Cannot read property 'ownerDocument' of undefined " error
							$(this).resizable({
								handles: {
									'n': '.ui-resizable-n'
								},
								minHeight: sidebar.MinPanelHeight,
								start: function (event, ui) {
									sidebar.isPanelResizing = true;
									if (sidebar.resetTimeout) {
										clearTimeout(sidebar.resetTimeout);
									}
								},
								resize: function (event, ui) {
									sidebar.mode = 'VA';
									var $curr = ui.element,
										$prev = $curr.prev('.accordion-panel'),
										$next = $curr.next('.accordion-panel'),
										totalHeight = $('body').height() - 50,
										newHeight = (totalHeight - sidebar.getOtherHeights($prev.attr('id'), undefined));
									if (newHeight < sidebar.MinPanelHeight) {
										$prev.css('height', sidebar.MinPanelHeight + 'px');
										$curr.css({
											'top': (sidebar.getOtherHeights($curr.attr('id'), $next.attr('id'))) + 'px',
											'height': (totalHeight - sidebar.getOtherHeights($curr.attr('id'), undefined)) + 'px'
										});
									} else {
										$prev.css('height', newHeight + 3 + 'px');
									}
								},
								stop: function (event, ui) {
									sidebar.isPanelResizing = false;
								}
							});
						}
					});
				};

				sidebar.setMode = function (mode) {
					sidebar.mode = mode;
					sidebar.adjustSideBar();
				};

				sidebar.init = function () {
					sidebar.initPanelAccordion();
					sidebar.initPanelTabs();
					sidebar.windowResizeHandler();
					sidebar.setMode('VA');
				};

				sidebar.init();

				$scope.$watch('poisModel.choroplethMode', function (isChoroplethShown) {
					angularBridgeService.choropleth.isChoroplethShown = isChoroplethShown;
				});
			}
		};
	}]);