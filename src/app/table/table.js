angular.module('mds')

.controller("tableCtrl", ['$scope', function($scope){ // Controller della tabella
	$scope.titles = ["Ora", "Sonda 1", "Sonda 2", "Sonda 3", "Sonda 4", "Sonda 5", "Sonda 6", "Sonda 7", "Sonda 8", "Sonda 9", "Sonda 10", "Sonda 11", "Entrata acqua ", "Uscita acqua", "Entrata Sole", "Uscita sole", "Pannello pilota", "Temperatura aria"];
	$scope.advanceIndex = 12;
	$scope.data = mdsData.day;
}])