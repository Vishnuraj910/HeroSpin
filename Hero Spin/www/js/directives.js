angular.module("HeroSpin.directives", []).
    directive('backImg', function () {
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
})



function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}