/**
 * Created by fan on 2016/9/18 .
 */
angular.module('ico2o.controllers.orderlist', [])
	.controller('orderlist', function($scope,$http,$ionicLoading,$stateParams,locals ,$rootScope,$log,orderService) {

    $scope.UserID = locals.get("UserID");

		$scope.orderlists;
		$scope.TotalSum=[];


    $scope.ProductID = [];//商品ID数组
    $scope.Quantity = [];//商品数量数组

		var url = $rootScope.host +'/ASHX/MobileAPI/Order/Get.ashx';
		/*数据加载中*/
		$scope.myloading = $ionicLoading.show();
		$http({
				method: 'get',
				url: url,
				params: {
					UserID: $rootScope.UserID,
					IsShopper: false,
					/*购物车*/
					PageNO: 1,
					PageSize: 3,
					Status: '',
					OrderNO:$stateParams.index
				}
			})
			.success(function(data) {
				/*对应商品从下标为0开始*/
				$scope.orderlists = data.data[0];

        //订单状态判断
        $scope.status = orderService.orderStatusDes(data.data[0].Status);
        $log.debug("123",$scope.status,data.data[0].Status,data.data[0].ListOrdersItem[0].OrderStatedValue);

        //商品的productID和数量数组
        for(var i=0;i<$scope.orderlists.ListOrdersItem.length;i++)
        {
          $scope.ProductID.push($scope.orderlists.ListOrdersItem[i].ProductID);
          $scope.Quantity.push($scope.orderlists.ListOrdersItem[i].Quantity);
        }
        //locals.set("ProductID",$scope.ProductID);
        //locals.set("Quantity",$scope.Quantity);
        $log.debug($scope.ProductID,$scope.Quantity);

				/*订单的状态*/
				/*if($scope.orderlists[0].Status == "HasOrder") {
					$scope.orderlists[0].Status = "待付款";*/
					//$scope.status = $scope.orderlists.Status;
				/*}*/
				console.log(data.data[0]);
				/*商品总价格,总数量*/
        $scope.TotalSum1 = 0;
				for(var i = 0; i < $scope.orderlists.ListOrdersItem.length; i++) {
					/*商品总价格*/
					$scope.TotalSum1 += $scope.orderlists.ListOrdersItem[i].Price * $scope.orderlists.ListOrdersItem[i].Quantity;
          /*商品总数量*/
					$scope.ProductSum += $scope.orderlists.ListOrdersItem[i].Quantity;
					//$scope.TotalSum[$stateParams.index] = $scope.ProductSum;
				}

				/*每组商品的总价格，总数量
				for(var j = 0; j < $scope.orderlists.ListOrdersItem.length; j++) {
					for(var k = 0; k < $scope.orderlists.length; j++)
						$scope.TotalSum[k] = $scope.orderlists.ListOrdersItem[j].Price * $scope.orderlists.ListOrdersItem[j].Quantity;
				}*/

				//console.log("success", $scope.orderlists, $scope.orderlists[0].ListOrdersItem);
				//console.log("$stateParams.index：" + $stateParams.index, "价格：" + $scope.TotalSum);
				//console.log("数组长度为：" + data.length, "总价格：" + $scope.orderlists[0].ListOrdersItem[0].Price);
				//console.log($scope.ProductSum[$stateParams.index], $scope.orderlists[$stateParams.index]);

				/*数据加载结束*/
				$scope.myloading = $ionicLoading.hide();
			}).error(function(error) {
				console.log("error", error);
			})


	});
