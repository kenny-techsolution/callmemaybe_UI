angular.module('cip.outOfHome').controller('exportCSVCtrl', ['$scope', 'csvFile',
function($scope, csvFile) {
	'use strict';

	$scope.csvFile = csvFile;

	$scope.downloadCSV = function() {
		$scope.csvFile.createCSVArray()
		.success(function() {
			$scope.createCSV();
		})
		.error(function(data, status) {
			//handle error?
		});
	};

	$scope.createCSV = function() {
		var d = new Date().toISOString();
		var timestamp = d.substring(0, d.indexOf('.'));

		var filename = 'OOH_proposal_billboards-' + timestamp.replace(/[-:]/g, '') + '.csv';
		var csvFile = $scope.csvFile.prepareCSV($scope.csvFile.csvData);

		var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
		if (navigator.msSaveBlob) { // IE 10+
			navigator.msSaveBlob(blob, filename);
		} else {
			var link = document.createElement('a');
			if (link.download !== undefined) {
				// Browsers that support HTML5 download attribute
				var url = URL.createObjectURL(blob);
				link.setAttribute('href', url);
				link.setAttribute('download', filename);
				link.style = 'visibility:hidden';
				document.body.appendChild(link);
				setTimeout(function() {
					link.click();
				}, 0);
				document.body.removeChild(link);
			}
		}
	};
}]);