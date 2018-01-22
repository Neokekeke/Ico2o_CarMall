/**
 * Created by huang on 2016/9/13 0013.
 */
angular.module('ico2o.controllers.beautyCareCtrl', [])
.controller('beautyCareCtrl',function($scope){
  //美容护理的事件监听
  $scope.btList = [];
  for (var i = 1; i <= 14; i++) {
    $scope.btList[i] = false;
  }
  $scope.setMRbt = function (id) {
    $scope.btList[id] = !$scope.btList[id];
  }
});
