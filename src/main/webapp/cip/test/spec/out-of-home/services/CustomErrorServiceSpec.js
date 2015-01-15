describe('CustomErrorService', function() {
	'use strict';
	 
	var CustomErrorServiceProvider;
	var ErrorService;
	var myErrors = {
		'error': {
			show: false,
			message: 'This is an error.'
		}
	};

	beforeEach(inject(function(_CustomErrorServiceProvider_){
		CustomErrorServiceProvider = _CustomErrorServiceProvider_;
	}));

	it('has a getInstance function that constructs an instance', function() {
		expect(typeof CustomErrorServiceProvider.getInstance).toEqual('function');
	});

	describe('when an instance is created', function() {
		beforeEach(function() {
			ErrorService = CustomErrorServiceProvider.getInstance(myErrors);
		});

		it('instantiates the object with 3 functions', function() {
			expect(typeof ErrorService.turnOn).toEqual('function');
			expect(typeof ErrorService.turnOff).toEqual('function');
			expect(typeof ErrorService.setMessage).toEqual('function');
		});

		it('set the errors variable with the object passed in', function() {
			expect(ErrorService.errors).toEqual(myErrors);
		});

		it('set errorCount to 0', function() {
			expect(ErrorService.errorCount).toBe(0);
		});

		describe('turnOn function', function() {
			describe('if the error key exists and show is false', function() {
				beforeEach(function() {
					ErrorService.errors['error'].show = false;
					ErrorService.errorCount = 0;
					ErrorService.turnOn('error');
				});
				it('sets the show variable to true', function() {
					expect(ErrorService.errors['error'].show).toBe(true);
				});
				it('increments the errorCount', function() {
					expect(ErrorService.errorCount).toBe(1);
				});
			});

			it('otherwise, it does nothing', function() {
				ErrorService.errorCount = 0;
				ErrorService.turnOn('foo');
				expect(ErrorService.errorCount).toBe(0);
			});
		});

		describe('turnOff function', function() {
			describe('if the error key exists and show is true', function() {
				beforeEach(function() {
					ErrorService.errors['error'].show = true;
					ErrorService.errorCount = 1;
					ErrorService.turnOff('error');
				});
				it('sets the show variable to false', function() {
					expect(ErrorService.errors['error'].show).toBe(false);
				});
				it('decrements the errorCount', function() {
					expect(ErrorService.errorCount).toBe(0);
				});
			});

			it('otherwise, it does nothing', function() {
				ErrorService.errorCount = 1;
				ErrorService.turnOn('foo');
				expect(ErrorService.errorCount).toBe(1);
			});
		});

		describe('setMessage', function() {
			it('sets a new message to an existing errorKey', function() {
				expect(ErrorService.errors['error'].message).toBe('This is an error.');
				ErrorService.setMessage('error', 'new error message');
				expect(ErrorService.errors['error'].message).toBe('new error message');
			});
		});
	});
});
