housebook.controller('HouseProfileCtlr', function ($scope, $rootScope, $sce, $routeParams, HouseProfileSvc, ImageFctr, $q) {

    var profilePictureCanvas = null, ctx = null, img = null;

    $scope.selectedProfilePicture = null;
    $scope.profileThumbnail = null;
    $scope.profileThumbnailUri = null;

    HouseProfileSvc.getProfile($routeParams.id).then(function (response) {
        $scope.profile = response;
        $scope.profile.mapq = "https://www.google.com/maps/embed/v1/place?key=AIzaSyBK5uabiBpR15vbeg-DYFZq9GuQsQNImWY&q=" + encodeURIComponent($scope.profile.address.street1) + " " + encodeURIComponent($scope.profile.address.street2) + "," + encodeURIComponent($scope.profile.address.city) + "," + encodeURIComponent($scope.profile.address.country);
        $scope.currentProjectUrl = $sce.trustAsResourceUrl($scope.profile.mapq);
        $scope.profile.img = 'https://s3.amazonaws.com/house-uploads-local/20161206_163310.jpg';
        loadThumbnail();

    }, function (err) {
        console.log(err);
    });

    function readURL(input) {
        if (input.files && input.files[0]) {

            var FR = new FileReader();
            FR.onload = function (e) {
                ImageFctr.prepareImageDataURIFromCanvas(200, 150, e.target.result).then(function (uri) {
                    $scope.img200x150URI = uri;
                });
                ImageFctr.prepareImageDataURIFromCanvas(400, 300, e.target.result, "canvas").then(function (uri) {
                    $scope.img400x300URI = uri;
                });
                ImageFctr.prepareImageDataURIFromCanvas(600, 400, e.target.result).then(function (uri) {
                    $scope.img600x400URI = uri;
                });
                $scope.$apply();
            };
            FR.readAsDataURL(input.files[0]);
        }
    }

    $scope.savePicture = function () {
        var file = document.getElementById('file').files[0];

        var img200x150URI = dataURItoBlob($scope.img200x150URI);
        var img400x300URI = dataURItoBlob($scope.img400x300URI);
        var img600x400URI = dataURItoBlob($scope.img600x400URI);

        HouseProfileSvc.savePicture($routeParams.id, '200x150/' + file.name, file.type, new File([img200x150URI], {type: file.type}), true, $rootScope.user._id).then(function () {
            img.setAttribute("src", $scope.img400x300URI);
            HouseProfileSvc.savePicture($routeParams.id, '400x300/' + file.name, file.type, new File([img400x300URI], {type: file.type}), false, $rootScope.user._id);
            HouseProfileSvc.savePicture($routeParams.id, '600x400/' + file.name, file.type, new File([img600x400URI], {type: file.type}), false, $rootScope.user._id);
        });

        $('#basicPropertiesModal').modal('hide');
    };

    $(function () {
        $("input#file").change(function () { //set up a common class
            readURL(this);
        });
        profilePictureCanvas = document.getElementById("house-profile-canvas");
        ctx = profilePictureCanvas.getContext("2d");
        img = new Image();
        img.crossOrigin = "Anonymous"; //cors support
        img.onload = function () {
            var W = img.width;
            var H = img.height;
            profilePictureCanvas.width = W;
            profilePictureCanvas.height = H;
            ctx.drawImage(img, 0, 0); //draw image
        };
    });

    function loadThumbnail() {
        img.src = $scope.profile.profilePicture ? 'https://s3.amazonaws.com/house-uploads-local/' + $scope.profile.profilePicture.path : '/img/default.png';
    }
});