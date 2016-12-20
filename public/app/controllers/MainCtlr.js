housebook.controller('MainCtlr', function ($scope, $rootScope) {
    $scope.formSent = false;

    $scope.initContactForm = function () {
        _.defer(function () {
            $scope.formSent = false;
            $("form[name='contactForm']").trigger("reset");
            $scope.$apply();
            $('#modal-feedback').modal('show');
        });

    };

    $scope.sentMail = function (email, message) {
        $.ajax({
            url: "/mail",
            method: "POST",
            data: {content: message, subject: "New contact form pilot application", replyTo: email},
            dataType: "json"
        }).then(function () {
            _.defer(function () {
                $scope.$apply();
            });
        });
        $scope.formSent = true;
    };
});