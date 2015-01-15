angular.module('cip.outOfHome').factory('campaignDateService', ['$filter', 'campaignDetailErrorService',
function($filter, campaignDetailErrorService) {
	'use strict';
	return {
		//parse the month and year string (ex. 'January 2014') to a date object
		resetDate : function(date) {
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);
			return date;
		},
		parseDatefromMYString : function(myStr) {
			var newDate = new Date();
			var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

			var myStrs = myStr.split(' ');
			var month = Number(months.indexOf(myStrs[0]));
			var year = Number(myStrs[1]);
			newDate.setFullYear(year, month, 1);
			newDate = this.resetDate(newDate);
			return newDate;
		},
		getNextMondayFromToday : function() {
			var newDate = new Date(), diff = 0;
			if (newDate.getDay() === 0) {
				diff = newDate.getDate() + 1;
				newDate.setDate(newDate.getDate() + diff);
			} else if (newDate.getDay() !== 1) {
				diff = 7 - newDate.getDay() + 1;
				newDate.setDate(newDate.getDate() + diff);
			}
			newDate = this.resetDate(newDate);
			return newDate;
		},
		//get the monday of the week which contains the given date.
		getCurrentMondayFromDate : function(date) {
			var diff = 0;
			if (date.getDay() === 0) {
				diff = 6;
				date.setDate(date.getDate() - diff);
			} else if (date.getDay() > 1) {
				diff = date.getDay() - 1;
				date.setDate(date.getDate() - diff);
			}
			date.getDate() - 1;
			date = this.resetDate(date);
			return date;
		},
		getEndDate : function(startDate, numWeeks) {
			var endDate = new Date(startDate.getTime());
			var numWeeks1 = numWeeks || 4;
			endDate.setDate(endDate.getDate() + (numWeeks1 * 7));
			endDate = this.resetDate(endDate);
			return endDate;
		},
		rewindWeeks : function(oldDate, numWeeks) {
			var newDate = new Date(oldDate.getTime());
			var diff = numWeeks * 7;
			newDate.setDate(newDate.getDate() - diff);
			newDate = this.resetDate(newDate);
			return newDate;
		},
		getMaxDate : function(minDate, selectedNumWeeks) {
			var maxDate = new Date(minDate.getTime());
			maxDate.setDate(maxDate.getDate() + 730);
			maxDate = this.getCurrentMondayFromDate(maxDate);
			maxDate = this.rewindWeeks(maxDate, selectedNumWeeks);
			maxDate.setDate(maxDate.getDate() - 1);
			maxDate = this.resetDate(maxDate);
			return maxDate;
		},
		getTwoYearsFromTodayDate : function(todayDate) {
			var newDate = new Date(todayDate.getTime());
			newDate.setDate(newDate.getDate() + 730);
			newDate = this.resetDate(newDate);
			return newDate;
		},
		createDropDownValues : function(min, max, interval) {
			var dropDownArray = [];
			for (var i = min; i < max; i = i + interval) {
				dropDownArray.push(i);
			}
			return dropDownArray;
		},
		isIncorrectStartDate : function(startDate, minDate) {
			return startDate.getTime() < minDate.getTime();
		},
		isBeyondEndBound : function(endDate, twoYearsFromTodayDate) {
			return endDate.getTime() <= twoYearsFromTodayDate.getTime();
		},
		verifyValidDateRange : function(startDate, numWeeks, opened) {
			var minDate = this.getNextMondayFromToday();
			var twoYearsFromTodayDate = this.getTwoYearsFromTodayDate(new Date());
			var endDate = this.getEndDate(startDate, numWeeks);
			if (this.isIncorrectStartDate(startDate, minDate)) {
				campaignDetailErrorService.turnOn('incorrectStartDateRange');
				return false;
			} else {
				campaignDetailErrorService.turnOff('incorrectStartDateRange');
			}
			if (this.isBeyondEndBound(endDate, twoYearsFromTodayDate)) {
				campaignDetailErrorService.turnOff('beyondBound');
			} else {
				var dateFilter = $filter('date');
				var message = 'Please select a campaign start date and length that allow the campaign to be completed by ' + dateFilter(twoYearsFromTodayDate, 'longDate');
				campaignDetailErrorService.setMessage('beyondBound', message);
				campaignDetailErrorService.turnOn('beyondBound');
				return false;
			}
			return opened;
		}
	};
}]);