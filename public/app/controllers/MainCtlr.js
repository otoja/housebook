housebook.controller('MainCtlr', function($scope, $rootScope){
    $scope.formSent = false;
    
    $scope.sentMail=function(name,email,message){
        $.ajax({
            url: "https://formspree.io/shagrin84@gmail.com",
            method: "POST",
            data: {message: message, _subject: "New contact form pilot application", replyTo: email},
            dataType: "json"
        }).then(function () {
            _.defer(function(){
                $scope.formSent = true;
                $scope.$apply();
            });
            
        });
    };
});