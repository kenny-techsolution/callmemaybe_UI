angular.module('cip.outOfHome').controller('campaignDetailCtrl', ['$compile', '$scope', '$filter', 'campaignDateService', 'campaignSelection', 'campaignDetailErrorService',
function($compile, $scope, $filter, campaignDateService, campaignSelection, campaignDetailErrorService) {
	'use strict';

	$scope.form = campaignSelection.campaignDetails;
	$scope.cipMap = campaignSelection.cipMap;

	$scope.datePickerLoaded = false;
	$scope.dateOptions = {
		'year-format' : '"yy"',
		'starting-day' : 1
	};
	$scope.minDate = campaignDateService.getNextMondayFromToday();
	$scope.maxDate = campaignDateService.getMaxDate($scope.minDate, Number($scope.form.numWeeks));
	$scope.twoYearsFromTodayDate = campaignDateService.getTwoYearsFromTodayDate(new Date());
	$scope.initDate = $scope.form.startDate;

	$scope.errorService = campaignDetailErrorService;

	$scope.onChangeDefaultWeeks = function() {
		if ($scope.form.default4weeks === true) {
			if ($scope.form.campaignLengthOptions.indexOf(Number($scope.form.numWeeks)) === -1) {
				$scope.form.numWeeks = 4;
				$scope.onChangeNumWeeks($scope.form.numWeeks);
			}
			if ($scope.form.digitalBulletins === false) {
				$scope.errorService.turnOff('noDigitalBoardWithCustomWeeks');
			}
		} else {
			setTimeout(function() {
				$('#campaignDates number-only-input input').focus();
			}, 50);

		}
	};
	$scope.onChangeFlexWeek = function(choice) {
		$scope.form.flexByWeeks = choice;
	};
	$scope.onChangeNumWeeks = function(choice) {
		if (choice === '' || Number(choice) === 0 || Number(choice) > 52) {
			return $scope.errorService.turnOn('incorrectWeekLength');
		} else {
			$scope.errorService.turnOff('incorrectWeekLength');
		}
		$scope.form.numWeeks = choice;
		$scope.form.endDate = campaignDateService.getEndDate($scope.form.startDate, $scope.form.numWeeks);
		$scope.opened = campaignDateService.verifyValidDateRange($scope.form.startDate, $scope.form.numWeeks, $scope.opened);
	};

	$scope.onChangeStartDate = function(date) {
		$scope.opened = false;
		$scope.errorService.turnOff('emptyStartDate');
		if (date) {
			$scope.form.startDate = campaignDateService.getCurrentMondayFromDate(date);
			$scope.form.endDate = campaignDateService.getEndDate($scope.form.startDate, Number($scope.form.numWeeks));
			$scope.opened = campaignDateService.verifyValidDateRange($scope.form.startDate, $scope.form.numWeeks, $scope.opened);
		}
	};

	$scope.onStartDateKeyDown = function($event) {
		var key = $event.keyCode || $event.charCode;
		var target = $event.currentTarget;
		if (key === 8 || key === 46) {
			$scope.errorService.turnOn('emptyStartDate');
			angular.element(target).val('').blur();
		} else {
			$event.preventDefault();
		}

		setTimeout(function() {
			angular.element('body').trigger('click');
		}, 0);
	};

	$scope.onOpenDatePicker = function() {
		$scope.opened = true;

		var $calendarMonthYear = $('#campaignBegin table thead tr:first-child th:nth-child(2)');
		//this function adds the class to style the selected weeks
		var setSelectedWeeks = function() {
			var monthYearStr = $calendarMonthYear.text();
			var date = campaignDateService.parseDatefromMYString(monthYearStr);
			var $calendarRow = $('#campaignBegin table tbody tr');
			var startDate = $scope.form.startDate;
			var endDate = $scope.form.endDate;
			var minDate = $scope.minDate;
			var maxDate = $scope.maxDate;

			angular.forEach($calendarRow, function(item, key) {
				var dateStr = $(item).find('td:last-child').text();
				if (key === $calendarRow.length - 1 && Number(dateStr) < 8) {
					date.setMonth(date.getMonth() + 1);
					date.setDate(Number(dateStr));
				}
				date.setDate(Number(dateStr));
				if (startDate.getTime() < date.getTime() && date.getTime() <= endDate.getTime()) {
					$(item).find('button').addClass('selected-week');
				} else {
					if (minDate.getTime() > date.getTime() || date.getTime() > maxDate.getTime()) {
						$(item).find('button').addClass('unselected-week');
					}
				}
			});
		};
		setSelectedWeeks();
		if ($scope.datePickerLoaded === false) {
			$('#campaignBegin .pull-right').on('click', function() {
				setSelectedWeeks();
			});
			setTimeout(function() {
				$('#campaignBegin table tbody button[disabled="disabled"]').off('click').click(function(event) {
					event.preventDefault();
				});
			}, 100);

			$('#campaignBegin thead tr th:nth-child(2) button').off('click');
			$('#campaignBegin .pull-left').on('click', function() {
				setSelectedWeeks();
			});
			$('#campaignBegin .dropdown-menu li:nth-child(2)').hide();
		}
		$scope.datePickerLoaded = true;
	};

	//Below are Campaign Board related.
	$scope.onChangeCampaignBoards = function() {
		if ($scope.form.staticBulletins === false && $scope.form.digitalBulletins === false) {
			$scope.errorService.turnOn('noBoardsSelected');
		} else if ($scope.form.default4weeks === false && $scope.form.digitalBulletins === false) {
			$scope.errorService.turnOn('noDigitalBoardWithCustomWeeks');
		} else {
			$scope.errorService.turnOff('noBoardsSelected');
			$scope.errorService.turnOff('noDigitalBoardWithCustomWeeks');
		}
	};
}]);