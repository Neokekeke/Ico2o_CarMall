/**
 * Created by fan on 2016/9/18 .
 */
angular.module('ico2o.controllers.repair_order', [])
  .controller('repair_order',function($scope,$http,$cacheFactory,$ionicHistory,$rootScope){
    //选择订单
    $http({
      method: 'post',
      url: $rootScope.host +"/ASHX/MobileAPI/Order/GetOrder.ashx",
      params: {
        UserID: $rootScope.UserID,
        IsShopper: false,
        PageNo: 1,
        PageSize: 50,
      }
    }).success(function (response) {
      $scope.repair_order = response;
    });
    $scope.selectOrder = function(){
      $scope.order_select = new Array();
      //这里切记要实例化数组对象，否则无法调用push
      for (var i = 0; i < $scope.repair_order.length; i++) {
        if ($scope.repair_order[i].Checked == true) {
          $scope.order_select.push($scope.repair_order[i]);
        }
      }
      $cacheFactory.get("reservationService_cache").put("order_select",$scope.order_select);
      $ionicHistory.goBack();
    }
  });
