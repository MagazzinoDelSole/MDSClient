angular.module('mds.dataSelection', ['ui.bootstrap', 'mds.data', 'mds.dataRetriver'])

.controller('DateCtrl', ['$scope', 'mdsData', 'mdsDataRetriver', function($scope, mdsData, mdsDataRetriver) {
	
	// This object contains the data selected and the status of
	// the popup (open or close)
	$scope.date = {
		popupState: false,
		selected: new Date()
	};

	// This function is called when the button next to the date input is clicked
	// and toggle the ui.bootstrap date picker
	$scope.open = function($event) {
		$scope.date.popupState = true;
	};

	// This function is called when the 'carica' button is pressed
	$scope.loadData = function(date) {
		
		// Use the mdsDataRetriver service to get the data
		mdsDataRetriver.retrive(date).then(function (data) {
			// If the data is retrived, save in the 'mdsData' value
			mdsData.steps = data.length;
			mdsData.values = data;
		}, function () {
			// In this case something went wrong
			alert("La data selezionata non e' disponibile");
		});
	};

}]);