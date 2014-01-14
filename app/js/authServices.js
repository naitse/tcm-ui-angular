var basePath = "http://tcm.test-lab.ch:7777/";
//var  basePath =  "http://ec2-54-197-79-64.compute-1.amazonaws.com:7777/";
//var  basePath =  "http://localhost:9000/";

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

            $http.post(basePath + 'api/login').success(function(data){

                if(data.admin === 1){
                    user.role = userRoles.admin;
                }
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

