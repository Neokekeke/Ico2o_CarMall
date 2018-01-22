/**
 * Created by huang on 2016/9/13 0013.
 */
angular.module('ico2o.controllers.tabCarCtrl', [])
  .controller('tabCarCtrl',function($ionicHistory,$ionicPopup,$cacheFactory,$scope,$http,$state,$rootScope,locals){
    $ionicHistory.clearCache();
    if($cacheFactory.get("carCache")){
      $cacheFactory.get("carCache").destroy();
    }
    $cacheFactory("carCache");
    var url_getMyCars = $rootScope.host + "/ASHX/MobileAPI/MyCars/GetMyCars.ashx";
    if($rootScope.UserID) {
      $http({
        method: 'post',
        url: url_getMyCars,
        params: {
          UserID: $rootScope.UserID
        }
      }).success(function (response1) {
        $scope.cars = response1;
      });
    }
    else{
      $ionicPopup.alert({
        title: '请先登录',
        okText: '确定'
      });
    }

    $scope.open_carRecord = function(car){
      $state.go('tab.carRecord',{car:angular.toJson(car)});
    };

    $scope.goCarMessage = function(car) {
      $state.go("tab.carMessage");
      $cacheFactory.get("carCache").put("car", car);
    }
  });
