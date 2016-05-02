angular.module('HeroSpin.controllers', [])
.controller("AppCtrl", function ($scope) {

    $scope.title = "HeroSpin"


}).controller("selectCtrl", function ($scope,$ionicModal) {
    $ionicModal.fromTemplateUrl('tmpl/choose.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openSelect = function () {
        $scope.modal.show();
    };
});
 