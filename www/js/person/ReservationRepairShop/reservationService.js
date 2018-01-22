/**
 * Created by fan on 2016/9/18 .
 */
angular.module('ico2o.controllers.reservationService', [])
  .controller('reservationService',function($scope,$state,$http,$ionicLoading,$stateParams,locals, $ionicHistory,$cacheFactory,$rootScope){
    var reservationService_cache = $cacheFactory.get("reservationService_cache");
    if(reservationService_cache.get("rShop"))
      $scope.Maintenance = reservationService_cache.get("rShop");//取出缓存对象中键值为lol的对象
    else {
      $scope.Maintenance = angular.fromJson($stateParams.RShop);
    }
    // user_cache.remove("lol");  //删除键值为lol对应的值
    // user_cache.removeAll(); //清除缓存对象中所有的键值对
    // user_cache.destroy(); //销毁user_cache缓存对象
    var UserID = $rootScope.UserID;
    $http({
      method: "post",
      url: $rootScope.host +"/ASHX/MobileAPI/MyCars/GetMyCars.ashx",
      params: {
        UserID: UserID
      }
    }).success(function (response) {
      $scope.Car = response;
    });

    $scope.order_select = reservationService_cache.get("order_select");

    if(reservationService_cache.get("AddBooking"))
      $scope.AddBooking = reservationService_cache.get("AddBooking");
    else {
      $scope.AddBooking = {
        BookingDate: new Date()
      };
    }

    $scope.item_select = reservationService_cache.get("item");

    if($scope.item_select){
    $scope.left_item_select = new Array();
    $scope.right_item_select = new Array();

    //用于左右2列显示的数组
    if ($scope.item_select.length % 2 == 0) {
      for (var i = 0; i < $scope.item_select.length; i = i + 2) {
        $scope.left_item_select.push($scope.item_select[i]);
        $scope.right_item_select.push($scope.item_select[i + 1]);
      }
    }
    else {
      for (var i = 0; i < $scope.item_select.length - 1; i = i + 2) {
        $scope.left_item_select.push($scope.item_select[i]);
        $scope.right_item_select.push($scope.item_select[i + 1]);
      }
      $scope.left_item_select.push($scope.item_select[$scope.item_select.length - 1]);
    }
  }
//重置预约信息
      $scope.resetBooking = function () {
        //初始化后台接口传入参数的变量(可看作是重置功能)
        $scope.AddBooking = {
          BookingDate:new Date()
        };
        //选择订单
        $scope.order_select = {};
        reservationService_cache.remove("order_select");

        $scope.left_item_select = {};
        $scope.right_item_select = {};
        $scope.item_select = {};
        $scope.TotalItemPrice = 0;

      };

      //提交预约维修的信息
      $scope.addBooking = function () {
        $scope.load = $ionicLoading.show();
        if($scope.order_select) {
          $scope.AddBooking.OrderID = $scope.order_select[0].ID;
          for (var i = 1; i < $scope.order_select.length; i++) {
            $scope.AddBooking.OrderID += "," + $scope.order_select[i].ID;
          }
        }
        //注意这里要用JSON对象数组，而不是JS对象数组（转换方法JSON.stringify(obj)）
        var MaintenanceItemID = [];
        for (var i = 0; i < $scope.item_select.length; i++) {
          MaintenanceItemID[i]=JSON.stringify($scope.item_select[i].MaintenanceItemID);
        }
        $http({
          method: "post",
          url: $rootScope.host +"/ASHX/MobileAPI/Booking/AddBooking.ashx",
          params: {
            UserName: "test",
            UserID: UserID,
            Code: $scope.Maintenance.Code,
            CarNO: $scope.AddBooking.CarNO,
            Mobile: $scope.AddBooking.Mobile,
            ContactPerson: $scope.AddBooking.ContactPerson,
            BookingDate: $scope.AddBooking.BookingDate,
            Description: $scope.AddBooking.Description,
            MaintenanceID: $scope.Maintenance.ID,
            OrderID: $scope.AddBooking.OrderID,
            MaintenanceItemID: '['+MaintenanceItemID+']'
          }
        }).success(function (response) {
          $scope.returnBooking = response;
          $scope.load = $ionicLoading.hide();
          alert($scope.returnBooking.message);
        });
      };

      //跳转至选择维修项目
      $scope.goMaintenanceItem = function(itemID){
        $state.go("tab.MaintenanceItem");
        reservationService_cache.put("itemID",itemID);
        reservationService_cache.put("AddBooking", $scope.AddBooking);
      };

      //跳转至我的订单
      $scope.goRepair_order = function(){
        $state.go("tab.repair_order");
        reservationService_cache.put("AddBooking", $scope.AddBooking);
      };

      //跳转至订单详情
      $scope.goOrderlist = function(orderlist){
        $state.go("tab.orderlist2");
        reservationService_cache.put("orderlist",orderlist);
        reservationService_cache.put("AddBooking", $scope.AddBooking);
      };

      //跳回选择维修店（地图/列表）
      $scope.backRShop = function(){
        $ionicHistory.goBack();
        reservationService_cache.put("AddBooking", $scope.AddBooking);
      }
  });
