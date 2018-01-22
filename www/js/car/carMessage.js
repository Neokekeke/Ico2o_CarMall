/**
 * Created by zhang on 2016/10/18.
 */
angular.module('ico2o.controllers.carMessageCtrl', [])
  .controller('carMessageCtrl',function($state,$cacheFactory,$scope,$stateParams,$rootScope,$http,$ionicHistory,locals){
    var url_deleteCar = $rootScope.host + "/ASHX/MobileAPI/MyCars/Delete.ashx";
    var url_updateDefault = $rootScope.host + "/ASHX/MobileAPI/MyCars/UpdateDefault.ashx";
    $scope.car = $cacheFactory.get("carCache").get("car");
    var date = new Date($scope.car.LastMaintenanceDate);
    var date2 = new Date($scope.car.LastMaintenanceDate);
    var date3 = new Date($scope.car.CreatedDate);
    $scope.CreatedDate = date3.getFullYear()+"-"+(date3.getMonth()+1)+"-"+date3.getDate();
    date2.setMonth(date.getMonth()+7);
    $scope.LastMaintenanceDate = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    $scope.NextMaintenanceDate = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
    $scope.deleteCar = function(){
      $http({
        method: 'post',
        url:url_deleteCar,
        params: {
          CarIncludedID: $scope.car.ID
        }
      }).success(function (response) {
        alert("删除成功");
        $ionicHistory.goBack();
      })
    };
    $scope.UpdateDefault = function(){
      $http({
        method: 'post',
        url:url_updateDefault,
        params: {
          CarIncludedID: $scope.car.ID,
          UserID:$rootScope.UserID
        }
      }).success(function (response) {
        alert("修改成功");
      })
    };
    $scope.goOilRecord = function(){
        $state.go("tab.carOilHistory");
    }
  });
