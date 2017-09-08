var app = angular.module('MyApp',[]);
app.run(function(){
    console.log("My App is Running!");
});


app.controller('mainCont', function($scope, $http, $location) {
    console.log("This is Main Controller!");
    
    $scope.sendData = function (newuser) {
        console.log(newuser);
        var req = {
            method: 'POST',
            url: 'https://vikii.herokuapp.com/newuser',
            data: newuser
        }
        $http(req).then(function (result) {
            console.log( "Result : " + JSON.stringify(result));
            alert("Hi");
            
        });
    };
    
});