var housebook = angular.module('housebook', ['ngRoute', 'angular-loading-bar', 'ui.bootstrap']);

housebook.config(function ($routeProvider, $locationProvider, cfpLoadingBarProvider, $httpProvider) {

    $httpProvider.interceptors.push('AuthHttpInterceptor');

    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.latencyThreshold = 500;
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';

    $locationProvider.html5Mode(false);

    $routeProvider
            .when('/welcome', {
                controller: 'LoginCtlr',
                templateUrl: 'partials/start.html',
                resolve: {
                    auth: function (AuthSvc, $rootScope, $location) {
                        revalidateSession(AuthSvc, $rootScope, $location, true);
                    }
                }
            })
            .when('/house/create', {controller: 'HouseCtlr', templateUrl: 'partials/createHouseProfile.html', resolve: {
                    auth: function (AuthSvc, $rootScope, $location) {
                        revalidateSession(AuthSvc, $rootScope, $location, false);
                    }
                }})
            .when('/house/:id/:partial?', {constroller: 'HouseCtlr', templateUrl: 'partials/houseProfile.html', resolve: {
                    auth: function (AuthSvc, $rootScope, $location) {
                        revalidateSession(AuthSvc, $rootScope, $location, false);
                    }
                }})
            .when('/house', {controller: 'HouseCtlr', templateUrl: 'partials/houseSplashScreen.html', resolve: {
                    auth: function (AuthSvc, $rootScope, $location) {
                        revalidateSession(AuthSvc, $rootScope, $location, false);
                    }
                }})
            .when('/user/change-password/:token?', {controller: 'LoginCtlr',templateUrl: 'partials/forms/account/changePassword.html'})
            .when('/user/reset-password', {controller: 'HouseCtlr', templateUrl: 'partials/forms/account/resetPassword.html'})
            .otherwise({redirectTo: '/welcome'});
});

function revalidateSession(AuthSvc, $rootScope, $location, isWelcomePage) {
    if (AuthSvc.sessionIsValid()) {
        AuthSvc.getUser().then(function (user) {
            $rootScope.user = user;
            if (isWelcomePage) {
                if (user.createdHouseProfile && user.createdHouseProfile.length === 1) {
                    $location.path("/house/" + user.createdHouseProfile[0].ref._id);
                } else {
                    $location.path("/house");
                }
            }

        });
    }
}
