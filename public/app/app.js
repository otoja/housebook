var housebook = angular.module('housebook', ['ngRoute']);

housebook.config(function ($routeProvider) {
    $routeProvider
            .when('/welcome', {
                controller: 'LoginCtlr',
                templateUrl: 'partials/start.html',
                resolve: {
                    auth: function (AuthSvc, $rootScope, $location) {
                        if (AuthSvc.sessionIsValid()) {
                            AuthSvc.getUser().then(function (user) {
                                $rootScope.user = user;
                                $location.path("/house");
                            });
                        }
                    }
                }
            })
            .when('/register', {controller: 'RegisterCtlr', templateUrl: 'partials/register.html'})
            .when('/login', {controller: 'LoginCtlr', templateUrl: 'partials/login.html'})
            .when('/logout', {controller: 'LoginCtlr', templateUrl: 'partials/logout.html'})
            .when('/house/create', {controller: 'HouseCtlr', templateUrl: 'partials/createHouseProfile.html'})
            .when('/house/:id', {constroller: 'HouseCtlr', templateUrl: 'partials/houseProfile.html', resolve: {
                    auth: function (AuthSvc, $rootScope, $location) {
                        if (AuthSvc.sessionIsValid()) {
                            AuthSvc.getUser().then(function (user) {
                                $rootScope.user = user;
                            });
                        }
                    }
                }})
            .when('/house', {controller: 'HouseCtlr', templateUrl: 'partials/houseSplashScreen.html', resolve: {
                    auth: function (AuthSvc, $rootScope, $location) {
                        if (AuthSvc.sessionIsValid()) {
                            AuthSvc.getUser().then(function (user) {
                                $rootScope.user = user;
                                $location.path("/house");
                            });
                        }
                    }
                }})
            .otherwise({redirectTo: '/welcome'});
});
