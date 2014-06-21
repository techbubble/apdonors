'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('drywall-angular.services', []).
factory('uiService', ['$timeout', function ($timeout) {
    var service = {
    }
    
	var timeout;
	var loadingNote;
	var isAjaxInProgressStatus = false;
	
	service.logout = function() {
		//TODO: Add Logout logic here
	}
	
	service.setAjaxInProgress = function (isAjaxInProgress) {
	    if (timeout)
	        $timeout.cancel(timeout);

	    if (isAjaxInProgress && !isAjaxInProgressStatus) {
	        isAjaxInProgressStatus = isAjaxInProgress;

	        if (loadingNote)
	            loadingNote.close();

            var loadingDiv = $('.loading');
	        loadingNote = loadingDiv.noty(
	            {
	                layout: 'topCenter',
	                type: 'warning',
	                text: 'Loading...',
	                animation: {
	                    open: { opacity: 'toggle' },
	                    close: { opacity: 'toggle' },
	                    easing: 'swing',
	                    speed: 100 // opening & closing animation speed
	                }
	            });

	        return;
	    }
	    else if (!isAjaxInProgress && isAjaxInProgressStatus) {
	        timeout = $timeout(function () {
	            isAjaxInProgressStatus = isAjaxInProgress;

	            if (loadingNote)
	                loadingNote.close();

	            loadingNote = undefined;
	        }, 500);
	    }
	}

	WatcherService.setRequestWatcher(service.setAjaxInProgress);
	
	// return the local instance when called
    return service;
}])
.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('interceptorService');
}])
.factory('interceptorService', ['$q', 'uiService', function ($q, uiService) {
    var requestCount = 0;
    return {
        // optional method
        'request': function (config) {
            
            if (!isExemptUrl(config.url)) {
                WatcherService.startRequest();
                requestCount++;
            }

            return config;
        },
        // optional method
        'requestError': function (rejection) {
            // do something on error
            if (!isExemptUrl(rejection.config.url)) {
                requestCount--;
                if (requestCount == 0) {
                    WatcherService.stopRequest();
                }
            }
            return $q.reject(rejection);
        },
        // optional method
        'response': function (response) {
            // do something on success
            if (!isExemptUrl(response.config.url)) {
                requestCount--;
                if (requestCount == 0) {
                    WatcherService.stopRequest();
                }
            }
            return response || $q.when(response);
        },

        // optional method
        'responseError': function (rejection) {
            if (!isExemptUrl(rejection.config.url)) {
                requestCount--;
                if(requestCount == 0) {
                    WatcherService.stopRequest();
                }
            }
            uiService.appStateWatcher(null, true);
            if (rejection.status == 403)
                uiService.logout();
            else if (rejection.errorCode != undefined && rejection.errorCode == 1000)
                uiService.logout();
            return $q.reject(rejection);
        }
    }
}]);

function GlobalAjaxWatcher() {
    var httpRequestWatcher = null;

    var service = {};

    service.setRequestWatcher = function (watcher) {
        httpRequestWatcher = watcher;
    }

    service.startRequest = function () {
        if (httpRequestWatcher != null) {
            httpRequestWatcher(true);
        }
    }

    service.stopRequest = function () {
        if (httpRequestWatcher != null) {
            httpRequestWatcher(false);
        }
    }

    return service;
}

var WatcherService = GlobalAjaxWatcher();

//Add URLs that should not trigger the loading sign in the array below
var exemptAjaxLoadingUrls = [];
var isExemptUrl = function (url) {
    // do something on success
    var found = false;
    for (var i = 0; i < exemptAjaxLoadingUrls.length; i++) {
        if (url.toLowerCase() == exemptAjaxLoadingUrls[i]) {
            found = true;
            break;
        }
    }
    return found;
}