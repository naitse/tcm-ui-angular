//var  basePath =  "http://tcm-backend.herokuapp.com/";
var  basePath =  "http://localhost:9000/";

tcmModule.service('Auth', ['$http', '$cookieStore' , function($http, $cookieStore){

    var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles
        , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };

    //$cookieStore.remove('user');

    function changeUser(user) {
        _.extend(currentUser, user);
    };

    return {

        authorize: function(accessLevel, role) {
            if(role === undefined)
                role = currentUser.role;
            return accessLevel.bitMask & role.bitMask;
        },
        isLoggedIn: function(user) {
            if(user === undefined)
                user = currentUser;
            return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title;
        },
        login: function(user, success, error) {

            $http.defaults.headers.common['Authorization'] = "Basic " + $.base64.encode(user.username + ':' + user.password);

            $http.post(basePath + 'api/login').success(function(data){
                changeUser(user);
                success(user);

           }).error(error);
        },
        logout: function(success) {

            changeUser({
                username: '',
                role: userRoles.public
            });
            success();

        },
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
    };
}]);

