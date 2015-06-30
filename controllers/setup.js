angular.module("setup", [])
    .controller("setupCtrl", function ($scope, $http, $location, initializer, spService, imageStorage, configurationList) {


        var config = null;
        $scope.folderURL = "";
        $scope.options = {
            headline: "",
            labelheadline: ""
        };

        //will always run to get the folder structure
        spService.getParentFolder("https://" + initializer.Url.host + initializer.Url.base, "?$expand=Folders,ParentFolder/ParentFolder",
            function (response) {
                $scope.folders = response.data.d.results;
            },
            function (response) {

            }
        );

        $scope.itemCount = function(item){
            return item.ItemCount > 0;
        };


        $scope.navigateFolder = function (folderLink) {

            spService.getFolderItems("https://" + initializer.Url.host + initializer.Url.base, folderLink, "?$expand=Folders, ParentFolder/ParentFolder",
                function (response) {

                    if (response.data.d.results.length !== 0) {
                        $scope.folders = response.data.d.results;
                        $scope.folderURL = $scope.folders[0].ParentFolder.ServerRelativeUrl;
                    } else {
                        $scope.folderURL = "There's no items in that folder"
                    }
                },
                function (response) {

                }
            );
        };

        $scope.save = function () {
            //the list database should be setup with these names
            var data = {
                PageURL: initializer.Url.main,
                SlideFolder: $scope.folderURL,
                encodeURL: initializer.encodeURL,
                options: JSON.stringify({
                    headline: angular.isUndefined($scope.options.headline) ? '' : $scope.options.headline,
                    labelheadline: angular.isUndefined($scope.options.labelheadline) ? '' : $scope.options.labelheadline,
                    slideWidth: 480 + 'px',
                    photoCreditWidth: 480 - 10 + 'px'
                })
            };

            //check if slide Folder exists and if it contains images
            $http({
                url: "https://" + initializer.Url.host + initializer.Url.base + "/_api/web/getFolderByServerRelativeUrl('" + data.SlideFolder + "')/Files?$select=Title,Name,TimeCreated,TimeLastModified,ListItemAllFields/OData__Comments, ListItemAllFields/OData__Author&$expand=Author,ListItemAllFields",
                method: "GET",
                headers: {
                    "Accept": "application/json; odata=verbose"
                }
            }).then(function (response) {

                //obtaining json structure of images
                imageStorage.add(response.data.d.results);
                imageStorage.setFolderLocation(data.SlideFolder);


                //If there's no images then it will not save the data on to the configuration because the folder does not exist or it doesn't have any images at all
                if (imageStorage.get().length !== 0) {


                    //check slideshow configuration to see if it needs to be added or updated
                    spService.getListItems("https://" + initializer.Url.host + initializer.Url.base, configurationList, "?$select=ID, PageURL, SlideFolder, encodeURL, options&$filter=encodeURL eq '" + initializer.encodeURL + "'",
                        function (response) {

                            config = response.data.d.results;

                            //the condition for adding or updating

                            if (config.length > 0) {

                                spService.updateListItem("https://" + initializer.Url.host + initializer.Url.base, configurationList, config[0].ID, data,
                                    function (response) {

                                        imageStorage.setIndex(1);
                                        imageStorage.setOptions(JSON.parse(data.options));
                                        $location.path("/slide/1");

                                    },
                                    function (response) {
                                        //fail to update the item on the slideshow configuration list
                                    });

                            } else {

                                spService.addListItem("https://" + initializer.Url.host + initializer.Url.base, configurationList, data,
                                    function (response) {


                                        imageStorage.setIndex(1);
                                        imageStorage.setOptions(JSON.parse(data.options));
                                        $location.path("/slide/1");

                                    },
                                    function (response) {
                                        //fail to add the item onto the slideshow configuration list
                                    });

                            }

                        },
                        function (response) {
                            //fail to get the slideshow configuration list
                        });


                } else {
                    alert("The folder does not exist or there are no images on the folder");
                }

            }, function (response) {

            });



        };

    });