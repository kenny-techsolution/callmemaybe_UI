describe('pickYourOwnBoardsCtrl', function() {
	'use strict';

	var pickYourOwnBoardsCtrl;
	var scope = {};
	var pickYourOwnBoardsMock = {
		boards: "this is a test",
		addBoards: function() {return {success: function(){return {error: $.noop}}}}
	};

	beforeEach(inject(function($controller) {
		pickYourOwnBoardsCtrl = $controller('pickYourOwnBoardsCtrl', {$scope: scope, pickYourOwnBoards: pickYourOwnBoardsMock});
	}));

	describe('addBoards', function() {
		it('calls the addBoards service function', function() {
			spyOn(pickYourOwnBoardsMock, 'addBoards').andCallThrough();
			scope.addBoards();
			expect(pickYourOwnBoardsMock.addBoards).toHaveBeenCalled();
		});
	});

	describe('makeTextAreaExpandable', function() {
		var oldHeight;

		beforeEach(function() {
			$('body').append('<div id="makeTextAreaExpandableTest"><textarea id="myText" style="height: 10px; width: 20px"/></div>');
			oldHeight = $('#myText').height();
			scope.makeTextAreaExpandable('myText');
		});

		// todo: can't seem to trigger keyup in tests. X'd this test out for now
		xit('on keyup, it updates the height to be the scrollHeight', function() {
			$('#myText').val("this is some long sentence to test expanding textarea");
			$('#myText').trigger('keyup');
			expect($('#myText').height()).not.toEqual(oldHeight);
		});
	});

	describe('hoverOnQuestionMark', function() {
		var oldPosition;
		beforeEach(function() {
			$('body').append('<div id="hoverOnQuestionMarkTest"><div id="boards-list" style="top:40"/><div class="pick-your-own-boards-popup"/></div>');
			oldPosition = $('.pick-your-own-boards-popup').css('top');
			scope.hoverOnQuestionMark(true);
		});
		afterEach(function() {
			$('#hoverOnQuestionMarkTest').remove();
		});
		it('updates the position of the popup', function() {
			expect($('.pick-your-own-boards-popup').css('top')).not.toEqual(oldPosition);
		});
		it('sets the questionMarkHovered variable', function() {
			expect(pickYourOwnBoardsMock.questionMarkHovered).toBe(true);
		});
	});

	describe('commaSeparated', function() {
		it('replaces spaces with a comma', function() {
			expect(pickYourOwnBoardsMock.boards).toEqual("this is a test");
			scope.commaSeparated();
			expect(pickYourOwnBoardsMock.boards).toEqual("this,is,a,test");
		});
	});
});