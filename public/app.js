/**
 * Created by chrismorgan on 12/12/14.
 */
var blog = angular.module('blog',['ngRoute']);





blog.controller('MainCtrl',['$scope','postService',function($scope, postService){

    this.beginIndex = 0;
    this.endIndex = 10;

    var postPromise = postService.getPreviews(this.beginIndex,this.endIndex);
    postPromise.then(function(posts){console.log(posts);$scope.posts = posts.data;},function(error){console.log(error);});


}]);

blog.service('postService', ['$http','$q', function($http, $q){
    var postUrl = '/api/posts';

    this.getPreviewsQ = function(beginIndex,endIndex){
        var deferred = $q.defer();
        //+"?index="+beginIndex+"&count="+(endIndex-beginIndex)
        $http.get(postUrl)
            .success(function(data){
                deferred.resolve(data);})
            .error(function(e){
                deferred.reject(e);
            });
        return deferred.promise;
    }

    this.getPreviews = function(beginIndex,endIndex){
        //+"?index="+beginIndex+"&count="+(endIndex-beginIndex)
        return $http.get(postUrl)
            .success(function(data){
                console.log('success');
                console.log(data);
                return data;
                })
            .error(function(e){
                return e.message;
            });
    }


}]);

blog.config(function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainCtrl'
        });

});
