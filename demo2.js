var phonecatApp = angular.module('phonecatApp', ['ui.bootstrap']);

phonecatApp.controller('PhoneListCtrl',  function ($scope) {
    var perPage = 10;

    $scope.maxSize = 15;
    $scope.totalPages = 175;

    $scope.loadPhones = function(page, cb) {
        var items = [];
        for(i=page*perPage-perPage+1; i<=page*perPage; i++) {
            items.push('Phone '+i);
        }
        cb(items);
    }
});