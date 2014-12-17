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
    console.log($routeParams);
    postService.getPost($routeParams._id)
        .then(function(post){
            post.data.postText = $sce.trustAsHtml(post.data.postText);
            $scope.post = post.data;
        }, function(error){
            console.log(error);
        });
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
        otherwise('/');

});
