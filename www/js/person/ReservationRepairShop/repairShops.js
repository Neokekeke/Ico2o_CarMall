/**
 * Created by fan on 2016/9/18 .
 */
angular.module('ico2o.controllers.repairShop', [])
  .controller('repairShops', function ($scope,$state,$http,$cacheFactory,$rootScope) {
    $http({
      method: "post",
      url: $rootScope.host +"/ASHX/MobileAPI/Maintenance/NearMaintenance.ashx",
      params: {
        longitude: 113.543526,
        latitude: 22.352852
      }
    }).success(function (response) {
      $scope.repairShop = response;
    });

    var reservationService_cache = $cacheFactory.get("reservationService_cache");  //声明一个user_cache缓存对象

    $scope.goReservationService = function (rShop) {
      $state.go('tab.reservationService');
      reservationService_cache.put("rShop",rShop);    //放入缓存对象
      reservationService_cache.remove("item"); //类似清空缓存
      reservationService_cache.remove("itemID"); //类似清空缓存
    }
  });
