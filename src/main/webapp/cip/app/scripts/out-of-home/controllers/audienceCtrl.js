angular.module('cip.outOfHome').controller('audienceCtrl', ['$scope', 'campaignSelection', 'defaultAudienceForm', 'campaignLookups', function($scope, campaignSelection, defaultAudienceForm, campaignLookups) {
	'use strict';
	$scope.audiences = campaignSelection.audiences;
	$scope.defaultForm = defaultAudienceForm;
	$scope.lookup =  campaignLookups;
	$scope.demographicChanged = campaignSelection.demographicChanged;
	$scope.isWithChildren = campaignSelection.isWithChildren;
	$scope.audienceParameters = campaignSelection.audienceParameters;
	$scope.frequencies = ['--', '≥1', '≥2', '≥3', '≥4', '≥5', '≥6', '≥7', '≥8', '≥9', '≥10'];
	$scope.ranking = campaignSelection.getAudienceRankingArray();

	$scope.onChangeFrequency = function(newFreq) {
		if (newFreq === '--') {
			$scope.audienceParameters['targetFreq'].value = '';
		} else {
			$scope.audienceParameters['targetFreq'].value = newFreq;
		}
	};

	$scope.onSortUpdate = function(event, ui) {
		var parent = $(event.target);
		var detached = [];
		// move active fields to the top
		$(parent).find('li.sortable-item').each(function(i, e) {
			if ($(e).find('.rank').hasClass('active')) {
				detached.push($(e).detach());
			}
		});
		$(parent).prepend(detached);
	};

	$scope.audienceChanged = function (audience) {
		return !angular.equals(audience.form, $scope.defaultForm);
	};

	$scope.isAudienceParametersActive = function() {
		var isActive = false;
		$.each($scope.audienceParameters, function(key, val) {
			if(val.value !== '' && !isActive) {
				isActive = true;
			}
		});
		return isActive;
	};

	$scope.reset = function () {
		$scope.audiences.primary.form = angular.copy($scope.defaultForm);
	};

	$scope.copyPrimary = function () {
		$scope.audiences.secondary.form = angular.copy($scope.audiences.primary.form);
	};

	$scope.$watch(function($scope) {
		return $.map($scope.audienceParameters, function(val, key) {
			return {key: key, val: val.value};
		});
	}, function (newValue, oldValue) {
		// trigger sortable update when input values change
		var whichStateChanged = function() {
			for (var i = 0; i < newValue.length; i ++) {
				if (newValue[i].val === '' && oldValue[i].val !== '') {
					return [newValue[i].key, ''];
				} else if (newValue[i].val !== '' && oldValue[i].val === '') {
					return [newValue[i].key, 'active'];
				}
			}
			return null;
		};
		var manuallyUpdateRanking = function() {
			var newRanking = [];
			$('#sortable .sortable-item').each(function(i, e) {
				for(var i = 0; i < $scope.ranking.length; i ++) {
					if ($(e).hasClass($scope.ranking[i])) {
						newRanking.push($scope.ranking[i]);
					}
				}
			});
			$scope.ranking = newRanking;
			$scope.resetRank();
		};

		var changed = whichStateChanged();
		if (changed !== null) {
			var $changedField = $('#sortable li.' + changed[0]);
			if (changed[1] === 'active') {
				$changedField.find('.rank').addClass('active');
			} else {
				$changedField.find('.rank').removeClass('active');
			}
			$scope.onSortUpdate({target: $('#sortable')});
			manuallyUpdateRanking();
			setTimeout(function() {
				$changedField.find('input').focus();
			}, 0);
		}
	}, true);

	$scope.$on('list-sorted',function(ev,val){
		$scope.ranking.splice(val.to, 0, $scope.ranking.splice(val.from, 1)[0]);
		$scope.resetRank();
	});

	$scope.resetRank = function() {
		$scope.audienceParameters[$scope.ranking[0]].rank = '1st';
		$scope.audienceParameters[$scope.ranking[1]].rank = '2nd';
		$scope.audienceParameters[$scope.ranking[2]].rank = '3rd';
	};
}]);