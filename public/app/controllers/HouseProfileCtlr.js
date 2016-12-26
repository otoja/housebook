housebook.controller('HouseProfileCtlr', function ($scope, $rootScope, $sce, $routeParams, HouseProfileSvc) {

    $scope.selectedProfilePicture = null;
    $scope.profileThumbnail = null;

    HouseProfileSvc.getProfile($routeParams.id).then(function (response) {
        $scope.profile = response;
        $scope.profile.mapq = "https://www.google.com/maps/embed/v1/place?key=AIzaSyBK5uabiBpR15vbeg-DYFZq9GuQsQNImWY&q=" + encodeURIComponent($scope.profile.address.street1) + " " + encodeURIComponent($scope.profile.address.street2) + "," + encodeURIComponent($scope.profile.address.city) + "," + encodeURIComponent($scope.profile.address.country);
        $scope.currentProjectUrl = $sce.trustAsResourceUrl($scope.profile.mapq);
        $scope.profile.img = 'https://s3.amazonaws.com/housebook-uploads/20161206_163310.jpg';
        loadThumbnail();

    }, function (err) {
        console.log(err);
    });

    function readURL(input) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();
            $scope.selectedProfilePicture = input.files[0];

            reader.onload = function (e) {
                var canvas = document.createElement('canvas');
                var img = document.getElementById("test-profile-picture");
                img.src = e.target.result;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                var MAX_WIDTH = 200;
                var MAX_HEIGHT = 200;
                var width = img.width;
                var height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                img.src = canvas.toDataURL("image/png");
                $scope.profileThumbnail = canvas.toDataURL("image/png");
                img.crossorigin = 'Anonymous';
                $scope.$apply();
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    $scope.savePicture = function () {
        var file = document.getElementById('file').files[0];
        HouseProfileSvc.savePicture($routeParams.id, file.name, file.type, file, true, $rootScope.user._id).then(function () {
            var img = document.getElementById('house-profile-picture');
            img.src = $scope.profileThumbnail;
        });

        $('#basicPropertiesModal').modal('hide');
    };

    $(function () {
        $("input#file").change(function () { //set up a common class
            readURL(this);
        });


    });

    function loadThumbnail() {
        var canvas = document.getElementById("house-profile-canvas");
        var ctx = canvas.getContext("2d");

        var img = new Image();
        img.crossOrigin = "Anonymous"; //cors support
        img.onload = function () {
            var W = img.width;
            var H = img.height;
            canvas.width = W;
            canvas.height = H;
            ctx.drawImage(img, 0, 0); //draw image
            var time1 = Date.now();

            //resize
            resample_single(canvas, 400, 300, true);

        };
        img.src = $scope.profile.profilePicture ? 'https://s3.amazonaws.com/housebook-uploads/' + $scope.profile.profilePicture.path : '/img/test.jpg';
    }
});