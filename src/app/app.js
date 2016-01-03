angular.module( 'mds', [
  'templates-app',
  'templates-common',
  'mds.dataSelection',
  'mds.rappresentation',
  'mds.table',
  'ui.router',
  'ui.bootstrap'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
  // The state should be configured in each module, not in the app (well,
  // this is what i've understand) but in this case the state is defined here
  // because there is only one state whit multiple views
  $stateProvider.state( 'home', {
    url: '/home',
    views: {
      "date" : {
        controller: 'DateCtrl',
        templateUrl: 'dateSelection/date.tpl.html'
      },
      'table': {
        controller: 'TableCtrl',
        templateUrl: 'table/table.tpl.html'
      },
      'simulation': {
        controller: 'RappresentationCtrl',
        templateUrl: 'rappresentation/rappresentation.tpl.html'
      }
    },
    data: { pageTitle: 'Dati Statistici - Beta' }
  });
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  
})

;