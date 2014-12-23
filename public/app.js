/**
 * Created by chrismorgan on 12/12/14.
 */
var blog = angular.module('blog',['ngRoute']);





blog.controller('MainCtrl',['$scope','$rootScope', function($scope,$rootScope){
    $scope.beginIndex = 0;
    $scope.endIndex = 3;
    $rootScope.currentYear = new Date().getFullYear();
}]);

blog.service('postService', ['$http', function($http){
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
        console.log('making call for post: '+id);
        return $http.get(postUrl+"/"+id)
            .success(function(data){
                return data;
            })
            .error(function(e){
                return e.message;
            });
    }

    this.getPostsHeaders = function(){
        return $http.get(postUrl)
            .success(function(data){
                return data;
            })
            .error(function(e){
                return e.message;
            });
    }
}]);

blog.service('authServ',['$http', function($http){
    var token = {};


    this.authorize = function(username, password){
        return $http.post('/authenticate',{username: username, password: password})
            .success(function(data){
                console.log('client side success');
                console.log(data);
                token = data;
                return true;
            })
            .error(function(e){
                //console.log('client side error');
                //console.log(e);
                return e;
            });
    };

    this.getToken = function(){
        return token;
    };

    this.clearToken = function(){
        token = {};
    };
}]);

blog.controller('LoginCtrl',['$scope','authServ', function($scope, authService){
    $scope.loginMessage = "Please login...";
    $scope.messageStyle = "informationalBox";

    $scope.authenticate = function(){
        authService.authorize($scope.login.username,$scope.login.password)
            .then(function(data){
                $scope.loginMessage = "You have succesfully logged in...";
                $scope.messageStyle = "successBox";
                //TODO: redirect to user page after time delay
    //            $scope.login.username = "";
  //              $scope.login.password = "";
                console.log(authService.getToken().token);
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
    //console.log($scope.beginIndex);
    postService.getPreviews($scope.beginIndex,$scope.endIndex)
        .then(function(posts){
                for(var x=0;x<posts.length;x++){
                    posts[x].data.preview = $sce.trustAsHtml(posts[x].data.preview);
                }
                $scope.posts = posts.data;
            }, function(error){
                console.log(error);
            });
}]);

blog.controller('PostCtrl',['$scope', '$routeParams','$sce','postService', function($scope, $routeParams, $sce, postService){
    //console.log($routeParams);
    postService.getPost($routeParams._id)
        .then(function(post){
            post.data.postText = $sce.trustAsHtml(post.data.postText);
            $scope.post = post.data;
        }, function(error){
            console.log(error);
        });
}]);

blog.controller('UserCtrl',['$scope', 'postService', 'userService', function($scope, postService, userService){
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

    $scope.clearToken = function(){
        userService.clearToken();
    }
}]);

blog.service('userService',['authServ','$http', function(authService,$http){
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
        otherwise('/');

});
