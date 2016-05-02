angular.module("HeroSpin.directives", []).directive("hold", ['$ionicGesture', function ($ionicGesture) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attr) {
            var handleHold = function (e) {
                $scope.$apply($attr.hold);
            }

            $ionicGesture.on('hold', handleHold, $element);

        }
    }
}]).directive('compile', ['$compile', function ($compile) {
    return function (scope, element, attrs) {
        scope.$watch(
            function (scope) {
                return scope.$eval(attrs.compile);
            },
            function (value) {
                element.html(value);
                $compile(element.contents())(scope);
            }
        );
    };
}]).directive('backImg', function () {
    return function (scope, element, attrs) {
        attrs.$observe('backImg', function (value) {
            element.css({
                'background-image': 'url(' + value + ')',
                'background-size': 'cover',
                'color': '#fff'
            });
        });
    };
}).directive('errSrc', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src !== attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);

                }

            });
        }
    }
}).directive('imageLazySrc', ['$document', '$timeout', '$ionicScrollDelegate', '$compile',
    function ($document, $timeout, $ionicScrollDelegate, $compile) {
        return {
            restrict: 'A',
            scope: {
                lazyScrollResize: "@lazyScrollResize",
                imageLazyBackgroundImage: "@imageLazyBackgroundImage"
            },
            link: function ($scope, $element, $attributes) {
                if (!$attributes.imageLazyDistanceFromBottomToLoad) {
                    $attributes.imageLazyDistanceFromBottomToLoad = 0;
                }
                if (!$attributes.imageLazyDistanceFromRightToLoad) {
                    $attributes.imageLazyDistanceFromRightToLoad = 0;
                }

                if ($attributes.imageLazyLoader) {
                    var loader = $compile('<div class="image-loader-container"><ion-spinner class="image-loader" icon="' + $attributes.imageLazyLoader + '"></ion-spinner></div>')($scope);
                    $element.after(loader);
                }

                var deregistration = $scope.$on('lazyScrollEvent', function () {
                    //console.log('scroll');
                    if (isInView()) {
                        loadImage();
                        deregistration();
                    }
                }
                );

                function loadImage() {
                    //Bind "load" event
                    $element.bind("load", function (e) {
                        if ($attributes.imageLazyLoader) {
                            loader.remove();
                        }
                        if ($scope.lazyScrollResize === "true") {
                            //Call the resize to recalculate the size of the screen
                            $ionicScrollDelegate.resize();
                        }
                    });

                    if ($scope.imageLazyBackgroundImage === "true") {
                        var bgImg = new Image();
                        bgImg.onload = function () {
                            if ($attributes.imageLazyLoader) {
                                loader.remove();
                            }
                            $element[0].style.backgroundImage = 'url(' + $attributes.imageLazySrc + ')'; // set style attribute on element (it will load image)
                            if ($scope.lazyScrollResize === "true") {
                                //Call the resize to recalculate the size of the screen
                                $ionicScrollDelegate.resize();
                            }
                        };
                        bgImg.src = $attributes.imageLazySrc;
                    } else {
                        $element[0].src = $attributes.imageLazySrc; // set src attribute on element (it will load image)
                    }
                }

                function isInView() {
                    var clientHeight = $document[0].documentElement.clientHeight;
                    var clientWidth = $document[0].documentElement.clientWidth;
                    var imageRect = $element[0].getBoundingClientRect();
                    return (imageRect.top >= 0 && imageRect.top <= clientHeight + parseInt($attributes.imageLazyDistanceFromBottomToLoad))
                        && (imageRect.left >= 0 && imageRect.left <= clientWidth + parseInt($attributes.imageLazyDistanceFromRightToLoad));
                }

                // bind listener
                // listenerRemover = scrollAndResizeListener.bindListener(isInView);

                // unbind event listeners if element was destroyed
                // it happens when you change view, etc
                $element.on('$destroy', function () {
                    deregistration();
                });

                // explicitly call scroll listener (because, some images are in viewport already and we haven't scrolled yet)
                $timeout(function () {
                    if (isInView()) {
                        loadImage();
                        deregistration();
                    }
                }, 500);
            }
        };
    }]).factory('$ImageCacheFactory', ['$q', function ($q) {
        return {
            Cache: function (urls) {
                if (!(urls instanceof Array))
                    return $q.reject('Input is not an array');

                var promises = [];

                for (var i = 0; i < urls.length; i++) {
                    var deferred = $q.defer();
                    var img = new Image();

                    img.onload = (function (deferred) {
                        return function () {
                            deferred.resolve();
                        }
                    })(deferred);

                    img.onerror = (function (deferred, url) {
                        return function () {
                            deferred.reject(url);
                        }
                    })(deferred, urls[i]);

                    promises.push(deferred.promise);
                    img.src = urls[i];
                }

                return $q.all(promises);
            }
        }
    }]).constant('ratingConfig', {
        max: 5,
        stateOn: null,
        stateOff: null
    }).controller('RatingController', function($scope, $attrs, ratingConfig) {
        var ngModelCtrl;
        ngModelCtrl = {
            $setViewValue: angular.noop
        };
        this.init = function(ngModelCtrl_) {
            var max, ratingStates;
            ngModelCtrl = ngModelCtrl_;
            ngModelCtrl.$render = this.render;
            this.stateOn = angular.isDefined($attrs.stateOn) ? $scope.$parent.$eval($attrs.stateOn) : ratingConfig.stateOn;
            this.stateOff = angular.isDefined($attrs.stateOff) ? $scope.$parent.$eval($attrs.stateOff) : ratingConfig.stateOff;
            max = angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : ratingConfig.max;
            ratingStates = angular.isDefined($attrs.ratingStates) ? $scope.$parent.$eval($attrs.ratingStates) : new Array(max);
            return $scope.range = this.buildTemplateObjects(ratingStates);
        };
        this.buildTemplateObjects = function(states) {
            var i, j, len, ref;
            ref = states.length;
            for (j = 0, len = ref.length; j < len; j++) {
                i = ref[j];
                states[i] = angular.extend({
                    index: 1
                }, {
                    stateOn: this.stateOn,
                    stateOff: this.stateOff
                }, states[i]);
            }
            return states;
        };
        $scope.rate = function(value) {
            if (!$scope.readonly && value >= 0 && value <= $scope.range.length) {
                ngModelCtrl.$setViewValue(value);
                return ngModelCtrl.$render();
            }
        };
        $scope.reset = function() {
            $scope.value = ngModelCtrl.$viewValue;
            return $scope.onLeave();
        };
        $scope.enter = function(value) {
            if (!$scope.readonly) {
                $scope.value = value;
            }
            return $scope.onHover({
                value: value
            });
        };
        $scope.onKeydown = function(evt) {
            if (/(37|38|39|40)/.test(evt.which)) {
                evt.preventDefault();
                evt.stopPropagation();
                return $scope.rate($scope.value + (evt.which === 38 || evt.which === 39 ? {
                    1: -1
                } : void 0));
            }
        };
        this.render = function() {
            return $scope.value = ngModelCtrl.$viewValue;
        };
        return this;
    }).directive('rating', function() {
        return {
            restrict: 'EA',
            require: ['rating', 'ngModel'],
            scope: {
                readonly: '=?',
                onHover: '&',
                onLeave: '&'
            },
            controller: 'RatingController',
            template: '<ul class="rating" ng-mouseleave="reset()" ng-keydown="onKeydown($event)">' + '<li ng-repeat="r in range track by $index" ng-click="rate($index + 1)"><i class="icon" ng-class="$index < value && (r.stateOn || \'ion-android-star\') || (r.stateOff || \'ion-android-star-outline\')"></i></li>' + '</ul>',
            replace: true,
            link: function(scope, element, attrs, ctrls) {
                var ngModelCtrl, ratingCtrl;
                ratingCtrl = ctrls[0];
                ngModelCtrl = ctrls[1];
                if (ngModelCtrl) {
                    return ratingCtrl.init(ngModelCtrl);
                }
            }
        };
    });



Date.prototype.yyyymmdd = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return yyyy +"-"+ (mm[1] ? mm : "0" + mm[0]) +"-"+ (dd[1] ? dd : "0" + dd[0]); // padding
};