angular.module('cip.outOfHome')
.constant('csvHeaders', [
	null, // empty column
	'Billboard #',
	'YM Market',
	'Market',
	'Product Name',
	'Panel ID',
	'Panel Description',
	'Panel Direction',
	'Panel Side',
	'Street 1',
	'Street 2',
	'County',
	'City',
	'State',
	'Zip',
	'Latitude',
	'Longitude',
	'Illuminated',
	'Hours Illum',
	'Height',
	'Width',
	'TAB Code',
	'CBSA Name',
	'DMA Name',
	'Cost of Billboard',
	'Gross Impressions',
	'Gross CPM',
]).constant('csvPrimaryHeaders', [
	'Primary Target Impressions',
	'Primary CPM',
]).constant('csvSecondaryHeaders', [
	'Secondary Target Impressions',
	'Secondary CPM'
]).constant('demographicHeaders', [
	'AllAdults All',
	'AllAdults 18-23',
	'AllAdults 24-29',
	'AllAdults 30-39',
	'AllAdults 40-49',
	'AllAdults 50-59',
	'AllAdults 60-69',
	'AllAdults 70+',
	'Household Income 0-19,999',
	'Household Income 20,000-39,999',
	'Household Income 40,000-74,999',
	'Household Income 75,000-124,999',
	'Household Income 125,000+',
	'Household Income All',
	'AllAdults Females',
	'Females 18-23',
	'Females 24-29',
	'Females 30-39',
	'Females 40-49',
	'Females 50-59',
	'Females 60-69',
	'Females 70+',
	'Females Caucasian',
	'Females Hispanic',
	'Females African-American',
	'Females East Asian',
	'Females South Asian',
	'Females Other Ethnicity',
	'AllAdults Males',
	'Males 18-23',
	'Males 24-29',
	'Males 30-39',
	'Males 40-49',
	'Males 50-59',
	'Males 60-69',
	'Males 70+',
	'Males Caucasian',
	'Males Hispanic',
	'Males African-American',
	'Males East Asian',
	'Males South Asian',
	'Males Other Ethnicity'
]).service('csvFile', ['$http', 'envDomainHandler', 'campaignSelection', 'csvHeaders', 'csvPrimaryHeaders', 'csvSecondaryHeaders', 'demographicHeaders', 
	function($http, envDomainHandler, campaignSelection, csvHeaders, csvPrimaryHeaders, csvSecondaryHeaders, demographicHeaders){
	'use strict';

	this.campaignSelection = campaignSelection;
	this.csvData = [];

	this.createCSVArray = function() {
		var _this = this;
		var baseUrl = envDomainHandler.getServiceDomain();
		// make the call to get demographic data right away. Then in the success function
		// create the csv file with the demographic data returned in the response
		return $http.post(baseUrl + '/cip-services/ooh/demographic-counts/', this.getInputData())
		.success(function(demographicResponse, status) {
			var csvArray = [];

			var grossProjection = _this.campaignSelection.campaignResponseData.grossProjection;
			var primaryProjection = _this.campaignSelection.campaignResponseData.primaryProjection;
			var secondaryProjection = _this.campaignSelection.campaignResponseData.secondaryProjection;

			// add the headers
			csvArray.push(_this.getHeaders());

			// add the data row for each billboard
			csvArray = _this.getBillboardRows(csvArray, demographicResponse);

			var campaignTotalRow = _this.getCampaignTotalRow(csvArray, demographicResponse);

			// add an empty row before adding the Campaign Total row
			csvArray.push([]);
			csvArray.push(campaignTotalRow);

			_this.csvData = csvArray;
		})
		.error(function(response, status) {
			//handle error case
		});
	};

	this.getHeaders = function() {
		var primaryProjection = this.campaignSelection.campaignResponseData.primaryProjection;
		var secondaryProjection = this.campaignSelection.campaignResponseData.secondaryProjection;
		var headers = csvHeaders;

		// add the primary and secondary headers if their projections exist
		if (primaryProjection.length > 0) {
			headers = headers.concat(csvPrimaryHeaders);
		}
		if (secondaryProjection.length > 0) {
			headers = headers.concat(csvSecondaryHeaders);
		}

		return headers.concat(demographicHeaders);
	};

	this.getInputData = function() {
		var grossProjection = this.campaignSelection.campaignResponseData.grossProjection;
		var inputData = [];

		for (var i = 0; i < grossProjection.length; i ++) {
			var billboard = grossProjection[i].billboard;
			inputData.push({'fenceId': billboard.key[0], 'timeCellId': '201404m'});
		}

		return inputData;
	};

	this.getBillboardRows = function(csvArray, demographicData) {
		var grossProjection = this.campaignSelection.campaignResponseData.grossProjection;
		var primaryProjection = this.campaignSelection.campaignResponseData.primaryProjection;
		var secondaryProjection = this.campaignSelection.campaignResponseData.secondaryProjection;

		for (var i = 0; i < grossProjection.length; i ++) {
			var billboard = grossProjection[i].billboard;
			var billboardArray = [
				null, // empty column
				billboard.key[0],
				billboard.ymMarket,
				billboard.market,
				billboard.productName,
				billboard.panelId,
				billboard.panelDescription,
				billboard.panelDirection,
				billboard.panelSide,
				billboard.street1,
				billboard.street2,
				billboard.county,
				billboard.city,
				billboard.state,
				billboard.zip,
				billboard.latitude,
				billboard.longitude,
				billboard.illuminated,
				billboard.hoursIllum,
				billboard.height,
				billboard.width,
				billboard.tabCode,
				billboard.cbsa,
				billboard.dma,
				billboard.cost,
				grossProjection[i].targetImp,
				grossProjection[i].cpm
			];


			if (primaryProjection.length > 0) {
				billboardArray = billboardArray.concat([
					primaryProjection[i].targetImp,
					primaryProjection[i].cpm,
				]);
			}

			if (secondaryProjection.length > 0) {
				billboardArray = billboardArray.concat([
					secondaryProjection[i].targetImp,
					secondaryProjection[i].cpm
				]);
			}

			// add demographic data to csv
			var demo = demographicData[i];
			var demoCells = []
			for(var j = 0; j < demographicHeaders.length; j++) {
				if (demo[demographicHeaders[j]]) {
					demoCells.push(demo[demographicHeaders[j]][0]);
				} else {
					demoCells.push('');
				}
			}
			billboardArray = billboardArray.concat(demoCells);

			csvArray.push(billboardArray);
		}

		return csvArray;
	};

	this.prepareCSV = function(rows) {
		var processRow = function (row) {
			var finalVal = '';
			for (var j = 0; j < row.length; j++) {
				var innerValue = row[j] === null ? '' : row[j].toString();
				var result = innerValue.replace(/"/g, '""');
				if (result.search(/("|,|\n)/g) >= 0) {
					result = '"' + result + '"';
				}
				if (j > 0) {
					finalVal += ',';
				}
				finalVal += result;
			}
			return finalVal + '\n';
		};

		var csvFile = '';
		for (var i = 0; i < rows.length; i++) {
			csvFile += processRow(rows[i]);
		}
		return csvFile;
	};

	this.getCampaignTotalRow = function(csvArray) {
		var campaignTotal = ['Campaign Total'];

		// traverse the columns
		for (var i = 0; i < csvArray[0].length-1; i ++) {
			if (i < 23) {
				// there are 23 columns before the first campaign total value
				campaignTotal.push(null);
			} else {
				// get the sum of this column
				var sum = 0;
				for (var j = 1; j < csvArray.length; j ++) {
					var val = csvArray[j][i+1];
					if (val !== '') {
						sum += csvArray[j][i+1];
					}				}

				campaignTotal.push(sum);
			}
		}

		// update the total cpm values to use a different equation
		var cpmColumns = ['Gross CPM', 'Primary CPM', 'Secondary CPM'];
		var costIdx = csvArray[0].indexOf('Cost of Billboard');
		for (var i = 0; i < cpmColumns.length; i ++) {
			var cpmIdx = csvArray[0].indexOf(cpmColumns[i]);
			// the total impressions value precedes the cpm column
			var totalCPM = (1000 * campaignTotal[costIdx]) / campaignTotal[cpmIdx-1] || 0;
			campaignTotal[cpmIdx] = Number(totalCPM.toFixed(2));
		}

		return campaignTotal;
	};
}]);