housebook.service('HouseProfileSvc', function ($q, $http) {
    var obj = {};
    
    obj.getProfile = function (profileId) {
        var defer = $q.defer();
        $http.get('/house/' + profileId, {headers: {'x-auth': localStorage.getItem('token')}}).then(function (response) {
           defer.resolve(response.data);
        });

        return defer.promise;
    };
    
    obj.savePicture = function (profileId, name, type, file, isProfilePicture, createdBy) {
        var defer = $q.defer();

        var data = {profileId: profileId, fileName: name, fileType: type};
        $http({
            method: 'GET',
            url: '/aws/sign-s3',
            params: data,
            headers: {'x-auth': localStorage.getItem('token')}
        }).then(function (response) {
            var fd = new FormData();
            fd.append("file", file);

            $http({
                method: 'PUT',
                url: response.data.signedRequest,
                data: file,
                headers: {'Content-type': file.type}
            }).then(function (uploadResponse) {

                var payload = {fileName: name, contentType: type, isProfilePicture: isProfilePicture, userId: createdBy};

                $http.post('/house/' + profileId, JSON.stringify(payload), {headers: {'x-auth': localStorage.getItem('token')}});
                defer.resolve(uploadResponse);

            }, function (err) {
                defer.reject(err);
            });

        }, function (err) {
            defer.reject(err);
        });

        return defer.promise;
    };

    obj.createProfile = function (profile) {
        return $http.post('/house/', JSON.stringify(profile), {headers: {'x-auth': localStorage.getItem('token')}});
    };



    return obj;
});