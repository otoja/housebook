housebook.controller('LoginCtlr', function ($scope, $rootScope, $location, AuthSvc) {

    $scope.login = function (username, password) {
        AuthSvc.login(username, password).then(function (response) {
            localStorage.setItem('token', response.data);
            _.defer(function () {
                AuthSvc.getUser().then(function (response) {
                    $rootScope.user = response.data;
                    $location.path('house');
                    $rootScope.$apply();
                });
            });


        });
    };

    $scope.signUp = function (user) {
        AuthSvc.signUp(user).then(function (response) {
            $scope.user = user;
            $location.path('/login');
        });
    };

    $scope.logOut = function () {
        _.defer(function () {
            $rootScope.user = null;
            AuthSvc.signOut();
            $rootScope.$apply();
        });
    };
    


});