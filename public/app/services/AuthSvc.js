housebook.service('AuthSvc', function ($q, $http, $location) {
    var obj = {};
    obj._sessionIsValid = false;

    obj.login = function (username, password) {
        var defered = $q.defer();
        $http.post('/session', {username: username, password: password}).then(function (token) {
            defered.resolve(token);
            this._sessionIsValid = true;
        }, function (err) {
            defered.reject(err);
        });
        return defered.promise;

    };
    obj.signUp = function (model) {
        return $http.post('/users', JSON.stringify(model));
    };
    obj.logout = function () {
        this._sessionIsValid = false;
    };
    obj.getUser = function () {
        var defer = $q.defer();
        if (localStorage.getItem('user')) {
            var user = JSON.parse(localStorage.getItem('user'));
            defer.resolve(user);
        }


        $http.get('/users', {headers: {'x-auth': localStorage.getItem('token')}}).then(function (response) {
            localStorage.setItem('user', JSON.stringify(response.data));
            defer.resolve(response.data);
        }, function (err) {
            defer.reject(err);
        });

        return defer.promise;
    };
    obj.sessionIsValid = function () {
        return localStorage.getItem('token') !== null;
    };
    obj.signOut = function () {
        localStorage.removeItem('token');
        $location.path('/welcome');
        return false;
    };

    return obj;
});