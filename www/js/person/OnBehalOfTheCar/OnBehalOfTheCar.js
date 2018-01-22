/**
 * Created by fan on 2016/9/18 .
 */
angular.module('ico2o.controllers.OnBehalOfTheCar', [])
  .controller('OnBehalOfTheCar',function($scope,$rootScope,$stateParams,$http,locals,$ionicLoading,$ionicPopup,$timeout,$log,$state){
    $scope.dingjinSum = 0;/*订单总价钱*/
    $scope.myShopcar = [];

    /*订单验证*/
    $rootScope.isShopper = true;

    $scope.UserID = locals.get("UserID");

    $scope.PageNO = 1;

    var url = $rootScope.host + "/ASHX/MobileAPI/ShopCar/Shopper/Get.ashx";

    $http({
      method: 'get',
      url: url,
      params: {
        UserID: $rootScope.UserID,
        PageNO: $scope.PageNO
      }
    }).success(function (data) {
      $scope.myShopcar = data;

      //$scope.hasmore = true;//上拉加载

      console.log("success", data);
    }).error(function (error) {
      console.log("error", error);
    });

    /*单选订购车商品*/
    /*设置单选按钮--全选或反选的状态*/
    $scope.Selected = [];
    $scope.setBoxCheckedIndex = false;
    //$scope.selectAllProduct = false;

    var setBox = function (bool) {
      for (var i = 0; i < $scope.myShopcar.length; i++) {
      	$scope.Selected[i] = bool;
        $scope.selectAllProduct = bool;
        $log.debug($scope.selectAllProduct,$scope.Selected[i]);
      }
    };
    //setBox(true);

    /*单选*/
    $scope.isSelected = function (index) {
      $scope.Selected[index] = !$scope.Selected[index];

      if($scope.Selected[index] == true)
      {
        $scope.dingjinSum += $scope.myShopcar[index].Price * $scope.myShopcar[index].Quantity;
      }
      else if(!$scope.Selected[index])
      {
        $scope.dingjinSum -= $scope.myShopcar[index].Price * $scope.myShopcar[index].Quantity;
        $scope.setBoxCheckedIndex = false;
      }

      $log.debug("单选");
    };

    /*全选订购车商品*/
    $scope.selectAllProducts = function () {
      $scope.setBoxCheckedIndex = !$scope.setBoxCheckedIndex;
      $scope.dingjinSum = 0;
      if ($scope.setBoxCheckedIndex == false) {
        setBox(false);
        console.log("取消全选成功了！");
        $scope.dingjinSum = 0;
      }
      if ($scope.setBoxCheckedIndex == true) {
        setBox(true);
        var total = 0;
        angular.forEach($scope.myShopcar,function(item){
          if(item){

            if($scope.Selected){
              total += item.Price * item.Quantity;
            }
            $log.debug(item.Quantity);
          }
        });
        $scope.dingjinSum = total;
        console.log("全选成功了！");
      }
    };

    /*删除购物车商品*/
    $scope.delShopcar = function (ID, index) {
      var url = $rootScope.host + "/ASHX/MobileAPI/ShopCar/Delete.ashx";
      $scope.myloading = $ionicLoading.show();
      $http({
        method: 'post',
        url: url,
        params: {
          ID: ID
        }
      }).success(function (data) {
        alertPopup = $ionicPopup.alert({
          title: "删除商品成功！"
        });
        $scope.myShopcar.splice(index, 1);
        $scope.countPrice();
        $scope.myloading = $ionicLoading.hide();
        console.log("success", data);
      }).error(function (error) {
        console.log("error", error);
      })
    };

    //商品增加数量
    $scope.plus = function(index){
      $scope.myShopcar[index].Quantity++;
          if($scope.Selected[index]){
            $scope.dingjinSum += $scope.myShopcar[index].Price;
          }
          $log.debug($scope.myShopcar[index].Quantity);
    };

    //商品减少数量
    $scope.minus = function(index){
        if($scope.myShopcar[index].Quantity > 1)
      {
          $scope.myShopcar[index].Quantity--;
          if($scope.Selected[index])
          {
            $scope.dingjinSum -= $scope.myShopcar[index].Price;
          }
          $log.debug($scope.myShopcar[index].Quantity);
      }
    };

    //计算总价格
    $scope.countPrice = function(){
    	var total = 0;
    	angular.forEach($scope.myShopcar,function(item){
    		if(item){

          if($scope.dingjinSum == 0)
          {
            item.Quantity = 1;
          }
    			if($scope.Selected){
            total += item.Price * item.Quantity;
          }
          $log.debug(item.Quantity);
    		}
    	});
    	$scope.dingjinSum = total;
    };

    $scope.payOrder = function(){
      $scope.payList = [];
      $scope.payList.push($scope.myShopcar);
      if($scope.dingjinSum!=0)
      {
        var proCount = 0;
        angular.forEach($scope.myShopcar,function(count){
          if(count)
          {
            if($scope.Selected){
              proCount += count.Quantity;
            }
          }
      });
        $state.go('tab.order_check2',{
          orderPrice:angular.toJson($scope.dingjinSum),
          shopCarCount:angular.toJson(proCount),
          IDList:angular.toJson($scope.payList)
        });
        $log.debug($scope.dingjinSum,proCount,$scope.payList);
      }
      else {
        alertPopup = $ionicPopup.alert({
          title: "请选择支付的商品！"
        });
      }
    };


   /* $scope.loadMore1 = function() {
      $scope.PageNO++;
      var timer = null;
      $http({
        method: 'get',
        url: url,
        params: {
          UserID: $scope.UserID,
          PageNO:$scope.PageNO
        }
      })
        .success(function(data) {
          console.log($scope.PageNO);
          var _data = [];
          _data = data;
          console.log(_data.length);
          if(_data.length!=0) {
            for(var i=0;i<_data.length;i++){
              $scope.myShopcar.push(_data[i]);
            }
            timer = $timeout(function() {
              $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 1500);
          } else {
            $scope.hasmore = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');

        }).error(function(error) {
        console.log("error", error);
      });
      $scope.$on("$destroy", function() {
        //clearTimeout(timer.$$timeoutId);
        $timeout.cancel(timer);
        //清除配置,不然scroll会重复请求
      });

    };*/

  });
