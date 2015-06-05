angular.module("slide", [])
    .controller("slideShowCtrl", function ($scope, $location, $routeParams, $ngSilentLocation, imageStorage, initializer) {

        $scope.slides = [];
        $scope.currentSlideNum = "";
        $scope.totalSlides = "";
        $scope.options = {};
        $scope.Url = initializer.Url;
        $scope.slideLocation = null;


        //if no image then run to get the image
        if (imageStorage.get() === null) {

            initializer.run().then(function () {
                $scope.slides = imageStorage.get();
                $scope.options = imageStorage.getOptions();

                //because the folder doesn't exist it will go back to setup mode
                if ($scope.slides.length === 0) {
                    $location.path("/setup");
                }

                $scope.currentSlideNum = parseInt($routeParams.index, 10);
                $scope.totalSlides = $scope.slides.length;
                $scope.slideLocation = imageStorage.getFolderLocation();

                imageStorage.setIndex($scope.currentSlideNum);

            });
        } else {

            $scope.slides = imageStorage.get();
            $scope.options = imageStorage.getOptions();
            $scope.slideLocation = imageStorage.getFolderLocation();



            if (parseInt($routeParams.index, 10) <= $scope.slides.length) {
                $scope.currentSlideNum = parseInt($routeParams.index, 10);

                //no need to set the index if its the same
                if ($scope.currentSlideNum !== imageStorage.getIndex()) {
                    imageStorage.setIndex($scope.currentSlideNum);
                }

            } else {
                //go back to original because that index does not exist
                $scope.currentSlideNum = imageStorage.getIndex();
                $location.path("/slide/" + $scope.currentSlideNum);
            }

            $scope.totalSlides = $scope.slides.length;
        }


        $scope.leftArrow = function () {
            if (($scope.currentSlideNum - 1) <= 0) {

                $scope.currentSlideNum = $scope.totalSlides;
                imageStorage.setIndex($scope.currentSlideNum);
                $ngSilentLocation.silent("/slide/" + $scope.currentSlideNum);

            } else {

                $scope.currentSlideNum -= 1;
                imageStorage.setIndex($scope.currentSlideNum);
                $ngSilentLocation.silent("/slide/" + $scope.currentSlideNum);

            }
        };

        $scope.rightArrow = function () {

            if (($scope.currentSlideNum + 1) > $scope.totalSlides) {
                $scope.currentSlideNum = 1;
                imageStorage.setIndex($scope.currentSlideNum);
                $ngSilentLocation.silent("/slide/" + $scope.currentSlideNum);
            } else {
                $scope.currentSlideNum += 1;
                imageStorage.setIndex($scope.currentSlideNum);
                $ngSilentLocation.silent("/slide/" + $scope.currentSlideNum);

            }
        };
    });