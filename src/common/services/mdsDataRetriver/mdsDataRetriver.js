angular.module('mds.dataRetriver', [])

.factory('mdsDataRetriver', ['$http', '$q', function($http, $q) {
    var retriver = {};

    var getFileNameFromDate = function(date) {
        var d = date.getDate(),
            m = date.getMonth() + 1;
        var fileName = 'file/' + (date.getFullYear() - 2000) + '-' + (m > 9 ? m : ('0' + m)) + '-' + (d > 9 ? d : ('0' + d));
        console.log(d);
        console.log(m);
        console.log(date.getFullYear());
        console.log(fileName);
        return fileName;
    };

    var Instant = function(values) {
        var i = 0;
        this.sensors = [];
        for (var j = 0; j < 11; j++) {
            this.sensors.push(values[i++]);
        }
        this.inH2O = values[i++];
        this.outH2O = values[i++];
        this.inSun = values[i++];
        this.outSun = values[i++];
        this.inSunB = values[i++];
        this.outSunB = values[i++];
        this.pilotPanel = values[i++];
        this.air = values[i++];
        this.valves = [];
        for (j = 0; j < 6; j++) {
            this.valves.push(values[i++]);
        }
        this.p = [];
        for (j = 0; j < 2; j++) {
            this.p.push(values[i++]);
        }
        this.time = values[i++].replace(/"/g, "");
    };

    retriver.retrive = function(date) {

        var defer = $q.defer();

        $http.get(getFileNameFromDate(date)).then(function(response) {

            var fileContent = response.data;
            // Trasformo i file in una matrice.
            // Inizio dividendo le varie righe del file
            var rows = fileContent.split('\n');
            rows.pop();
            // Posso pensare ad ogni riga come un 'istante'
            // Ora divido ogni dato di un'istante
            var data = [];
            for (var i = 0; i < rows.length; i += 5) {
                data.push(new Instant(rows[i].split(',')));
            }
            // Infine inserisco i dati nel rootScope in modo che siano accessibili in tutto l'app angular.
            defer.resolve(data);
        }, function(response) {
            defer.reject();
        });

        return defer.promise;
    };

    return retriver;
}]);
