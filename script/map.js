angular.module('mds').directive('rappresentation', ['$compile', function ($compile) {
	
	return {
		restrict: 'AE',
		templateUrl: 'images/pure.svg',
		scope: {
        	values: "=instantValues"//Creo uno nuovo Scope, che condivide istantValues (single-way binding)
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
				text.html("{{values.sensors[" + i + "]}}");
				$compile(level)(scope);
			});
			// Pannello pilota
			var pilot = angular.element(element[0].querySelector("#pilotPanel"));
			pilot.html("{{values.pilotPanel}}");
			$compile(pilot)(scope);
		}
	};
}]);