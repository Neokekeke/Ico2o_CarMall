/**
 * Created by fan on 2016/9/18 .
 */
angular.module('ico2o.controllers.myOrder', [])

	.controller('myOrder', function($scope, $rootScope, $http, $ionicLoading, locals, checkLogin, $state, $timeout,$log,proSum,orderService,wechatPayService,$q) {

		$scope.UserID = locals.get("UserID");
		/*在我的订单中加载购物车列表*/
		$scope.orderList = [];

    	$scope.orderListt = [];



		/*物品列表*/

		/*全部商品*/
		$scope.Status = '';


		$scope.PageNO = 1;
		$scope.PageSize = 5;

		var url = $rootScope.host + '/ASHX/MobileAPI/Order/GetOrder.ashx';


     $scope.priSum = [];//总价
     $scope.proSum = [];//数量

    $scope.orderNo = [];
		/*数据加载中*/
		$scope.myloading = $ionicLoading.show();
		$http({
				method: 'get',
				url: url,
				params: {
					UserID: $scope.UserID,
					IsShopper: false,
					PageNO: $scope.PageNO,
					PageSize: $scope.PageSize,
          Status:''
				}
        //cache:true
			})
			.success(function(data) {
        $scope.orderList= data;
        $scope.hasmore = true;//上拉刷新

		//添加订单状态描述和按钮状态显示
		angular.forEach($scope.orderList,function(item){
			if(item){
				item.orderStatusDes = orderService.orderStatusDes(item.Status);
				item.isShowDK = orderService.isShowDK(item);
				item.isShowReturnGoodsBtn = orderService.isShowReturnGoodsBtn(item);
			}
		});

        console.log("111",data);
        //小计价格数量
        proSum.productSum(data,$scope.priSum,$scope.proSum);


				/*数据加载结束*/
				$scope.myloading = $ionicLoading.hide();
			}).error(function(error) {
				console.log("error", error);
			});

		//微信支付
		$scope.payOrder = function(orderId){
			wechatPayService.payOrder(orderId);
		};

		$scope.loadMore1 = function() {
      $scope.PageNO++;
      var timer = null;
      $http({
        method: 'get',
        url: url,
        params: {
          UserID: $rootScope.UserID,
          IsShopper: false,
          PageNO:$scope.PageNO,
          PageSize: $scope.PageSize,
          /*购物车*/
          Status: ''
        }
      })
        .success(function(data) {
          console.log("当前页码数"+$scope.PageNO);
          var _data = [];
          _data = data;
          //添加订单状态描述和按钮状态显示
          angular.forEach(_data,function(item){
            if(item){
              item.orderStatusDes = orderService.orderStatusDes(item.Status);
              item.isShowDK = orderService.isShowDK(item);
              item.isShowReturnGoodsBtn = orderService.isShowReturnGoodsBtn(item);
            }
          });
          //小计价格数量
          proSum.productSum(data,$scope.priSum,$scope.proSum);

          console.log("每页的长度"+_data.length);
          if(_data.length!=0) {
            for(var i=0;i<_data.length;i++){
              $scope.orderList.push(_data[i]);
            }

            timer = $timeout(function() {
              $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 1500);
          } else {
            /*$scope.myloading = $ionicLoading.hide();
             return false;*/
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
    };
	});
