angular.module('mds').directive('rappresentation', ['$compile', function ($compile) {
	return {
		restrict: 'AE',
		templateUrl: 'images/representation.svg',
		scope: {
        	values: "=instantValues"// Creo uno nuovo Scope, che condivide istantValues (single-way binding)
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
			// Pannello pilota
			var pilot = angular.element(element[0].querySelector("#pilotPanel"));
			pilot.html("{{values.pilotPanel}}");
			$compile(pilot)(scope);
			// Pannello Solare
            var air = angular.element(element[0].querySelector("#air"));
            air.html("{{values.air}}");
            $compile(air)(scope);
		}
	};
}]);