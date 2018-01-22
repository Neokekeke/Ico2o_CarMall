/**
 * Created by fan on 2016/9/18 .
 */
angular.module('ico2o.controllers.MaintenanceItem', [])
  .controller('MaintenanceItem', function ($http, $scope, $state, $cacheFactory, $ionicHistory,$rootScope) {
    var reservationService_cache = $cacheFactory.get("reservationService_cache");   //取出名为user_cache的缓存对象
    var itemID = reservationService_cache.get("itemID");   //取出缓存对象中键值为lol的对象

    $scope.AllSelectButton = "全选";
    $scope.MaintenanceItem = {};
    //根据维修店选择维修项目
    $http({
      method: 'post',
      url: $rootScope.host +"/ASHX/BnuzNewWebAPI/MaintenanceItem/GetPriceByMaintenanceID.ashx",
      params: {
        MaintenanceID: itemID
      }
    }).success(function (response) {
      $scope.MaintenanceItem = response;
    });

    $scope.refreshItemChecked = function () {
      //存储数组
      $scope.TotalItemPrice = 0;
      $scope.item_select = new Array();
      var count = 0;
      for (var i = 0; i < $scope.MaintenanceItem.length; i++) {
        if ($scope.MaintenanceItem[i].Checked == true) {
          $scope.item_select.push($scope.MaintenanceItem[i]);
          count++;
        }
      }
      if (count != $scope.MaintenanceItem.length) {
        $scope.AllSelectButton = "全选";
      }
      else {
        $scope.AllSelectButton = "取消全选";
      }
      for (var i = 0; i < $scope.item_select.length; i++) {
        $scope.TotalItemPrice += $scope.item_select[i].ReferenceFee;
      }
    };
    //选中所有维修项目
    $scope.allSelect = function () {
      var count = 0;
      for (var i = 0; i < $scope.MaintenanceItem.length; i++) {
        if ($scope.MaintenanceItem[i].Checked == true)
          count++;
      }
      if (count == $scope.MaintenanceItem.length) {
        for (var i = 0; i < $scope.MaintenanceItem.length; i++) {
          $scope.MaintenanceItem[i].Checked = false;
        }
        $scope.AllSelectButton = "全选";
      }
      else {
        for (var i = 0; i < $scope.MaintenanceItem.length; i++) {
          $scope.MaintenanceItem[i].Checked = true;
        }
        $scope.AllSelectButton = "取消全选";
      }
      $scope.refreshItemChecked();
    };

    $scope.selectItem = function(){
      reservationService_cache.put("item",$scope.item_select);
      $ionicHistory.goBack();
    }
  });
