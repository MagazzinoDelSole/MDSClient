angular.module('mds', ['ui.bootstrap'])
.filter('temperature_color', [function () { //Il filtro trasforma la temperatura in un colore
    return function (input) {
    	var input = parseInt(input);
    	var r = input * 3;
    	var g = 25;
    	var b = 125 - input;
        return "rgb(" + r + ',' + g + ',' + b + ')';
    }
}])

.filter('temperature', [function(){ // Convrte il testo in una temperatura specificando l'unità di misuta
	return function(input){
		return input + ' C';
	}
}])
.run(['$rootScope', '$http', function($rootScope, $http){ // Imposto il root scope
	$rootScope.selectedDate = new Date(); // Imposto oggi come data selezionata
	$rootScope.loadData = function(selectedDate){ // Funcione per il download di un file
		function getFileName(date){
			var d = date.getDay(), m = date.getMonth();
			return 'file/15-08-24'
			// return 'file/' + (date.getFullYear() - 2000) + '-' + m > 9 ? m : ('0' + m) + '-' + d > 9 ? d : ('0' + d);
		}
		$http.get(getFileName(selectedDate)).then(function(response){
			var fileContent = response.data;
			// Trasformo i file in una matrice.
			// Inizio dividendo le varie righe del file
			var rows = fileContent.split('\n');
			rows.pop();
			// Posso pensare ad ogni riga come un 'istante'
			// Ora divido ogni dato di un'istante
			var data = [];
			for(var i = 0;i < rows.length; i += 5)
				data.push(new Instant(rows[i].split(',')));
			// Infine inserisco i dati nel rootScope in modo che siano accessibili in tutto l'app angular.
			$rootScope.data = data;
		}, function(response){
			console.log("Errore");
		});
	};
}])
.controller("tableController", ['$scope', function($scope){ // Controller della tabella
	$scope.titles = ["Ora", "Sonda 1", "Sonda 2", "Sonda 3", "Sonda 4", "Sonda 5", "Sonda 6", "Sonda 7", "Sonda 8", "Sonda 9", "Sonda 10", "Sonda 11", "Entrata acqua ", "Uscita acqua", "Entrata Sole", "Uscita sole", "Pannello pilota", "Temperatura aria"];
	$scope.advanceIndex = 12;
}])
.controller("simulationController", ["$scope", function($scope){ // Controller della simulazione
	$scope.steps = $scope.data.length; // Numero di step
	$scope.step = 0; // Step attuale
	var timer; // Timer che fa 'scorrere' gli step
	$scope.play = function(){ // Pulsante Play
		if(timer != null) // Se esiste già un timer non faccio niente
			return ;
		timer = setInterval(function(){ // Imposto il timer
			$scope.step = Math.min($scope.steps, $scope.step + 1);
			$scope.$apply(); // Aggiorno lo scope di angular
		}, 50);
	};
	$scope.stop = function(){ // Pulsante stop
		if(timer != null) // Se il timer esiste lo rimuovo
			clearInterval(timer);
		$scope.step = 0; // E riporto a 0 il contatore degli step
	};
	$scope.pause = function(){ // Pulsante Pausa
		if(timer != null) // Se il timer esiste lo cancello
			clearInterval(timer);
	};
}]);
// Oggetto istante che contiene tutti i date da rappresentare
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