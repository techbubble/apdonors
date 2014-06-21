'use strict';

/* Directives */


angular.module('drywall-angular.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);