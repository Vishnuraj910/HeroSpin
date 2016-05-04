angular.module('HeroSpin.controllers', [])
.controller("AppCtrl", function ($scope) {
}).controller("selectCtrl", function ($scope,$state, $ionicModal,DataFactory) { // Inital hero select page controller
    $scope.selectedHeroClass = "";
    $scope.myHero = DataFactory.myHero; // Get the saved hero if any 
    $ionicModal.fromTemplateUrl('tmpl/choose.html', { // Select hero modal
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openSelect = function () {
        $scope.modal.show();
    };
    $scope.chooseHero = function (hro) { // Set hero and goto list page
        DataFactory.setHero(hro);
        $scope.modal.hide();
        $state.go('list', { "hero": hro }, { reload: true });
    }

}).controller("listCtrl", function ($scope, $state, DataFactory, $stateParams, $mdToast, $http) { // Main list of movies and tv series
    $scope.selectedHero = $stateParams.hero;
   
    $scope.movieList = [];
    $scope.movieIndex = 1;
    $scope.totalResults;
    $scope.selectedMovie = {};
    $scope.imageIcon = "ion-ios-play fnt-green-1";
    if ($scope.selectedHero === 'bat') {
        $scope.titleLogo = "img/bat-logo-white.png";
        $scope.titleName = "Batman";
    } else {
        $scope.titleLogo = "img/super-logo-white.png";
        $scope.titleName = "Superman";
    }
    $scope.changeHero = function () {
        $state.go('select', {}, { reload: true }); // Go back to change the selected hero
    }

    function loadContents(isRand) { // Load data contents for getting random movie and entire movies list
        $scope.imageIcon = "fnt-blue-1 ion-ios-reload "
        $http.post('http://www.omdbapi.com/?s=' + $scope.titleName + '&page=' + $scope.movieIndex + '&type=movie').then(function (r) {          
            $scope.movieList = $scope.movieList.concat(r.data.Search);
            $scope.totalResults = r.data.totalResults;
            $scope.imageIcon = "ion-ios-play fnt-green-1"
            if (isRand) {
                $scope.getRandomMovie();
            }
        }, function (err) {        
            var toast = $mdToast.simple().content('Internet connectivity problem').action('OK!').highlightAction(true).hideDelay(10000).position('bottom');$mdToast.show(toast).then(function (response) {});
        });
    
    }

    $scope.pickNext = function () { // Pick next movie button click
        $scope.movieIndex++; // Add next page contents while taking the random
        if ($scope.totalResults >= $scope.movieList.length)
        {
            loadContents(true);
        }
    }

    $scope.getRandomMovie = function () {        
        $scope.selectedMovie = $scope.movieList[randomNumber(0, $scope.movieList.length)]
    }
    $scope.doRefresh = function () {
        $scope.movieIndex = 1;
        loadContents(false);
        $scope.$broadcast('scroll.refreshComplete');
    }
    loadContents(true);
    
    $scope.nextPage = function () { // Pick next movie button click
        $scope.movieIndex++; // Add next page contents while taking the random
        if ($scope.totalResults > $scope.movieList.length) {
            loadContents(false);
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    }
    $scope.gotoDetails = function (item) {
        $state.go('details', { "movieid": item.imdbID,"title":item.Title }, { reload: true });

    }


}).controller("detailCtrl", function ($scope, $stateParams, $mdToast, $ionicHistory, $http) { // Details page controller
    $scope.title = $stateParams.title;
    $scope.movieDetails = {}
    $scope.playThis = function () {
        var toast = $mdToast.simple().content('Playing ' + $scope.title).action('OK!').highlightAction(true).hideDelay(10000).position('bottom');
        $mdToast.show(toast);
        // Go to movie player if the video is available
    }

    $scope.goBack = function () {
        $ionicHistory.backView(); // Page back
        $ionicHistory.goBack();
    }


    $http.post('http://www.omdbapi.com/?i=' + $stateParams.movieid + '&plot=full&r=json').then(function (r) {

        $scope.movieDetails = r.data;

    }, function (err) {
        var toast = $mdToast.simple().content('Internet connectivity problem').action('OK!').highlightAction(true).hideDelay(10000).position('bottom'); $mdToast.show(toast).then(function (response) { });
    });

})