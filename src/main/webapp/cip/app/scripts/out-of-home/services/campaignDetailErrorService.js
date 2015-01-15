angular.module('cip.outOfHome').factory('campaignDetailErrorService', ['CustomErrorServiceProvider',
function(CustomErrorServiceProvider) {
	'use strict';
	var errorsObj = {
		'emptyStartDate' : {
			show : false,
			message : 'Please select a campaign start date.'
		},
		'incorrectStartDateRange' : {
			show : false,
			message : 'Please select a campaign start date. Campaign cannot be planned for days in the past.'
		},
		'incorrectWeekLength' : {
			show : false,
			message : 'Please enter the length of this campaign, in weeks. Campaigns can run up to 52 weeks.'
		},
		'beyondBound' : {
			show : false,
			message : ''
		},
		'noBoardsSelected' : {
			show : false,
			message : 'Please select at least one board type'
		},
		'noDigitalBoardWithCustomWeeks' : {
			show : false,
			message : 'Static Bulletins require "standard 4 week campaign lengths." Either include Digital Bulletins or check "standard 4 week campaign lengths."'
		},
		'noResults' : {
			show : false,
			message : 'Your campaign did not return valid results, please review your campaign requirements.'
		},
		'serverError' : {
			show : false,
			message : 'The server encountered an internal error and was unable to complete your request.'
		}
	};
	return CustomErrorServiceProvider.getInstance(errorsObj);
}]);