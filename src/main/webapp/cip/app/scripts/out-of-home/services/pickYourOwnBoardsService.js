angular.module('cip.outOfHome')
.service('defaultStandaloneDateForm', ['campaignDateService',
function(campaignDateService) {
	'use strict';
	var defaults = {
		campaignLengthOptions : campaignDateService.createDropDownValues(4, 53, 4),
		numWeeks : '4',
		startDate : campaignDateService.getNextMondayFromToday(),
		endDate : campaignDateService.getEndDate(campaignDateService.getNextMondayFromToday(), 4),
		default4weeks : true
	};
	return defaults;
}])
.service('pickYourOwnBoards', ['$http', '$filter', 'ENV', 'defaultStandaloneDateForm', 'campaignSelection', 'envDomainHandler', 'popupModalService', 'campaignDetailErrorService',
function($http, $filter, ENV, defaultStandaloneDateForm, campaignSelection, envDomainHandler, popupModalService, campaignDetailErrorService) {
	'use strict';

	var _this = this;
	var baseUrl = envDomainHandler.getServiceDomain();
	this.errorService = campaignDetailErrorService;
	this.dateForm = angular.copy(defaultStandaloneDateForm);
	this.editDatesForm = angular.copy(defaultStandaloneDateForm);
	this.boards = '';
	this.boardsArray = [];
	this.hasBeenAdded = false;
	this.questionMarkHovered = false;
	this.pickYourOwnBoards = false;
	this.isEditDates = false;
	this.sectionTitle = 'Campaign Details';

	this.setPickYourOwnBoards = function(v) {
		this.pickYourOwnBoards = v;
	};

	this.addBoards = function() {
		var getBoardsArray = function() {
			var commaSplit = _this.boards.split(',');
			var cleanedList = [];
			for (var i = 0; i < commaSplit.length; i ++) {
				if (commaSplit[i].length !== 0) {
					cleanedList.push(commaSplit[i].trim());
				}
			}
			return cleanedList;
		};

		this.boardsArray.push.apply(this.boardsArray, getBoardsArray());

		var data = {
			campaignParam: {
				length: this.dateForm.numWeeks,
				startDate: $filter('date')(this.dateForm.startDate, 'yyyy-MM-dd')
			},
			billboard: this.boardsArray
		};

		//remove existing charts
		chartWindow.removeAllItemsFromCanvas();

		return $http.post(baseUrl + '/cip-services/ooh/add-billboards/', data)
		.success(function(response, status) {
			campaignSelection.campaignResponseData = response;
			if(_this.boardsArray.length > _this.getBoardsFromResult().length) {
				popupModalService.showPopup('invalidBillboardAdded');
			}
			_this.removeInvalidBillboards();
		})
		.error(function(response, status) {
			campaignSelection.campaignResponseData = {
				grossProjection: [],
				primaryProjection: [],
				secondaryProjection: []
			};
			_this.errorService.turnOn('serverError');
		});
	};

	this.getBoardsFromResult = function (){
		var poisArray = [];
		if(campaignSelection.campaignResponseData){
			var grossProjectionArray = campaignSelection.campaignResponseData.grossProjection;
			for(var i=0; i<grossProjectionArray.length;i++) {
				poisArray.push({'fenceId': grossProjectionArray[i].billboard.key[0], 'timeCellId': '201404m'});
			}
		}
		return poisArray;
	};

	this.showEditDates = function() {
		this.editDatesForm = angular.copy(this.dateForm);
		this.isEditDates = true;
		this.sectionTitle = 'Edit Campaign Dates';
	};

	this.hideEditDates = function() {
		this.isEditDates = false;
		this.sectionTitle = 'Campaign Details';
	};

	this.submitDates = function() {
		this.dateForm = angular.copy(this.editDatesForm);
		this.hideEditDates();
	};

	this.isDigitalBoardsOnly = function() {
		var numWeeks = this.editDatesForm.numWeeks;
		var options = this.editDatesForm.campaignLengthOptions;
		return options.indexOf(Number(numWeeks)) === -1;
	};

	this.removeInvalidBillboards = function() {
		var validBoards = this.getBoardsFromResult();
		var validBoardsArray = [];
		for (var i = 0; i < validBoards.length; i ++) {
			validBoardsArray.push(validBoards[i].fenceId);
		}
		this.boardsArray = validBoardsArray;
	};
}]);