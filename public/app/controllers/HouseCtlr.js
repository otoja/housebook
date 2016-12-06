housebook.controller('HouseCtlr', function ($scope, $rootScope) {
    $scope.houses = $rootScope.user ? $rootScope.user.createdHouseProfile : [];
    $scope.defaultHouseSpace = {_id: -1, name: "default house space", description: "Demo house profile"};


    function readURL(input) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var canvas = document.createElement('canvas');
                var img = document.getElementById("userImg");
                img.src = e.target.result;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                var MAX_WIDTH = 250;
                var MAX_HEIGHT = 250;
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
                img.crossorigin = 'Anonymous';
                $scope.defaultHouseSpace.img = canvas.toDataURL("image/png");
                $scope.$apply();
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    $(function () {
        $("input#file").change(function () { //set up a common class
            readURL(this);
        });
    });

    $scope.openProfile = function (id) {
        console.log("open profile;");
    };
});