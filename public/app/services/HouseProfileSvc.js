housebook.service('HouseProfileSvc', function ($q, $http) {
    var obj = {};
    obj.getProfile = function (profileId) {
        var defer = $q.defer();
        $http.get('/house/' + profileId, {headers: {'x-auth': localStorage.getItem('token')}}).then(function (response) {
            $http.get('/img/' + profileId + '/thumbnail.png')
                    .success(function () {
                        response.data.thumbnail = '/img/' + profileId + '/thumbnail.png';
                        defer.resolve(response.data);
                    })
                    .error(function () {
                        response.data.thumbnail = '/img/test.jpg';
                        defer.resolve(response.data);
                    });
        });

        return defer.promise;
    };
    obj.saveProfilePicture = function (profileId, thumbnailData, picture) {
        var data = {thumbnail: thumbnailData};
        return $http({
            method: 'POST',
            url: '/house/' + profileId,
            data: $.param(data),
            headers: {'x-auth': localStorage.getItem('token'), 'Content-Type': 'application/x-www-form-urlencoded'}
        });
    };

    obj.createProfile = function (profile) {
        return $http.post('/house/', JSON.stringify(profile), {headers: {'x-auth': localStorage.getItem('token')}});
    };

    return obj;
});