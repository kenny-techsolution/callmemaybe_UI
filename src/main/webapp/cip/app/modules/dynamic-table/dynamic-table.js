'use strict';

/**

@param {classes=} the class names for the inside table element. If you are using '-' in your classes name make sure you add single quotes
@param {tableContent=} the table data object 
@param {filter=} pass ng-model to filter data with
@param {showTableHeader=} show / hide table header
@param {showTableFooter=} show / hide table footer
@param {orderTableRowBy=} used for ordering table data rows
@param {selectableTableRows=} option to have a checkbox in the first td/th of each table row
@param {onClickTableRow=} the function you want called when the user clicks on the table row
@param {itemsPerPage=} number of data rows you want to show per page
@param {currentPage=} current page to show
@param {totalRowCount=} read only, returns total table rows


The parameter passed through the on-click-table-row attribute needs to always be 'clickedRow'

<dynamic-table
	classes="'my-class'"
	filter-by="model"
	table-content="tableData"
	show-table-header="true"
	show-table-footer="true"
	order-table-row-by="orderTableBy"
	selectable-table-rows="true"
	on-click-table-row="myFunction(clickedRow)"

	Attribute that tie directly to pagination modules, like angularjs bootstrap
	items-per-page="15"
	current-page="currentPage"
	total-row-count="totalRows"></dynamic-table>

The headers and footers arrays are optional.

If you set the show-table-header boolean to true, but don't supply the headers array
the module will use the keys of the tbody array to create the headers.

These array names need to be the same for this directive to work correctly.

.orders
.headers
.footers
.tbody

The keys in the 'order' and 'headers' arrays need to match the keys in the 'tbody' array

$scope.tableData = {};
$scope.tableData.order = ['id', 'firstName', 'lastName', 'email', 'status', 'createdOn'];
$scope.tableData.headers = {
	'id' : 'id',
	'firstName' : 'first name',
	'lastName' : 'last name',
	'email' : 'email',
	'status' : 'status',
	'createdOn' : 'create on'
};
$scope.tableData.footers = ['footer td', 'another td', '', '', '', ''];
$scope.tableData.tbody = [
	{
		'id' : '123',
		'firstName' : 'John',
		'lastName' : 'Doe',
		'email' : 'gmail@gmail.com',
		'status' : 'ACTIVE',
		'createdOn' : '01/01/2014'
	},
	{
		'id' : '456',
		'firstName' : 'Michael',
		'lastName' : 'De Leon',
		'email' : 'gmail@gmail.com',
		'status' : 'ACTIVE',
		'createdOn' : '01/01/2014'
	}
];
*/



angular.module('ui.att.dynamicTable', [])

.controller('DynamicTableController', ['$scope', '$attrs', '$parse',
 function ($scope, $attrs, $parse) {

	var setTableRowCount = $attrs.totalRowCount ? $parse($attrs.totalRowCount).assign : angular.noop;

	$scope.$watch('totalRows', function(value) {
		setTableRowCount($scope.$parent, value); // Readonly variable
	});
}])


.directive('dynamicTable', ['$filter', function ($filter) {
	return {
		scope: {
			filterBy: '=?',
			showTableHeader: '=?',
			showTableFooter: '=?',
			selectableTableRows: '=?',
			orderTableRowBy: '=?',
			itemsPerPage : '=?',
			currentPage: '=?',
			tableContent: '=',
			onClickTableRow: '&',
			sorting: '=?',
			classes: '=?'
		},
		restrict:'EA',
		controller:'DynamicTableController',
		replace: false,
		templateUrl: 'modules/templates/dynamic-table/dynamic-table.html',
		link: function(scope, element, attrs, dynamicTableController) {

			var startAt = 0;

			scope.orderReverse = false;
			scope.totalRows = scope.tableContent.tbody.length;
			scope.tableId = '';
			scope.allSelected = false;
			scope.itemsPerPage = scope.itemsPerPage || scope.totalRows;
			scope.trDataWatch = {};

			if(scope.currentPage){
				//angularjs bootstrap pagination page starts a 1 not 0
				startAt = scope.currentPage - 1;

				scope.$watch('currentPage', function() {
					startAt = scope.currentPage - 1;

					filterTableRows();
				});
			}

			scope.$watch('filterBy', function() {
				filterTableRows();
			}, true);

			scope.$watch('tableContent.tbody', function() {
				if(scope.showTableHeader && !scope.tableContent.headers){
					createHeadersArray();
				}

				filterTableRows();
			}, true);

			if(scope.showTableHeader && !scope.tableContent.headers){
				createHeadersArray();
			}

			if(scope.selectableTableRows){
				scope.tableId = createDynamicId();
			}

			scope.updateOrderBy = function(orderBy, $event){
				if(scope.sorting){
					scope.orderReverse = scope.orderTableRowBy === orderBy ? !scope.orderReverse : false;
					scope.orderTableRowBy = orderBy;
					
					$('th', $($event.currentTarget).parent()).removeClass('asc , desc');

					scope.orderReverse ? $($event.currentTarget).addClass('asc') : $($event.currentTarget).addClass('desc');

					filterTableRows();
				}
			}

			scope.selectRow = function(trData){
				trData.selected = !trData.selected;
			}

			scope.selectAllRows = function(){
				var isSelected = !scope.allSelected;

				scope.allSelected = isSelected;

				for(var i=0; i < scope.tableContent.tbody.length; i++){
					scope.tableContent.tbody[i].selected = isSelected;
				}
			}

			function createHeadersArray(){
				if(scope.tableContent.tbody[0] !== undefined){
					scope.tableContent.headers = {};

					for(var key in scope.tableContent.tbody[0]){
						scope.tableContent.headers[key] = key;
					}
				}
			}

			function createDynamicId(){
				return Math.floor(Math.random() * (10000 - 1)) + 1;
			}

			function filterTableRows(){
				scope.trDataWatch = $filter('filter')(scope.tableContent.tbody, scope.filterBy);
				scope.trDataWatch = $filter('orderBy')(scope.trDataWatch, scope.orderTableRowBy, scope.orderReverse);

				scope.totalRows = scope.trDataWatch.length;

				scope.trDataWatch = $filter('startFrom')(scope.trDataWatch, startAt * scope.itemsPerPage);
				scope.trDataWatch = $filter('limitTo')(scope.trDataWatch, scope.itemsPerPage);
			}
		}
	};
}]);