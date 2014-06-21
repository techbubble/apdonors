'use strict';


function onRun(module, $rootScope, $http, $window, $filter, $location) {
	$rootScope.safeApply = function (fn) {
	        var phase = this.$$phase;
	        if(phase == '$apply' || phase == '$digest') {
	            if(fn && (typeof(fn) === 'function')) {
	                fn();
	            }
	        } else {
	            this.$apply(fn);
	        }
	    };
	
	$rootScope.isActive = function (viewLocation) {
		 var currentPath = $location.path();
		 if(currentPath === undefined || currentPath === null || currentPath === '')
			currentPath = '/';
	     var active = (viewLocation === currentPath);
	     return active;
	};
}

// Declare app level module which depends on filters, and services
angular.module('drywall-angular', ['ngRoute', 'ngAnimate', 'drywall-angular.filters', 'drywall-angular.services', 'drywall-angular.directives', 'drywall-angular.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: '/angular/partials/index',
      controller: 'StaticController'
    });
	$routeProvider.when('/about', {
      templateUrl: '/angular/partials/about',
      controller: 'StaticController'
    });
    $routeProvider.otherwise({
      redirectTo: '/'
    });
  }])
.run(['$rootScope', '$http', '$window', '$filter', '$location', function($rootScope, $http, $window, $filter, $location) { 
	onRun('main', $rootScope, $http, $window, $filter, $location); 
}]);
