angular.module('cip').controller('modalCtrl', function($scope, $modalInstance, items, currentPopup,selectedCallback, callbacks) {
	$scope.items = items;
	$scope.callbacks = callbacks;
	$scope.selectedCallback = selectedCallback;
	$scope.currentPopup = currentPopup;
	$scope.selected = {
		item : $scope.items[0]
	};
	$scope.callback = {
		name:"",
		phone:"",
		description: "Please write description."
	};
	$scope.ok = function() {
		var callback = {
			name: $scope.callback.name,
			phone: $scope.callback.phone,
			status: "pending",
			description: $scope.callback.description,
			time: $scope.dt,
			timeleft: 13539
		};
		console.log("callback");
		console.log(callback);
		$scope.callbacks.unshift(callback);
		$modalInstance.close($scope.selected.item);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	//time picker related
	$scope.mytime = new Date();
	$scope.hstep = 1;
	$scope.mstep = 15;
	$scope.ismeridian = true;
	$scope.timeChanged = function() {
		$log.log('Time changed to: ' + $scope.mytime);
	};

	//date picker related
	$scope.today = function() {
		$scope.dt = new Date();
	};
	$scope.today();

	$scope.clear = function() {
		$scope.dt = null;
	};

	// Disable weekend selection
	$scope.disabled = function(date, mode) {
		return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6 ) );
	};

	$scope.toggleMin = function() {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();

	$scope.openDatePicker = function($event) {
		console.log("teatsetasjt;askl");
		$event.preventDefault();
		$event.stopPropagation();

		$scope.datepickerOpened = true;
	};

	$scope.dateOptions = {
		formatYear : 'yy',
		startingDay : 1
	};

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];

});