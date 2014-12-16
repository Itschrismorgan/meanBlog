/**
 * Created by chrismorgan on 12/12/14.
 */
var blog = angular.module('blog',['ngRoute']);





blog.controller('MainCtrl',['$scope',function($scope){
    $scope.beginIndex = 0;
    $scope.endIndex = 3;
}]);

blog.service('postService', ['$http','$q', function($http, $q){
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
}]);

blog.controller('IndexCtrl',['$scope','postService',function($scope, postService){

    //console.log($scope.beginIndex);
    postService.getPreviews($scope.beginIndex,$scope.endIndex)
        .then(function(posts){
                $scope.posts = posts.data;
            }, function(error){
                console.log(error);
            });


}]);


blog.config(function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'views/home.html',
            controller: 'IndexCtrl'
        });

});
