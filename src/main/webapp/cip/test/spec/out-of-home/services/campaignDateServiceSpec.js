describe('campaignDateService', function() {
	'use strict';

	var campaignDateService;
	var errorServiceMock = {
		turnOn: $.noop,
		turnOff: $.noop,
		setMessage: $.noop
	};
	beforeEach(module('cip.outOfHome', function($provide) {
		$provide.value('campaignDetailErrorService', errorServiceMock);
	}));

	beforeEach(inject(function(_campaignDateService_) {
		campaignDateService = _campaignDateService_;
	}));

	it('has a resetDate function that resets the hours, minutes, seconds, and milliseconds', function() {
		var today = new Date();
		today.setHours(1);
		today.setMinutes(2);
		today.setSeconds(3);
		today.setMilliseconds(4);

		var resetted = campaignDateService.resetDate(today);
		expect(resetted.getHours()).toBe(0);
		expect(resetted.getMinutes()).toBe(0);
		expect(resetted.getSeconds()).toBe(0);
		expect(resetted.getMilliseconds()).toBe(0);
	});

	it('has a parseDatefromMYString function that returns a date object for a given month and year string', function() {
		var input = 'March 2014';
		var myDate = campaignDateService.parseDatefromMYString(input);

		expect(myDate.getFullYear()).toEqual(2014);
		expect(myDate.getMonth()).toEqual(2); //month is 0-based
	});

	it('has a getNextMondayFromToday function that returns the next monday from today except if today is Monday', function() {
		var today = new Date();
		var nextMonday = campaignDateService.getNextMondayFromToday();
		expect(nextMonday.getDay()).toBe(1);
		if (today.getDay() === 1) {
			expect(today.getFullYear()).toEqual(nextMonday.getFullYear());
			expect(today.getMonth()).toEqual(nextMonday.getMonth());
			expect(today.getDate()).toEqual(nextMonday.getDate());
		} else {
			expect(today < nextMonday).toBe(true);
		}
	});

	it('has a getCurrentMondayFromDate function that returns the monday of the current week', function() {
		var myDate = new Date(2014, 4, 8, 6, 30, 33, 0); // 5/8/2014, a Thursday
		var currentMonday = campaignDateService.getCurrentMondayFromDate(myDate);
		// current Monday will be 5/5/2014
		expect(currentMonday.getDay()).toBe(1);
		expect(currentMonday.getFullYear()).toBe(2014);
		expect(currentMonday.getMonth()).toBe(4); //month is 0-based
		expect(currentMonday.getDate()).toBe(5);
	});

	it('has a getEndDate function that returns the end date for a given startDate and length in weeks', function() {
		var myDate = new Date(2014, 4, 8, 6, 30, 33, 0); // 5/8/2014, a Thursday
		var endDate = campaignDateService.getEndDate(myDate, 6);
		// endDate will be 6/19/2014
		expect(endDate.getFullYear()).toBe(2014);
		expect(endDate.getMonth()).toBe(5); //month is 0-based
		expect(endDate.getDate()).toBe(19);
	});

	it('has a rewindWeeks function that returns a date rewinded by the given number of weeks', function() {
		var myDate = new Date(2014, 4, 8, 6, 30, 33, 0); // 5/8/2014, a Thursday
		var rewindedDate = campaignDateService.rewindWeeks(myDate, 3);
		// rewindedDate should be 4/17/2014
		expect(rewindedDate.getFullYear()).toBe(2014);
		expect(rewindedDate.getMonth()).toBe(3); //month is 0-based
		expect(rewindedDate.getDate()).toBe(17);
	});

	it('has a getMaxDate function that returns the latest monday that can be selected where its endDate stays within 2 years from the given date', function() {
		var myDate = new Date(2014, 4, 8, 6, 30, 33, 0); // 5/8/2014, a Thursday
		var maxDate = campaignDateService.getMaxDate(myDate, 5);
		expect(maxDate.getFullYear()).toBe(2016);
		expect(maxDate.getMonth()).toBe(2);
		expect(maxDate.getDate()).toBe(27);
	});

	it('has a getTwoYearsFromTodayDate function that returns a date 2 years from the given date', function() {
		var myDate = new Date(2014, 4, 8, 6, 30, 33, 0); // 5/8/2014, a Thursday
		var twoYears = campaignDateService.getTwoYearsFromTodayDate(myDate);
		expect(twoYears.getFullYear()).toBe(2016);
		expect(twoYears.getMonth()).toBe(4);
		expect(twoYears.getDate()).toBe(7);
	});

	it('has a createDropDownValues function that returns an array from min value to max value over an interval', function() {
		var values = campaignDateService.createDropDownValues(4, 18, 2);
		expect(values).toEqual([4, 6, 8, 10, 12, 14, 16]);
	});

	describe('verifyValidDateRange', function() {
		var startDate = new Date(2014, 4, 8, 6, 30, 33, 0);
		var endDate = new Date(2014, 9, 8, 6, 30, 33, 0);
		var twoYearsFromTodayDate = new Date(2016, 4, 7, 0, 0, 0, 0);
		var minDate = new Date(2014, 4, 6, 0, 0, 0, 0);
		var numWeeks = 4;
		var opened = true;

		beforeEach(function() {
			spyOn(errorServiceMock, 'turnOff').andCallThrough();
			spyOn(errorServiceMock, 'turnOn').andCallThrough();
			spyOn(errorServiceMock, 'setMessage').andCallThrough();
			spyOn(campaignDateService, 'getNextMondayFromToday').andReturn(minDate);
		});

		describe('for a valid date', function() {
			beforeEach(function() {
				opened = campaignDateService.verifyValidDateRange(startDate, numWeeks, true);
			});

			it('does not return false if the date range is valid', function() {
				expect(opened).toBe(true);
			});

			it('turns off the errors if the date range is valid', function() {
				expect(errorServiceMock.turnOff).toHaveBeenCalledWith('incorrectStartDateRange');
				expect(errorServiceMock.turnOff).toHaveBeenCalledWith('beyondBound');
			});
		});

		describe('for an invalid startDate', function() {
			beforeEach(function() {
				startDate = new Date(2014, 4, 5, 6, 30, 33, 0);
				opened = campaignDateService.verifyValidDateRange(startDate, numWeeks, true);
			});

			it('returns false', function() {
				expect(opened).toBe(false);
			});

			it('turns on the "incorrectStartDateRange" error', function() {
				expect(errorServiceMock.turnOn).toHaveBeenCalledWith('incorrectStartDateRange');
			});
		});

		describe('for an invalid endDate', function() {
			beforeEach(function() {
				startDate = new Date();
				numWeeks = 125;
				opened = campaignDateService.verifyValidDateRange(startDate, numWeeks, true);
			});

			it('returns false', function() {
				expect(opened).toBe(false);
			});

			it('turns on the "beyondBound" error', function() {
				expect(errorServiceMock.turnOn).toHaveBeenCalledWith('beyondBound');
			});

			it('sets an error message', function() {
				expect(errorServiceMock.setMessage).toHaveBeenCalled();
				var args = errorServiceMock.setMessage.argsForCall[0];
				expect(args[0]).toEqual('beyondBound');
				expect(args[1].indexOf('Please select a campaign start date and length that allow the campaign to be completed by')).toBeGreaterThan(-1);
			});
		});
	});
});