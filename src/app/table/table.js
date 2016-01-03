angular.module('mds.table', ['mds.data'])

.controller("TableCtrl", ['$scope', 'mdsData', function($scope, mdsData){
	
	// Titles of the table
	$scope.titles = ["Ora", "Sonda 1", "Sonda 2", "Sonda 3", "Sonda 4", "Sonda 5", "Sonda 6", "Sonda 7", "Sonda 8", "Sonda 9", "Sonda 10", "Sonda 11", "Entrata acqua ", "Uscita acqua", "Entrata Sole", "Uscita sole", "Pannello pilota", "Temperatura aria"];
	
	// Value of the 'advanced' index
	$scope.advanceIndex = 12;
	
	// Assing the data from the mdsData value to the scope
	$scope.data = mdsData.values;
}])