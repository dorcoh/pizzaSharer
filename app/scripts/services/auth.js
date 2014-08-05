'use strict';

app.factory('Auth', function($firebaseSimpleLogin, FIREBASE_URL, $rootScope) {
    var ref = new Firebase(FIREBASE_URL);

    var auth = $firebaseSimpleLogin(ref);

    var Auth = {
        login: function(provider) {
            return auth.$login(provider);
        },
        signedIn: function() {
            return auth.user !== null;
        },
        logout: function() {
            auth.$logout();
        }
    };

    $rootScope.signedIn = function() {
        return Auth.signedIn();
    };

    $rootScope.logout = function() {
        return Auth.logout().then(function() {
            $location.path('/');
        }) ;
    };

    $rootScope.$on('$firebaseSimpleLogin:login', function() {
        $rootScope.username = auth.user.displayName;
    });

    return Auth;
});