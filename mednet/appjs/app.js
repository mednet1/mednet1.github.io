var myApp = angular.module('myApp',['ui.bootstrap','ngTable','nvd3','ngRoute','ngSanitize','myAppControllers','myAppDirectives']);
myApp.config(['$routeProvider', function($routeProvider) {
                $routeProvider.when("/", {templateUrl: "partials/dashboard.html"});
                $routeProvider.when("/table", {templateUrl: "partials/table.html"});
                $routeProvider.otherwise({redirectTo: '/'});
                }]);
