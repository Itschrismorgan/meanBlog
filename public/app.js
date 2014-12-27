/**
 * Created by chrismorgan on 12/12/14.
 */
var blog = angular.module('blog',['ngRoute']);

blog.controller('MainCtrl',['$scope','$rootScope', function($scope,$rootScope){
    $scope.beginIndex = 0;
    $scope.endIndex = 4;
    $scope.previewCountToShow = 4;
    $rootScope.currentYear = new Date().getFullYear();
}]);

blog.service('postService', ['$http','authService', function($http, authService){
    var postUrl = '/api/posts';

    this.getPreviews = function(beginIndex,endIndex){
        return $http.get(postUrl+"?index="+beginIndex+"&count="+(endIndex-beginIndex))
            .success(function(data){
                return data;
                })
            .error(function(e){
                return e.message;
            });
    };

    this.getPost = function(id){
        return $http.get(postUrl+"/"+id)
            .success(function(data){
                return data;
            })
            .error(function(e){
                return e.message;
            });
    };

    this.getPostsHeaders = function(){
        return $http.get(postUrl)
            .success(function(data){
                return data;
            })
            .error(function(e){
                return e.message;
            });
    };

    this.updatePost = function(postJson){
        var reqUrl = postUrl+"/"+postJson.slug;
        var req = {
            method: "POST",
            url: reqUrl,
            headers: {"Authorization":"Bearer "+authService.getToken().token},
            data: postJson
        };
        return $http(req)
            .success(function(data){
                return data;
            })
            .error(function(e){
                return e.message;
            })
    };

    this.createPost = function(postJson){
        var reqUrl = postUrl+"/"+postJson.slug;
        var req = {
            method: "POST",
            url: reqUrl,
            headers: {"Authorization":"Bearer "+authService.getToken().token},
            data: postJson
        };
        return $http(req)
            .success(function(data){
                return data;
            })
            .error(function(e){
                return e.message;
            })
    };
}]);

blog.service('authService',['$http', function($http){
    var token = {};


    this.authorize = function(username, password){
        return $http.post('/authenticate',{username: username, password: password})
            .success(function(data){
                token = data;
                return true;
            })
            .error(function(e){
                return e;
            });
    };

    this.getToken = function(){
        return token;
    };

    this.tokenExist = function(){
        if (token.token)
            return true;
        else
            return false;
    };

    this.clearToken = function(){
        token = {};
    };
}]);

blog.controller('LoginCtrl',['$scope','authService','$location', function($scope, authService, $location){
    $scope.loginMessage = "Please login...";
    $scope.messageStyle = "informationalBox";

    $scope.authenticate = function(){
        authService.authorize($scope.login.username,$scope.login.password)
            .then(function(data){
                $scope.loginMessage = "You have succesfully logged in...";
                $scope.messageStyle = "successBox";
                $scope.login.username = "";
                $scope.login.password = "";
                $location.url("/user");
            },function(error){
                if (error.data.code >= 400 && error.data.code <= 500){
                    $scope.loginMessage = error.data.message;
                    $scope.messageStyle = 'errorBox';
                }
                $scope.login.username = "";
                $scope.login.password = "";
            });
    };

}]);


blog.controller('IndexCtrl',['$scope', '$sce','postService',function($scope, $sce, postService){

    var callGetPreviews = function(beginIndex,endIndex){
        postService.getPreviews(beginIndex,endIndex)
            .then(function(posts){
                for(var x=0;x<posts.data.length;x++){
                    posts.data[x].postPreview = $sce.trustAsHtml(posts.data[x].postPreview);
                }
                $scope.posts = posts.data;
            }, function(error){
                console.log(error);
            });
    };


    callGetPreviews($scope.beginIndex, $scope.endIndex);

    $scope.goLeft = function(){
        $scope.beginIndex -= $scope.previewCountToShow;
        $scope.endIndex -= $scope.previewCountToShow;
        callGetPreviews($scope.beginIndex, $scope.endIndex);
    };

    $scope.goRight = function(){
        $scope.beginIndex += $scope.previewCountToShow;
        $scope.endIndex += $scope.previewCountToShow;
        callGetPreviews($scope.beginIndex, $scope.endIndex);
    };
}]);

blog.controller('PostCtrl',['$scope', '$routeParams','$sce','postService', 'authService', function($scope, $routeParams, $sce, postService, authService){
    postService.getPost($routeParams._id)
        .then(function(post){
            post.data.postText = $sce.trustAsHtml(post.data.postText);
            $scope.post = post.data;
        }, function(error){
            console.log(error);
        });


    $scope.isLoggedIn = function(){
        return authService.tokenExist();
    };
}]);

blog.controller('EditCtrl',['$scope', '$routeParams','$sce','postService', 'authService', '$location', function($scope, $routeParams, $sce, postService, authService, $location){

    postService.getPost($routeParams._id)
        .then(function(post){
            post.data.tags = post.data.tags.join(',');
            $scope.post = post.data;
        }, function(error){
            console.log(error);
        });

    $scope.updatePost = function(){
        var tagArray = $scope.post.tags.split(',');

        var postToUpdate = {
            'slug': $scope.post._id,
            'title': $scope.post.title,
            'author': $scope.post.author,
            'preview': $scope.post.postPreview,
            'post': $scope.post.postText,
            'tags': tagArray
        };

        postService.updatePost(postToUpdate)
            .then(function(post){
                $location.url("/post/"+post.data._id);
            }, function(error){
                console.log(error);
            });
    };

    $scope.isLoggedIn = function(){
        return authService.tokenExist();
    };
}]);


blog.controller('CreateCtrl',['$scope','postService', 'authService', '$location', function($scope, postService, authService, $location){
    $scope.createPost = function(){
        var tagArray = $scope.post.tags.split(',');

        var postToCreate = {
            'slug': $scope.post._id,
            'title': $scope.post.title,
            'author': $scope.post.author,
            'preview': $scope.post.postPreview,
            'post': $scope.post.postText,
            'tags': tagArray
        };

        postService.createPost(postToCreate)
            .then(function(post){
                $location.url("/post/"+post.data._id);
            }, function(error){
                console.log(error);
            });
    };

    $scope.isLoggedIn = function(){
        return authService.tokenExist();
    };
}]);

blog.controller('UserCtrl',['$scope', 'postService', 'userService', '$location', function($scope, postService, userService, $location){
    userService.getUserInfo()
        .then(function(user){
            $scope.userInfo = user.data;
        }, function(error){
            console.log(error);
        });

    postService.getPostsHeaders()
        .then(function(posts){
            $scope.posts = posts.data;
        }, function(error){
            console.log(error);
        });

    $scope.logout = function(){
        userService.logout();
        $location.url('/');
    }
}]);

blog.controller('CreateUserCtrl',['$scope', 'userService', function($scope, userService){
    $scope.createUser = function(){
        var userToCreate = {
            username: $scope.user.username,
            firstName: $scope.user.firstName,
            lastName: $scope.user.lastName,
            password: $scope.user.password
        };

        console.log(userToCreate);

        userService.createUser(userToCreate)
            .then(function(data){
                console.log(data);
            }, function(error){
                console.log(error);
            })
    }
}]);

blog.service('userService',['authService','$http', function(authService,$http){
    this.getUserInfo = function(){
        var req = {
            method: "GET",
            url: "/api/user",
            headers: {"Authorization":"Bearer "+authService.getToken().token}
        };

        return $http(req)
            .success(function(data){
                return data;
            })
            .error(function(e){
                return e;
            });
    };

    this.createUser = function(userToCreate){
        var req = {
            method: "POST",
            url: "/api/user",
            headers: {"Authorization":"Bearer "+authService.getToken().token},
            data: userToCreate
        };

        return $http(req)
            .success(function(data){
                return data;
            })
            .error(function(e){
                return e;
            });
    };

    this.logout = function(){
        authService.clearToken();
    }
}]);


blog.config(function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'views/home.html',
            controller: 'IndexCtrl'
        }).
        when('/about',{
            templateUrl: 'views/about_partial.html'
        }).
        when('/post/create',{
            templateUrl: 'views/create_post_partial.html',
            controller: 'CreateCtrl'
        }).
        when('/post/:_id',{
            templateUrl: 'views/post_partial.html',
            controller: 'PostCtrl'
        }).
        when('/photos',{
            templateUrl: 'views/photos_partial.html',
        }).
        when('/login',{
            templateUrl: 'views/login_partial.html',
            controller: 'LoginCtrl'
        }).
        when('/user',{
            templateUrl: 'views/user_portal.html',
            controller: 'UserCtrl'
        }).
        when('/user/create',{
            templateUrl: 'views/create_user_partial.html',
            controller: 'CreateUserCtrl'
        }).
        when('/post/edit/:_id',{
            templateUrl: 'views/edit_post_partial.html',
            controller: 'EditCtrl'
        }).
        otherwise('/');

});
