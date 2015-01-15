describe('campaignDetailCtrl', function() {
	'use strict';

	var campaignDetailCtrl, scope = {};

	var campaignDateService;

	$('body').append('<div id="campaignDates"><number-only-input><input class="myInput"/></div></div>');
	$('body').append('<div id="campaignBegin"><div class="pull-right"/><div class="pull-left"/></div>');

	beforeEach(inject(function($controller, _campaignDateService_){
		campaignDetailCtrl = $controller('campaignDetailCtrl', {$scope: scope});
		campaignDateService = _campaignDateService_;
	}));

	describe('scope.form', function() {
		var nextMonday = new Date();

		it('gets prepared with campaign details', function() {
			expect(scope.form.budgetName).toBe('Budget');
			expect(scope.form.campaignLengthOptions).toEqual([4,8,12,16,20,24,28,32,36,40,44,48,52]);
			expect(scope.form.flexiableByOptions).toEqual([1,2,3,4]);
			expect(scope.form.numWeeks).toBe('4');
			expect(scope.form.flexByWeeks).toBe(1);
			expect(scope.form.flexibleBy).toBeFalsy();
			expect(scope.form.default4weeks).toBeTruthy();
			expect(scope.form.staticBulletins).toBeTruthy();
			expect(scope.form.digitalBulletins).toBeTruthy();
		});

		it('sets the startDate to be the nextMonday', function() {
			for (var i = 0; i < 7; i ++) {
				if (nextMonday.getDay() !== 1) {
					nextMonday.setDate(nextMonday.getDate() + 1);
				}
			}
			expect(scope.form.startDate.getFullYear()).toBe(nextMonday.getFullYear());
			expect(scope.form.startDate.getMonth()).toBe(nextMonday.getMonth());
			expect(scope.form.startDate.getDate()).toBe(nextMonday.getDate());
			expect(scope.form.startDate.getDay()).toBe(1);
		});

		it('sets the endDate to be 4 weeks after the startDate', function() {
			var endDate = nextMonday;
			endDate.setDate(endDate.getDate() + (4 * 7));
			expect(scope.form.endDate.getFullYear()).toBe(endDate.getFullYear());
			expect(scope.form.endDate.getMonth()).toBe(endDate.getMonth());
			expect(scope.form.endDate.getDate()).toBe(endDate.getDate());
		});
	});

	it('defines scope.cipMap and other variables', function() {
		expect(scope.cipMap).toBeDefined();
		expect(scope.datePickerLoaded).toBe(false);
		expect(scope.dateOptions).toBeDefined();
		expect(scope.minDate).toEqual(scope.form.startDate);
		expect(scope.twoYearsFromTodayDate).toBeDefined();
		expect(scope.initDate).toEqual(scope.form.startDate);
		expect(scope.errorService).toBeDefined();
	});

	describe('onChangeDefaultWeeks function', function() {
		describe('if default4weeks is true', function() {
			it('sets numWeeks to 4 if numWeeks is not in the campaignLengthOptions', function() {
				scope.form.numWeeks = 22;
				scope.onChangeDefaultWeeks();
				expect(scope.form.numWeeks).toBe(4);
			});

			it('keeps the numWeeks the same if it is in the campaignLengthOptions', function() {
				scope.form.numWeeks = 24;
				scope.onChangeDefaultWeeks();
				expect(scope.form.numWeeks).toBe(24);
			});
		});

		it('turns off the noDigitalBoardWithCustomWeeks error if digitalBulletins is false', function() {
			spyOn(scope.errorService, 'turnOff').andCallThrough();
			scope.form.digitalBulletins = false;
			scope.onChangeDefaultWeeks();
			expect(scope.errorService.turnOff).toHaveBeenCalledWith('noDigitalBoardWithCustomWeeks');
		});

		it('focuses on the campaignDates input after 50ms if default4weeks is false', function() {
			jasmine.Clock.useMock();
			scope.form.default4weeks = false;
			scope.onChangeDefaultWeeks();
			expect($('#campaignDates number-only-input input')[0]).not.toEqual(document.activeElement);
			jasmine.Clock.tick(51);
			expect($('#campaignDates number-only-input input')[0]).toEqual(document.activeElement);
		});
	});

	it('has an onChangeFlexWeek that sets the new flexByWeeks', function() {
		expect(scope.form.flexByWeeks).toBe(1);
		scope.onChangeFlexWeek(3);
		expect(scope.form.flexByWeeks).toBe(3);
	});

	describe('onChangeNumWeeks', function() {
		it('turns on the incorrectWeekLength error if choice is empty, 0, or greater than 52', function() {
			spyOn(scope.errorService, 'turnOn').andCallThrough();

			scope.onChangeNumWeeks('');
			expect(scope.errorService.turnOn).toHaveBeenCalledWith('incorrectWeekLength');
			scope.errorService.turnOn.reset();
			scope.onChangeNumWeeks(0);
			expect(scope.errorService.turnOn).toHaveBeenCalledWith('incorrectWeekLength');
			scope.errorService.turnOn.reset();
			scope.onChangeNumWeeks(53);
			expect(scope.errorService.turnOn).toHaveBeenCalledWith('incorrectWeekLength');
		});

		it('turns off the incorrectWeekLength error if choice is valid', function() {
			spyOn(scope.errorService, 'turnOff').andCallThrough();

			scope.onChangeNumWeeks(1);
			expect(scope.errorService.turnOff).toHaveBeenCalledWith('incorrectWeekLength');
		});

		it('sets the new numWeeks', function() {
			expect(scope.form.numWeeks).toBe('4');
			scope.onChangeNumWeeks('3');
			expect(scope.form.numWeeks).toBe('3');
		});

		it('updates the endDate', function() {
			var expectedEndDate = scope.form.endDate;
			scope.onChangeNumWeeks('5');
			expectedEndDate.setDate(expectedEndDate.getDate() + 7);
			expect(scope.form.endDate).toEqual(expectedEndDate);
		});

		it('calls verifyValidDateRange', function() {
			spyOn(campaignDateService, 'verifyValidDateRange').andCallThrough();
			scope.onChangeNumWeeks(5);
			expect(campaignDateService.verifyValidDateRange).toHaveBeenCalledWith(scope.form.startDate, scope.form.numWeeks, undefined);
		});
	});

	describe('onChangeStartDate', function() {
		var monday = new Date(2014, 6, 21, 0, 0, 0, 0); // 7-21-2014
		var myDate = new Date(2014, 6, 23, 0, 0, 0, 0); // 7-23-2014
		var myEndDate = new Date(2014, 7, 18, 0, 0, 0, 0); // 8-18-2014

		it('sets opened to false', function() {
			scope.opened = true;
			scope.onChangeStartDate(myDate);
			expect(scope.opened).toBe(false);
		});

		it('turns off the emptyStartDate error', function() {
			spyOn(scope.errorService, 'turnOff').andCallThrough();

			scope.onChangeStartDate(myDate);
			expect(scope.errorService.turnOff).toHaveBeenCalledWith('emptyStartDate');
		});

		it('sets the startDate and endDate', function() {
			scope.form.startDate = null;
			scope.form.endDate = null;

			scope.onChangeStartDate(myDate);
			expect(scope.form.startDate).toEqual(monday);
			expect(scope.form.endDate).toEqual(myEndDate);
		});

		it('calls verifyValidDateRange', function() {
			spyOn(campaignDateService, 'verifyValidDateRange').andCallThrough();
			scope.onChangeStartDate(myDate);
			expect(campaignDateService.verifyValidDateRange).toHaveBeenCalledWith(scope.form.startDate, scope.form.numWeeks, false);
		});
	});

	describe('onStartDateKeyDown', function() {
		var myEvent = {
			keyCode: 8,
			currentTarget: $('#campaignDates number-only-input input')[0],
			preventDefault: $.noop
		};

		var $myInput = $('#campaignDates number-only-input input');

		describe('key press of backspace (8) or delete (46)', function() {
			it('turns on the "emptyStartDate" error', function() {
				spyOn(scope.errorService, 'turnOn').andCallThrough();
				scope.onStartDateKeyDown(myEvent);
				expect(scope.errorService.turnOn).toHaveBeenCalledWith('emptyStartDate');

				scope.errorService.turnOn.reset();
				myEvent.keyCode = 46;
				scope.onStartDateKeyDown(myEvent);
				expect(scope.errorService.turnOn).toHaveBeenCalledWith('emptyStartDate');
			});

			it('empties the input value', function() {
				$myInput.val('test');
				expect($myInput.val()).toEqual('test');
				scope.onStartDateKeyDown(myEvent);
				expect($myInput.val()).toEqual('');
			});

			it('blurs the input value', function() {
				$myInput.focus();
				expect($myInput[0]).toEqual(document.activeElement);
				scope.onStartDateKeyDown(myEvent);
				expect($myInput[0]).not.toEqual(document.activeElement);
			});
		});

		describe('key press of any other keys', function() {
			it('prevents the default action (in this case, default action is to modify the input)', function() {
				spyOn(myEvent, 'preventDefault').andCallThrough();
				myEvent.keyCode = 54;
				scope.onStartDateKeyDown(myEvent);
				expect(myEvent.preventDefault).toHaveBeenCalled();
			});
		});
	});

	describe('onOpenDatePicker', function() {
		it('sets opened to true', function() {
			scope.opened = false;
			scope.onOpenDatePicker();
			expect(scope.opened).toBe(true);
		});

		describe('if datePickerLoaded is false', function() {
			var $pullRight = $('#campaignBegin .pull-right');
			var $pullLeft = $('#campaignBegin .pull-left');

			beforeEach(function() {
				scope.datePickerLoaded = false;
				expect($._data($pullRight[0]).events).not.toBeDefined();
				expect($._data($pullLeft[0]).events).not.toBeDefined();
				scope.onOpenDatePicker();
			});

			it('binds a click event to the pull-right element', function() {
				expect($._data($pullRight[0]).events.click).toBeDefined();
			});

			it('binds a click event to the pull-left element', function() {
				expect($._data($pullLeft[0]).events.click).toBeDefined();
			});
		});

		it('sets datePickerLoaded to true', function() {
			scope.datePickerLoaded = false;
			scope.onOpenDatePicker();
			expect(scope.datePickerLoaded).toBe(true);
		});
	});

	describe('onChangeCampaignBoards', function() {
		beforeEach(function() {
			spyOn(scope.errorService, 'turnOn').andCallThrough();
			spyOn(scope.errorService, 'turnOff').andCallThrough();
		});

		it('turns on "noBoardsSelected" error if staticBulletins and digitalBulletins are both false', function() {
			scope.form.staticBulletins = false;
			scope.form.digitalBulletins = false;
			scope.onChangeCampaignBoards();
			expect(scope.errorService.turnOn).toHaveBeenCalledWith('noBoardsSelected');
		});

		it('turns on the "noDigitalBoardWithCustomWeeks" error if default4weeks and digitalBulletins are both false', function() {
			scope.form.digitalBulletins = false;
			scope.form.default4weeks = false;
			scope.onChangeCampaignBoards();
			expect(scope.errorService.turnOn).toHaveBeenCalledWith('noDigitalBoardWithCustomWeeks');
		});

		it('turns off the "noBoardsSelected" and "noDigitalBoardWithCustomWeeks" errors in all other cases', function() {
			scope.form.digitalBulletins = true;
			scope.onChangeCampaignBoards();
			var calls = scope.errorService.turnOff.calls;
			expect(calls[0].args[0]).toBe('noBoardsSelected');
			expect(calls[1].args[0]).toBe('noDigitalBoardWithCustomWeeks');
		});
	});
});