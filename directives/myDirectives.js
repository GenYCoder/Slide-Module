angular.module("myDirectives", [])
    .directive("imageMove", function ($document) {
        return {
            link: function (scope) {

                //needed this because it keeps on calling keypress for every new scope created here and help do necessary clean ups to avoid memory leaks
                scope.$on("$destroy", function () {
                    $document.unbind("keypress");
                    angular.element(document.querySelector("#leftArrow")).unbind("click");
                    angular.element(document.querySelector("#rightArrow")).unbind("click");
                });

                //controls the left arrow
                angular.element(document.querySelector("#leftArrow")).bind("click", function () {
                    scope.$apply(scope.leftArrow());
                });

                //controls the right arrow
                angular.element(document.querySelector("#rightArrow")).bind("click", function () {
                    scope.$apply(scope.rightArrow());
                });

                //global keypress for arrow 
                $document.bind("keypress", function (e) {

                    if (e.charCode === 44 || e.keyCode === 44) {

                        scope.$apply(scope.leftArrow());
                    } else if (e.charCode === 46 || e.keyCode === 46) {
                        scope.$apply(scope.rightArrow());
                    }
                });

            },
            restrict: "A"
        };
    });