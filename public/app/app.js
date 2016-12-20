var housebook = angular.module('housebook', ['ngRoute']);

housebook.config(function ($routeProvider) {
    $routeProvider
            .when('/welcome', {templateUrl: 'partials/start.html'})
            .when('/register', {controller: 'RegisterCtlr', templateUrl: 'partials/register.html'})
            .when('/login', {controller: 'LoginCtlr', templateUrl: 'partials/login.html'})
            .when('/logout', {controller: 'LoginCtlr', templateUrl: 'partials/logout.html'})
            .when('/welcome', {controller: 'LoginCtlr', templateUrl: 'partials/start.html'})
            .when('/house/create', {controller: 'HouseCtlr', templateUrl: 'partials/createHouseProfile.html'})
            .when('/house/:id', {constroller: 'HouseCtlr', templateUrl: 'partials/houseProfile.html'})
            .when('/house', {controller: 'HouseCtlr', templateUrl: 'partials/houseSplashScreen.html'})
            .otherwise({redirectTo: '/welcome'});
});

housebook.run(function ($rootScope, $timeout, $location, AuthSvc) {
    $rootScope.$on("$locationChangeStart", function (event, next, current) {
        if (AuthSvc.sessionIsValid()) {
            _.defer(function () {
                $rootScope.user = AuthSvc.getUser().$$state.value;
                var location = next.split("#");
                if (location[1] && (location[1] === "/") || location[1] === "/welcome")
                    $location.path("/house");
            });
        }
    });

    $rootScope.$on('$viewContentLoaded', function () {
        if (AuthSvc.sessionIsValid()) {
            _.defer(function () {
                $timeout(function () {
                    $rootScope.user = AuthSvc.getUser().$$state.value;
                    $rootScope.$apply();
                });

            });
        }
    });
});