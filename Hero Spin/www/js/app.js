// Ionic HeroSpin App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'HeroSpin' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('HeroSpin', ['ionic','ngMaterial', 'ngCordova', 'HeroSpin.controllers', 'HeroSpin.services', 'HeroSpin.directives'])

.run(function ($ionicPlatform, $cordovaSplashscreen) {
  $ionicPlatform.ready(function() {
    if(cordova.platformId === 'ios' && window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      $cordovaSplashscreen.hide();
      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
}).config([
        '$stateProvider', '$urlRouterProvider', '$mdThemingProvider', function ($stateProvider, $urlRouterProvider, $mdThemingProvider ) {

            $mdThemingProvider.theme('default')
                .primaryPalette('indigo')
                .accentPalette('light-blue');


            $stateProvider
               
                .state('select', {
                    url: "/select",
                    views: {
                        'heroContent': {
                            templateUrl: "tmpl/select.html",
                            controller: "selectCtrl"
                        }
                    }
                }).state('list', {
                    url: "/list/:hero",
                    views: {
                        'heroContent': {
                            templateUrl: "tmpl/list.html",
                            controller: "listCtrl"
                        }
                    }
                }).state('details', {
                    url: "/details/:movieid/:title",
                    views: {
                        'heroContent': {
                            templateUrl: "tmpl/movie-details.html",
                            controller: "detailCtrl"
                        }
                    }
                })
        
               


            $urlRouterProvider.otherwise((window.localStorage.getItem("myHero") != null) ? '/list/' + window.localStorage.getItem("myHero") : '/select');
           
        }
])