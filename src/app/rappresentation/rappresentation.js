angular.module('mds.rappresentation', ['ui.bootstrap-slider', 'mds.data'])


.controller('RappresentationCtrl', ['$scope', '$interval', 'mdsData', function($scope, $interval, mdsData) {
	
	// insert in the scope areference to the data
	$scope.data = mdsData;
	
	// This is the actual rappresentated step
	$scope.step = 0;

	$scope.isRunning = false;
	
	// This is the object that contains the preferences
	// of the simulation
	$scope.preferences = {
		speed: 1
	};
	
	// Function used to change the speed of the simulation
	$scope.setSpeed = function (newSpeed) {
		
		// Set the new speed
		$scope.preferences.speed = newSpeed;
		
		// And if the simulation is running, change his speed
		if($scope.isRunning) {
			$scope.pause();
			$scope.play();
		}
	};
	
	// Function used to skip to a specify step
	$scope.skipTo = function (point) {
		$scope.step = point;
	};
	
	// This is the timer, well, the interval that 'animate' the simulation
	var timer;
	
	
	// Play button
	$scope.play = function() {
		
		// Calculate the delay
		var delay = 2000 / $scope.preferences.speed;
		
		// If the interval already exist, don't do anything
		if ($scope.isRunning) {
			return;
		}
		
		// set the new interval
		timer = $interval(function () {
			
			// At every 'tick' of the interval, incrememnt the step counter
			$scope.step++;
			
			// If this is the last step, stop it
			// NB: I don't set directly the number of the step in the angular
			// $interval because the user can slide the slider andchange the number
			// of the step
			if($scope.step >= mdsData.steps) {
				$scope.stop();
			}
			
		}, delay);

		$scope.isRunning = true;
		
	};
	
	// Stop button
	$scope.stop = function() {
		
		if (!$scope.isRunning) {
			return;
		}
		
		// If the timer exist, stop it
		$interval.cancel(timer);
		timer = undefined;
		$scope.isRunning = false;
			
		// And reset the step counter
		$scope.step = 0;
	};
	
	// Pause button
	$scope.pause = function() {
		// If the timer exist
		if (!angular.isDefined(timer)) {
			return;
		}
		
		$interval.cancel(timer);
		timer = undefined;
		$scope.isRunning = false;
	};
	
	
}])

.directive('rappresentation', ['$compile', function($compile) {
	return {
		restrict: 'AE',
		templateUrl: 'rappresentation/rappresentation.tpl.svg',
		scope: {
			// Create a new scope, that share 'instantValues' (the equal means
			// single-way binding)
			values: "=instantValues"
		},
		link: function(scope, element, attrs) {
			// Handle the levels
			var levels = element[0].querySelectorAll('.gLevel');
			angular.forEach(levels, function(path, i) {
				var level = angular.element(path);
				var components = level.children();
				var box = angular.element(components[0]);
				var text = angular.element(components[1]);
				var tube = angular.element(components[2]);
				// Imposto il testo
				text.html("{{values.sensors[" + i + "] | temperature}}");
				// E il colore
				box.attr("ng-attr-fill", "{{values.sensors[" + i + "] | temperature_color}}");
				$compile(level)(scope);
			});
			
			// Set the other text
			var otherTexts = ["pilotPanel", "air", "inH2O", "outH2O", "inSun", "outSun", "inSunB", "outSunB"];
			for (var i in otherTexts) {
				var text = angular.element(element[0].querySelector("#" + otherTexts[i]));
				text.html("{{values." + otherTexts[i] + "}}");
				$compile(text)(scope);
			}
		}
	};
}])

.filter('temperature_color', [function() {
	return function(input) {
		var n = parseInt(input, 10);
		var r = n * 3;
		var g = 25;
		var b = 125 - n;
		return ("rgb(" + r + ',' + g + ',' + b + ')');
	};
}])

.filter('temperature', [function() {
	return function(input) {
		return (input + ' C');
	};
}]);