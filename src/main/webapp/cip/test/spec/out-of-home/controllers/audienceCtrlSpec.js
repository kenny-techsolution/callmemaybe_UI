describe('audienceCtrl', function() {
	'use strict';

	var audienceCtrl;
	var scope;
	var testAudienceForm;
	ignoreSvgGets();
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		audienceCtrl = $controller('audienceCtrl', {$scope: scope});
		testAudienceForm = {
			'form' : {
				'gender': '3','age': '8','income': '6','household': '3','ageOfChild': '7','ethnicity': '7'
			}
		};
	}));

	it('defines certain campaignSelection fields within the $scope', function() {
		expect(scope.audiences).toBeDefined();
		expect(scope.defaultForm).toBeDefined();
		expect(scope.lookup).toBeDefined();
		expect(scope.demographicChanged).toBeDefined();
		expect(scope.isWithChildren).toBeDefined();
		expect(scope.audienceParameters).toBeDefined();
		expect(scope.frequencies).toBeDefined();
		expect(scope.ranking).toBeDefined();
	});

	it('has an onChangeFrequency function that updates the targetFreq based on user selection', function() {
		expect(scope.audienceParameters['targetFreq'].value).toEqual('');
		scope.onChangeFrequency('≥5');
		expect(scope.audienceParameters['targetFreq'].value).toEqual('≥5');
		scope.onChangeFrequency('--');
		expect(scope.audienceParameters['targetFreq'].value).toEqual('');
	});

	it('has an audienceChanged function that returns true if any audience values has changed', function() {
		expect(scope.audienceChanged(testAudienceForm)).toBe(false);
		testAudienceForm.form.gender = 'foo';
		expect(scope.audienceChanged(testAudienceForm)).toBe(true);
	});

	it('has a reset function that resets the audience form', function() {
		scope.audiences.primary.form.age = 'foo';
		scope.reset();
		expect(scope.audiences.primary.form.age).toBe('8');
		expect(scope.audiences.primary.form).toEqual(testAudienceForm.form);
	});

	it('has a copyPrimary function that copies the primary form into the secondary form', function() {
		scope.audiences.primary.form.income = 'blah';
		expect(scope.audiences.secondary.form.income).toEqual('6');
		scope.copyPrimary();
		expect(scope.audiences.secondary.form.income).toEqual('blah');
	});

	it("has a resetRank function that updates parameter's rank based on the ranking array", function() {
		var getRanks = function() {
			return $.map(scope.audienceParameters, function(val, i) {
				return val.rank;
			});
		};
		expect(getRanks()).toEqual(['1st', '2nd', '3rd']);
		scope.ranking = ['targetReach', 'targetImpr', 'targetFreq'];
		scope.resetRank();
		expect(getRanks()).toEqual(['2nd', '1st', '3rd']);
	});

	describe('$watch for audienceParameters changes', function() {
		beforeEach(function(){
			spyOn(scope, 'onSortUpdate').andCallThrough();
			spyOn(scope, 'resetRank');
			scope.$apply();
			scope.audienceParameters['targetImpr'].value = '444';
			scope.$apply();
		});

		it('calls onSortUpdate function', function() {
			expect(scope.onSortUpdate).toHaveBeenCalled();
		});

		it('calls resetRank function', function() {
			expect(scope.resetRank).toHaveBeenCalled();
		});
	});
});