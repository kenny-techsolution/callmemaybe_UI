angular.module('cip.outOfHome').directive('standaloneEditDates', ['$rootScope', 'pickYourOwnBoards', 'campaignDateService', 'campaignDetailErrorService',
function($rootScope, pickYourOwnBoards, campaignDateService, campaignDetailErrorService) {
	'use strict';

	return {
		restrict: 'A',
		templateUrl: 'views/outOfHome/standalone-edit-dates.html',
		controller: ['$scope', function($scope) {
			$scope.errorService = campaignDetailErrorService;

			$scope.onChangeNumWeeks = function(choice) {
				if (choice === '' || Number(choice) === 0 || Number(choice) > 52) {
					return $scope.errorService.turnOn('incorrectWeekLength');
				} else {
					$scope.errorService.turnOff('incorrectWeekLength');
				}
				var startDate = $scope.pickYourOwn.editDatesForm.startDate;
				$scope.pickYourOwn.editDatesForm.numWeeks = choice;
				var numWeeks = $scope.pickYourOwn.editDatesForm.numWeeks;
				$scope.pickYourOwn.editDatesForm.endDate = campaignDateService.getEndDate(startDate, numWeeks);
				$scope.pickYourOwn.opened = campaignDateService.verifyValidDateRange(startDate, numWeeks, $scope.pickYourOwn.opened);
				$scope.updateContainerHeight();
			};

			$scope.onOpenDatePicker = function() {
				$scope.pickYourOwn.opened = true;

				var $calendarMonthYear = $('#standaloneCampaignBegin table thead tr:first-child th:nth-child(2)');
				//this function adds the class to style the selected weeks
				var setSelectedWeeks = function() {
					var date = campaignDateService.parseDatefromMYString($calendarMonthYear.text());
					var $calendarRow = $('#standaloneCampaignBegin table tbody tr');
					var numWeeks = $scope.pickYourOwn.editDatesForm.numWeeks;
					var startDate = $scope.pickYourOwn.editDatesForm.startDate;
					var endDate = $scope.pickYourOwn.editDatesForm.endDate;
					var minDate = campaignDateService.getNextMondayFromToday();
					var maxDate = campaignDateService.getMaxDate(minDate, Number(numWeeks));

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
				if ($scope.pickYourOwn.datePickerLoaded === false) {
					$('#standaloneCampaignBegin .pull-right').on('click', function() {
						setSelectedWeeks();
					});
					setTimeout(function() {
						$('#standaloneCampaignBegin table tbody button[disabled="disabled"]').off('click').click(function(event) {
							event.preventDefault();
						});
					}, 100);

					$('#standaloneCampaignBegin thead tr th:nth-child(2) button').off('click');
					$('#standaloneCampaignBegin .pull-left').on('click', function() {
						setSelectedWeeks();
					});
					$('#standaloneCampaignBegin .dropdown-menu li:nth-child(2)').hide();
				}
				$scope.pickYourOwn.datePickerLoaded = true;
			};

			$scope.onChangeStartDate = function(date) {
				$scope.pickYourOwn.opened = false;
				$scope.errorService.turnOff('emptyStartDate');
				if (date) {
					var startDate = $scope.pickYourOwn.editDatesForm.startDate;
					var numWeeks = $scope.pickYourOwn.editDatesForm.numWeeks;
					$scope.pickYourOwn.editDatesForm.startDate = campaignDateService.getCurrentMondayFromDate(date);
					$scope.pickYourOwn.editDatesForm.endDate = campaignDateService.getEndDate(startDate, Number(numWeeks));
					$scope.pickYourOwn.opened = campaignDateService.verifyValidDateRange(startDate, numWeeks, $scope.pickYourOwn.opened);
				}
			};

			$scope.onChangeDefaultWeeks = function() {
				if ($scope.pickYourOwn.editDatesForm.default4weeks === true) {
					if ($scope.pickYourOwn.editDatesForm.campaignLengthOptions.indexOf(Number($scope.pickYourOwn.editDatesForm.numWeeks)) === -1) {
						$scope.pickYourOwn.editDatesForm.numWeeks = 4;
						$scope.onChangeNumWeeks($scope.pickYourOwn.editDatesForm.numWeeks);
					}
				} else {
					setTimeout(function() {
						$('#standaloneCampaignBegin number-only-input input').focus();
					}, 50);
				}
			};

			$scope.onStartDateKeyDown = function($event) {
				//prevent editing of the start date
				$event.preventDefault();
			};

			// update container height for the week options dropdown
			$scope.updateContainerHeight = function() {
				if ($('#define-campaign-standalone.tab:has(.dropdown.select-box.open)').length > 0) {
					$('#define-campaign-standalone.tab').removeClass('weekOptionsHeight');
				} else {
					$('#define-campaign-standalone.tab').addClass('weekOptionsHeight');
				}
			};
		}]
	};
}]);