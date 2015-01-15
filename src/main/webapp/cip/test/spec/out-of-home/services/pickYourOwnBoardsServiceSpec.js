describe('pickYourOwnBoardsService', function() {
	'use strict';

	var pickYourOwnBoardsService;
	var popupModalServiceMock = {};

	beforeEach(module('cip.outOfHome', function($provide) {
		$provide.value('popupModalService', popupModalServiceMock);
	}));

	beforeEach(inject(function(_pickYourOwnBoards_) {
		pickYourOwnBoardsService = _pickYourOwnBoards_;
	}));

	describe('addBoards', function() {
		beforeEach(inject(function($http) {
			spyOn($http, 'post').andCallFake(function() {
				return {
					success: function() {
						return {error: $.noop};
					}
				};
			});
			spyOn(chartWindow, 'removeAllItemsFromCanvas').andCallThrough();
			pickYourOwnBoardsService.boards = '1234';
			pickYourOwnBoardsService.dateForm.startDate = '2014-08-18';
			pickYourOwnBoardsService.addBoards();
		}));

		it('removes all chart items from the window', function() {
			expect(chartWindow.removeAllItemsFromCanvas).toHaveBeenCalled();
		});

		it('does a POST', inject(function($http) {
			expect($http.post).toHaveBeenCalled();
		}));

		it('has the right arguments', inject(function($http) {
			var args = $http.post.argsForCall[0];
			var expectedData = { campaignParam : { length : '4', startDate : '2014-08-18' }, billboard : [ '1234' ] };
			expect(args[0].indexOf('cip-services/ooh/add-billboards')).toBeGreaterThan(-1);
			expect(args[1]).toEqual(expectedData);
		}));
	});
});