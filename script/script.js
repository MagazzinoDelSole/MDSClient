angular.module('mds', ['ui.bootstrap'])
//Il filtro trasforma la temperatura in un colore
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
}])
//Direttive SVG
//app.directive('mySvg', ['$compile', function ($compile) {
//    return {
//        restrict: 'EA',
//        scope: {
//        	values: "=instantValues"//Creo uno nuovo Scope, che condivide istantValues (single-way binding)
//        },
//        templateUrl: 'rappresentation.svg'
//    };
//}]);
//Setting the rootScope
.run(['$rootScope', '$http', function($rootScope, $http){
	$rootScope.selectedDate = new Date();
	$rootScope.loadData = function(selectedDate){
		function getFileName(date){
			var d = date.getDay(), m = date.getMonth();
			return 'file/15-08-24'
			return 'file/' + (date.getFullYear() - 2000) + '-' + m > 9 ? m : ('0' + m) + '-' + d > 9 ? d : ('0' + d);
		}
		$http.get(getFileName(selectedDate)).then(function(response){
			var fileContent = response.data;
			//Trasformo i file in una matrice.
			//Inizio dividendo le varie righe del file
			var rows = fileContent.split('\n');
			rows.pop();
			//Posso pensare ad ogni riga come un 'istante'
			//Ora divido ogni dato di un'istante
			var data = [];
			for(var i = 0;i < rows.length; i += 5)
				data.push(new Instant(rows[i].split(',')));
			//Infine inserisco i dati nel rootScope in modo che siano accessibili in tutto l'app angular.
			$rootScope.data = data;
		}, function(response){
			console.log("Errore");
		});
	};
}])
//Table Controller
.controller("tableController", ['$scope', function($scope){
	$scope.titles = ["Ora", "Sonda 1", "Sonda 2", "Sonda 3", "Sonda 4", "Sonda 5", "Sonda 6", "Sonda 7", "Sonda 8", "Sonda 9", "Sonda 10", "Sonda 11", "Entrata acqua ", "Uscita acqua", "Entrata Sole", "Uscita sole", "Pannello pilota", "Temperatura aria"];
	$scope.advanceIndex = 12;
}])
//Simulation Controller
.controller("simulationController", ["$scope", function($scope){
	$scope.steps = $scope.data.length;
	$scope.step = 0;
	var timer;
	$scope.play = function(){
		if(timer != null)
			return
		timer = setInterval(function(){
			$scope.step = Math.min($scope.steps, $scope.step + 1);
			$scope.$apply();
		}, 50);
	};
	$scope.stop = function(){
		if(timer != null)
			clearInterval(timer);
		$scope.step = 0;
	};
	$scope.pause = function(){
		if(timer != null)
			clearInterval(timer);
	};
}]);
//Oggetto Instant
function Instant(values) {
	var i = 0;
	this.sensors = [];
	for(var j = 0;j < 11; j++)
		this.sensors.push(values[i++]);
	this.inH2O = values[i++];
	this.outH2O = values[i++];
	this.inSun = values[i++];
	this.outSun = values[i++];
	this.inSunB = values[i++];
	this.outSunB = values[i++];
	this.pilotPanel = values[i++];
	this.air = values[i++];
	this.valves = [];
	for(var j = 0;j < 6; j++)
		this.valves.push(values[i++]);
	this.p = [];
	for(var j = 0;j < 2; j++)
		this.p.push(values[i++]);
	this.time = values[i++].replace(/"/g, "");
}