var housebook = angular.module('housebook', ['ngRoute']);

housebook.config(function ($routeProvider) {
    $routeProvider
            .when('/', {templateUrl: 'partials/start.html'})
            .when('/register', {controller: 'RegisterCtlr', templateUrl: 'partials/register.html'})
            .when('/login', {controller: 'LoginCtlr', templateUrl: 'partials/login.html'})
            .when('/logout', {controller: 'LoginCtlr', templateUrl: 'partials/logout.html'})
            .when('/welcome', {controller: 'LoginCtlr', templateUrl: 'partials/start.html'})
            .when('/house', {controller: 'HouseCtlr', templateUrl: 'partials/houseSplashScreen.html'})
            .otherwise({redirectTo: '/'});
});

housebook.run(function ($rootScope, $location, AuthSvc) {
    $rootScope.$on("$locationChangeStart", function (event, next, current) {
        if (AuthSvc.sessionIsValid()) {
            _.defer(function () {
                $rootScope.user = AuthSvc.getUser().$$state.value;
                $location.path("/house");
            });
        }
    });
});