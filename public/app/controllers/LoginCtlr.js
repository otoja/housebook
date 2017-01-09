housebook.controller('LoginCtlr', function ($scope, $rootScope, $location, $window, AuthSvc, $routeParams) {

    $scope.isResetPassword = $routeParams.token != undefined;
    $scope.resetPasswordTokenIsValid = true;
    $scope.formSent = false;
    $scope.success = false;

    if ($scope.isResetPassword) {
        $scope.validationError = null;
        AuthSvc.validateResetPasswordHash($routeParams.token)
                .success(function (username) {
                    $scope.username = username;
                })
                .error(function (err) {
                    $scope.resetPasswordTokenIsValid = false;
                    $scope.validationError = err;
                });
    }

    $scope.login = function (username, password) {
        AuthSvc.login(username, password)
                .then(function (response) {
                    $window.localStorage.setItem('token', response.data);
                    _.defer(function () {
                        AuthSvc.getUser()
                                .success(function (response) {
                                    $rootScope.user = response.data;
                                    $location.path('house');
                                })
                                .error(function (err) {
                                    $scope.validationError = err;
                                });
                    });
                })
                .catch(function (err) {
                    $scope.validationError = {msg:err.msg?err.msg:err.data};
                });
    };

    $scope.signUp = function (user) {
        AuthSvc.signUp(user).then(function (response) {
            AuthSvc.login(user.username, user.password)
                    .success(function (response) {
                        $window.localStorage.setItem('token', response.data);
                        _.defer(function () {
                            AuthSvc.getUser().then(function (response) {
                                $rootScope.user = response.data;
                                $location.path('house');
                            });
                        });
                    })
                    .error(function (err) {
                        $scope.validationError = err;
                    });
        }, function (err) {
            $scope.validationError = err.data;
        });
    };

    $scope.logOut = function () {
        _.defer(function () {
            $rootScope.user = null;
            AuthSvc.logout();
            $scope.$apply();
        });
    };

    $scope.changePassword = function (username, password) {
        $scope.formSent = true;
        AuthSvc.changePassword(username, password, $scope.isResetPassword)
                .success(function (response) {
                    $scope.success = true;
                    localStorage.setItem('token', response);
                })
                .error(function (err) {
                    $scope.success = false;
                    $scope.errMsg = err;
                });
    };

});