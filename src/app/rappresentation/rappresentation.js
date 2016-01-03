angular.module('mds.rappresentation', ['mds.data'])


.controller('RappresentationCtrl', ['$scope', 'mdsData', function($scope, mdsData) {
	
	$scope.values = mdsData.values;
	$scope.steps = mdsData.steps; // Numero di step
	$scope.step = 0; // Step attuale
	
	$scope.preferences = {
		speed: 1
	};
	
	$scope.skipTo = function (point) {
		$scope.step = point;
	};
	
	var timer; // Timer che fa 'scorrere' gli step
	
	$scope.setSpeed = function (newSpeed) {
		$scope.preferences.speed = newSpeed;
		if(timer != null) {
			clearInterval(timer);
			
		}
	};
	
	
	$scope.play = function() { // Pulsante Play
		if (timer != null) { // Se esiste già un timer non faccio niente
			return;
		}
		timer = setInterval(function() { // Imposto il timer
			$scope.step++;
			if ($scope.step >= $scope.steps) {
				clearInterval(timer);
			}
			$scope.$apply(); // Aggiorno lo scope di angular
		}, 50);
	};
	$scope.stop = function() { // Pulsante stop
		if (timer != null) { // Se il timer esiste lo rimuovo
			clearInterval(timer);
		}
		$scope.step = 0; // E riporto a 0 il contatore degli step
	};
	$scope.pause = function() { // Pulsante Pausa
		if (timer != null) { // Se il timer esiste lo cancello
			clearInterval(timer);
		}
	};
	
	
}])

.directive('rappresentation', ['$compile', function($compile) {
	return {
		restrict: 'AE',
		templateUrl: 'rappresentation/rappresentation.tpl.svg',
		scope: {
			values: "=instantValues" // Creo uno nuovo Scope, che condivide istantValues (single-way binding)
		},
		link: function(scope, element, attrs) {
			// Gestisco i livelli
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
			// Imposto gli altri testi
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