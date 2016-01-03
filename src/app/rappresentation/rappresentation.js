angular.module('mds')


.controller('rappresentationCtrl', ['$scope', function ($scope) {
    
}])

.directive('rappresentation', ['$compile', function ($compile) {
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
            // Imposto gli altri testi
            var otherTexts = ["pilotPanel", "air", "inH2O", "outH2O", "inSun", "outSun", "inSunB", "outSunB"];
            for(var i in otherTexts) {
                var text = angular.element(element[0].querySelector("#" + otherTexts[i]));
                text.html("{{values." +  otherTexts[i] + "}}");
                $compile(text)(scope)
            }
		}
	};
}])

.filter('temperature_color', [function () { 
    return function (input) {
    	var input = parseInt(input);
    	var r = input * 3;
    	var g = 25;
    	var b = 125 - input;
        return "rgb(" + r + ',' + g + ',' + b + ')';
    }
}])

.filter('temperature', [function(){
	return function(input){
		return input + ' C';
	}
}]);