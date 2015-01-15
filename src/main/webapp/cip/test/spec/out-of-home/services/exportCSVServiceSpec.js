describe('exportCSVService', function() {
	'use strict';

	var csvFileService,
	csvHeaders,
	primaryHeaders,
	secondaryHeaders,
	demographicHeaders;

	var campaignSelectionMock = {
		campaignResponseData: {
			grossProjection: [
				{ 
					billboard: {
						key: [123],
						ymMarket: 'DFW',
						market: 'Yoohoo',
						productName: 'Bulletin',
						panelId: '6513',
						panelDescription: 'On Riverside Dr',
						street1: '101 Main St',
						street2: '',
						panelDirection: 'Facing West', 
						panelSide: 'South Side',
						county: 'Tarrant',
						city: 'Fort Worth',
						state: 'TX',
						zip: '76111',
						latitude: '32.3',
						longitude: '-97.4',
						illuminated: 'Yes',
						hoursIllum: '4',
						height: 14,
						width: 30,
						tabCode: '32103',
						cbsa: 'Dallas-Fort Worth, TX',
						dma: 'Dallas-Ft.Worth TX',
						cost: 900.99
					},
					targetImp: 20000,
					cpm: 1234
				},
				{
					billboard: {
						key: [456],
						ymMarket: 'DABC',
						market: 'Wowow',
						productName: 'Bulletin',
						panelId: '233',
						panelDescription: 'a panel',
						street1: '101 Spear St',
						street2: '',
						panelDirection: 'Facing East',
						panelSide: 'North Side',
						county: 'Tarrant',
						city: 'Fort Worth',
						state: 'TX',
						zip: '45688',
						latitude: '32.3',
						longitude: '-60',
						illuminated: 'Yes',
						hoursIllum: '8',
						height: 18,
						width: 30,
						tabCode: '32122',
						cbsa: 'Dallas-Fort Worth, TX',
						dma: 'Dallas-Ft.Worth TX',
						cost: 300.99
					},
					targetImp: 3400,
					cpm: 122
				}
			],
			primaryProjection: [],
			secondaryProjection: []
		}
	};

	var demographicResponseData = [
		{
			'fenceId':'123', 'timeCellId':'201404m',
			'AllAdults All' : [5431],
			'AllAdults 18-23' : [5421],
			'AllAdults 24-29' : [541],
			'AllAdults 30-39' : [4321],
			'AllAdults 40-49' : [321],
			'AllAdults 50-59' : [541],
			'AllAdults 60-69' : [5321],
			'AllAdults 70+' : [5431],
			'Household Income 0-19,999' : [541],
			'Household Income 20,000-39,999' : [543],
			'Household Income 40,000-74,999' : [5432],
			'Household Income 75,000-124,999' : [321],
			'Household Income 125,000+' : [521],
			'Household Income All' : [321],
			'AllAdults Females' : [5321],
			'Females 18-23' : [521],
			'Females 24-29' : [5421],
			'Females 30-39' : [321],
			'Females 40-49' : [521],
			'Females 50-59' : [541],
			'Females 60-69' : [541],
			'Females 70+' : [541],
			'Females Caucasian' : [543],
			'Females Hispanic' : [543],
			'Females African-American' : [521],
			'Females East Asian' : [543],
			'Females South Asian' : [543],
			'Females Other Ethnicity' : [543],
			'AllAdults Males' : [4321],
			'Males 18-23' : [321],
			'Males 24-29' : [541],
			'Males 30-39' : [543],
			'Males 40-49' : [521],
			'Males 50-59' : [321],
			'Males 60-69' : [321],
			'Males 70+' : [431],
			'Males Caucasian' : [432],
			'Males Hispanic' : [531],
			'Males African-American' : [521],
			'Males East Asian' : [542],
			'Males South Asian' : [431],
			'Males Other Ethnicity' : [432]
		},
		{
			'fenceId':'456', 'timeCellId':'201404m',
			'AllAdults All' : [531],
			'AllAdults 18-23' : [52],
			'AllAdults 24-29' : [54],
			'AllAdults 30-39' : [431],
			'AllAdults 40-49' : [31],
			'AllAdults 50-59' : [41],
			'AllAdults 60-69' : [521],
			'AllAdults 70+' : [541],
			'Household Income 0-19,999' : [51],
			'Household Income 20,000-39,999' : [43],
			'Household Income 40,000-74,999' : [532],
			'Household Income 75,000-124,999' : [21],
			'Household Income 125,000+' : [52],
			'Household Income All' : [31],
			'AllAdults Females' : [532],
			'Females 18-23' : [52],
			'Females 24-29' : [541],
			'Females 30-39' : [32],
			'Females 40-49' : [52],
			'Females 50-59' : [51],
			'Females 60-69' : [521],
			'Females 70+' : [54],
			'Females Caucasian' : [43],
			'Females Hispanic' : [53],
			'Females African-American' : [51],
			'Females East Asian' : [54],
			'Females South Asian' : [53],
			'Females Other Ethnicity' : [43],
			'AllAdults Males' : [42],
			'Males 18-23' : [32],
			'Males 24-29' : [51],
			'Males 30-39' : [43],
			'Males 40-49' : [21],
			'Males 50-59' : [31],
			'Males 60-69' : [21],
			'Males 70+' : [43],
			'Males Caucasian' : [432],
			'Males Hispanic' : [51],
			'Males African-American' : [52],
			'Males East Asian' : [54],
			'Males South Asian' : [43],
			'Males Other Ethnicity' : [46]
		}
	];

	var csvData = [[1,2,3],[4,5,6]];

	beforeEach(module('cip.outOfHome', function($provide) {
		$provide.value('campaignSelection', campaignSelectionMock);
	}));

	beforeEach(inject(function(_csvFile_, _csvHeaders_, _csvPrimaryHeaders_, _csvSecondaryHeaders_, _demographicHeaders_) {
		csvFileService = _csvFile_;
		csvHeaders = _csvHeaders_;
		primaryHeaders = _csvPrimaryHeaders_;
		secondaryHeaders = _csvSecondaryHeaders_;
		demographicHeaders = _demographicHeaders_;
	}));

	describe('prepareCSV function', function() {
		it('returns the formatted csv file content', function() {
			var csvFile = csvFileService.prepareCSV(csvData);
			var expectedCsv = '1,2,3\n4,5,6\n';
			expect(csvFile).toBe(expectedCsv);
		});

		it('handles punctuation characters correctly', function() {
			csvData.push(['Bob\'s', 'A/B', 'CA?']);
			var csvFile = csvFileService.prepareCSV(csvData);
			var expectedCsv = '1,2,3\n4,5,6\nBob\'s,A/B,CA?\n';
			expect(csvFile).toBe(expectedCsv);
		});
	});

	describe('getCampaignTotalRow function', function() {
		var campaignTotal;
		beforeEach(function() {
			var rows = [[null].concat(csvHeaders).concat(primaryHeaders).concat(secondaryHeaders),
				[null, 123, 'DFW', 'Yoohoo', 'Bulletin', '6513', 'On Riverside Dr',
				'Facing West', 'South Side', '101 Main St', '', 'Tarrant', 'Fort Worth', 'TX', '76111',
				'32.3', '-97.4', 'Yes', '4', 14, 30, '32103', 'Dallas-Fort Worth, TX',
				'Dallas-Ft.Worth TX', 900.99, 20000, 1234, 2400, 5456, 400, 2156],
				[null, 456, 'DABC', 'Wowow', 'Bulletin', '233', 'a panel', 'Facing East', 'North Side',
				'101 Spear St', '', 'Tarrant', 'Fort Worth', 'TX', '45688', '32.3', '-60',
				'Yes', '8', 18, 30, '32122', 'Dallas-Fort Worth, TX', 'Dallas-Ft.Worth TX',
				300.99, 3400, 122, 2100, 432, 3444, 7685]];
			campaignTotal = csvFileService.getCampaignTotalRow(rows);
		});

		it('returns a row that contains "Campaign Total" as the first value', function() {
			expect(campaignTotal[0]).toBe('Campaign Total');
		});

		it('sums up the gross, primary, and secondary target impr and cpm', function() {
			expect(campaignTotal[24]).toBe(1201.98);
			expect(campaignTotal[25]).toBe(23400);
			expect(campaignTotal[26]).toBe(1356);
			expect(campaignTotal[27]).toBe(17256.64);
			expect(campaignTotal[28]).toBe(5888);
			expect(campaignTotal[29]).toBe(3974.18);
			expect(campaignTotal[30]).toBe(9841);
			expect(campaignTotal[31]).toBe(2377.81);
		});
	});

	describe('createCSVArray function', function() {
		var csvArray;
		ignoreSvgGets();
		var campaignSelection = [];
		beforeEach(inject(function($httpBackend) {
			$httpBackend.whenPOST(envDomainHandlerMock.getServiceDomain() + '/cip-services/ooh/demographic-counts/').respond(demographicResponseData);
			csvArray = csvFileService.createCSVArray();
			$httpBackend.flush();
		}));

		it('should add the default headers and demographic headers to the first row', function() {
			expect(csvFileService.csvData[0]).toEqual([].concat(csvHeaders).concat(demographicHeaders));
		});

		it('should populate the billboard data', function() {
			expect(csvFileService.csvData[1]).toEqual([ null, 123, 'DFW', 'Yoohoo', 'Bulletin', '6513', 'On Riverside Dr', 'Facing West', 'South Side',
				'101 Main St', '', 'Tarrant', 'Fort Worth', 'TX', '76111', '32.3', '-97.4', 'Yes', '4', 14, 30, '32103', 'Dallas-Fort Worth, TX', 'Dallas-Ft.Worth TX',
				900.99, 20000, 1234, 5431, 5421, 541, 4321, 321, 541, 5321, 5431, 541, 543, 5432, 321, 521, 321, 5321, 521, 5421, 321, 521, 541, 541, 541, 543, 543, 521,
				543, 543, 543, 4321, 321, 541, 543, 521, 321, 321, 431, 432, 531, 521, 542, 431, 432 ]);
		});

		it('should add an empty row after the rows of billboard data before the Campaign Total row', function() {
			expect(csvFileService.csvData[3]).toEqual([]);
		});

		describe('when there are primary and secondary projection data', function() {
			beforeEach(inject(function($httpBackend) {
				campaignSelectionMock.campaignResponseData.primaryProjection = [
					{
						targetImp: 2400,
						cpm: 5456
					},
					{
						targetImp: 2100,
						cpm: 432
					}
				];
				campaignSelectionMock.campaignResponseData.secondaryProjection = [
					{
						targetImp: 400,
						cpm: 2156
					},
					{
						targetImp: 3444,
						cpm: 7685
					}
				];
				$httpBackend.whenPOST(envDomainHandlerMock.getServiceDomain() + '/cip-services/ooh/demographic-counts/').respond(demographicResponseData);
				csvArray = csvFileService.createCSVArray();
				$httpBackend.flush();
			}));

			it('should add the primary and secondary headers', function() {
				expect(csvFileService.csvData[0]).toEqual(csvHeaders.concat(primaryHeaders).concat(secondaryHeaders).concat(demographicHeaders));
			});

			it('should populate the primary and secondary data', function() {
				expect(csvFileService.csvData[1]).toEqual([ null, 123, 'DFW', 'Yoohoo', 'Bulletin', '6513', 'On Riverside Dr', 'Facing West', 'South Side',
					'101 Main St', '', 'Tarrant', 'Fort Worth', 'TX', '76111', '32.3', '-97.4', 'Yes', '4', 14, 30, '32103', 'Dallas-Fort Worth, TX',
					'Dallas-Ft.Worth TX', 900.99, 20000, 1234, 2400, 5456, 400, 2156, 5431, 5421, 541, 4321, 321, 541, 5321, 5431, 541, 543, 5432, 321,521, 321,
					5321, 521, 5421, 321, 521, 541, 541, 541, 543, 543, 521, 543, 543, 543, 4321, 321, 541, 543, 521, 321, 321, 431, 432, 531, 521, 542, 431, 432 ]);
			});

			it('should have a row called "Campaign Total" with the total gross, primary, and secondary projection data', function() {
				expect(csvFileService.csvData[4]).toEqual([ 'Campaign Total', null, null, null, null, null, null, null, null, null, null, null, null, null,
					null, null, null, null, null, null, null, null, null, null, 1201.98, 23400, 51.37, 4500, 267.11, 3844, 312.69, 5962, 5473, 595, 4752,
					352, 582, 5842, 5972, 592, 586, 5964, 342, 573, 352, 5853, 573, 5962, 353, 573, 592, 1062, 595, 586, 596, 572, 597, 596, 586, 4363,
					353, 592, 586, 542, 352, 342, 474, 864, 582, 573, 596, 474, 478 ]);
			});
		});
	});
});