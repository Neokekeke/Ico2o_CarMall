/**
 * Created by huang on 2016/9/13 0013.
 */
angular.module('ico2o.controllers.carRecordCtrl', [])
  .controller('carRecordCtrl',function($scope,$state, $stateParams){
    $scope.car = angular.fromJson($stateParams.car);
  });
