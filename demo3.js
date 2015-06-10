angular.module('phonecatApp', ['ui.bootstrap', 'holyscroll'])

.controller('PhoneListCtrl',  function ($scope, $http) {
    var perPage = 10;

    var nextPage;
    $scope.maxSize = 5;
    $scope.totalPages = 175;


    $scope.loadPhones = function(page, cb) {
        var url = "http://api.reddit.com/hot?after=" + nextPage + "&jsonp=JSON_CALLBACK";
        $http.jsonp(url).success(function(data) {
            nextPage = data.data.after;
            cb(data.data.children);
        });
        console.log(page);
    }
});