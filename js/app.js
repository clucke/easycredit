var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "views/login.html"
    })
    .when("/home", {
        templateUrl : "views/home.html"
    });
});
// Se utiliza para pasar el nombre del usuario de un controlador a otro
app.factory("datos", function() {
    return {
        usuario:''
    };
  });