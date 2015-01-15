angular.module('cip.outOfHome').controller('pickYourOwnBoardsCtrl', ['$compile', '$rootScope', '$scope', 'pickYourOwnBoards', 'campaignSelection',
function($compile, $rootScope, $scope, pickYourOwnBoards, campaignSelection) {
	'use strict';

	$scope.cipMap = campaignSelection.cipMap;

	$scope.pickYourOwn = pickYourOwnBoards;

	$scope.addBoards = function() {
		pickYourOwnBoards.addBoards()
		.success($scope.addBoardsResult)
		.error($scope.addBoardsResult);
	};

	$scope.addBoardsResult = function() {
		if ($('#divDefineCampaign').length !== 0 && $('#divDefineCampaign').parent().find('[campaign-results-panel]').length === 0) {
			$('#divDefineCampaign').parent().append($compile('<div campaign-results-panel></div>')($rootScope));
			$('#divDefineCampaign').remove();
		} else if ($('[campaign-results-panel]').length > 0) {
			var parent = $('[campaign-results-panel]').parent();
			$('[campaign-results-panel]').remove();
			parent.append($compile('<div campaign-results-panel></div>')($rootScope));
		}
		campaignResults = true;
		chartWindow.setMode('OOH');

		var poisArray = pickYourOwnBoards.getBoardsFromResult();
		CrossBIRTFilter.setDataFile({
			user : 'demo',
			context : 'OOH',
			locations : JSON.stringify(poisArray)
		});

		//show chart icons in the corner.
		$rootScope.globalStatus.campaignCreated = true;
		$rootScope.globalStatus.createdByStandalone = true;
		$rootScope.$broadcast('add-accordion-panels');

		pickYourOwnBoards.boards = '';
		pickYourOwnBoards.hasBeenAdded = true;
	};

	$scope.submitDates = function() {
		pickYourOwnBoards.submitDates();
		// if boards have already been added, make the addbillboard call
		// again if dates have been changed
		if (pickYourOwnBoards.boardsArray.length > 0) {
			$scope.addBoards();
		}
	};

	$scope.makeTextAreaExpandable =  function(id) {
		document.getElementById(id).addEventListener('keyup', function() {
			if (this.scrollHeight <= 110) {
				this.style.overflow = 'hidden';
				this.style.height = 0;
				this.style.height = this.scrollHeight + 'px';
			} else {
				this.style.overflow = 'auto';
			}
		}, false);
	};

	$scope.hoverOnQuestionMark = function(isHovered) {
		if(isHovered) {
			// adjust y position of info popup
			var newBoardsListPosition = $('#boards-list').position().top;
			$('.pick-your-own-boards-popup').css('top', newBoardsListPosition - 52);
		}
		pickYourOwnBoards.questionMarkHovered = isHovered;
	};

	$scope.commaSeparated = function() {
		pickYourOwnBoards.boards = pickYourOwnBoards.boards.replace(/\s|\s*,\s*/g, ',').replace(/,+/g, ',');
	};
}]);