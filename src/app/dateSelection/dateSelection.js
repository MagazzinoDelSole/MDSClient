angular.module('mds.dataSelection', ['ui.bootstrap', 'cgBusy', 'mds.data', 'mds.dataRetriver'])

.controller('DateCtrl', ['$scope', 'mdsData', 'mdsDataRetriver', function($scope, mdsData, mdsDataRetriver) {
	
	// This object contains the data selected and the status of
	// the popup (open or close)
	$scope.date = {
		popupState: false,
		selected: new Date()
	};

	// Option for the picker
	$scope.dateOptions = {
		showWeeks: false
	};

	// This function is called when the button next to the date input is clicked
	// and toggle the ui.bootstrap date picker
	$scope.open = function($event) {
		$scope.date.popupState = true;
	};

	// This function is called when the 'carica' button is pressed
	$scope.loadData = function (date) {
		
		// Use the mdsDataRetriver service to get the data
		// I save the promise and then call 'then' only to assign the promise
		// to the scope, so cgBusy can draw an loading spinner one the page
		var promise = mdsDataRetriver.retrive(date);
		$scope.promise = promise;
		promise.then(function (data) {
			// If the data is retrived, save in the 'mdsData' value
			mdsData.steps = data.length;
			mdsData.values = data;
		}, function () {
			// In this case something went wrong
			alert("La data selezionata non e' disponibile");
		});
	};

	$scope.isNotAvailable = function (date, mode) {
		date.setHours(0, 0, 0, 0);
		var availableDates = $scope.availableDates;
		for(var i in availableDates) {
			if(availableDates[i].getTime() == date.getTime()) {
				return false;
			}
		}
		return true;
	};


	mdsDataRetriver.getAvailableDates().then(function (dates) {
		$scope.availableDates = dates;
	}, function (error) {

	});

}]);