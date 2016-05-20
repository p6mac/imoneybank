// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','firebase', 'starter.controllers', 'starter.constants', 'starter.services' ])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AuthController',
    controllerAs : 'authCtrl'
  })

  .state('app.deposit', {
    url: '/deposit',
    views: {
      'menuContent': {
        templateUrl : 'templates/deposit.html',
        controller : 'TransactionController',
        controllerAs : 'transactionCtrl'
      }
    }
  })

  .state('app.withdraw', {
      url: '/withdraw',
      views: {
        'menuContent': {
          templateUrl: 'templates/withdraw.html',
          controller : 'TransactionController',
          controllerAs : 'transactionCtrl'
        }
      }
    })
    .state('app.balances', {
      url: '/balance',
      views: {
        'menuContent': {
          templateUrl: 'templates/checkbalance.html',
          controller : 'TransactionController',
          controllerAs : 'transactionCtrl'

        }
      }
    })

  .state('app.history', {
    url: '/history',
    views: {
      'menuContent': {
        templateUrl: 'templates/transactionhistory.html',
        controller : 'TransactionController',
        controllerAs : 'transactionCtrl'
      }
    }
  })
  .state('app.account', {
    url: '/account',
    views: {
      'menuContent': {
        templateUrl: 'templates/account.html',
        controller : 'AccountController',
        controllerAs : 'accountCtrl'
      }
    }
  })
  .state('login', {
    url : '/',
    templateUrl: 'templates/login.html',
    controller : 'AuthController',
    controllerAs : 'authCtrl'
  })
  .state('register', {
    url : '/register',
    templateUrl: 'templates/register.html',
    controller : 'AuthController',
    controllerAs : 'authCtrl'
  });
  // if none of the above states are matched, use this as the fallback
   $urlRouterProvider.otherwise('/');
});
