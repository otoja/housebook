housebook.controller('HouseCtlr', function ($scope, $rootScope, $location, HouseProfileSvc) {
    $scope.houses = $rootScope.user ? $rootScope.user.createdHouseProfile : [];

    $scope.defaultHouseSpace = {_id: -1, name: "default house space", description: "Demo house profile"};

    $scope.goToCreateProfilePage = function () {
        $location.path('/house/create');
        return false;
    };

    $scope.saveHouseProfile = function (profile) {
        console.log(JSON.stringify(profile));
        HouseProfileSvc.createProfile(profile).then(function (response) {
            $location.path('/house/'+response.data);
            return false;
        });
    };
});