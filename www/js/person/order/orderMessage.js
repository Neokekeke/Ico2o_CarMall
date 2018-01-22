/**
 * Created by fan on 2016/9/18 .
 */
angular.module('ico2o.controllers.orderMessage', [])
	.controller('orderMessage', function($scope, $ionicLoading, $http, $stateParams,$ionicPopup,locals,$rootScope,$log,shopCartService,$state) {

     $scope.UserID = locals.get("UserID");

    $scope.PID = [];//商品ID数组
    $scope.Qty = [];//商品数量数组

		var url = $rootScope.host +'/ASHX/MobileAPI/Product/GetDetail.ashx';
		var url1 = $rootScope.host +'/ASHX/MobileAPI/Product/GetProImg.ashx';
		console.log($stateParams.productID);
    $scope.itemDetail = {};
		/*数据加载中*/
		$scope.myloading = $ionicLoading.show();
		$http({
				method: 'get',
				url: url,
				params: {
					ProID: $stateParams.productID
				}
			})
			.success(function(data) {
				$scope.itemDetail = data;
        $scope.itemDetail.ID = data.ID;
        $scope.itemDetail.ProCount = data.ProCount;



				console.log($scope.itemDetail,$scope.itemDetail.ID,$scope.itemDetail.ProCount);
				/*数据加载结束*/
				$scope.myloading = $ionicLoading.hide();
				$scope.image = [];
				$http({
						method: 'get',
						url: url1,
						params: {
							GuidKey: $scope.itemDetail.GuidKey
						}
					})
					.success(function(data) {
						$scope.image = data;
						console.log("success", data);
					}).error(function(error) {
						console.log("error", error);
					})
			}).error(function(error) {
				console.log("error", error);
			});





			/*物品是否收藏*/
      $scope.Collection = true;
      $scope.collect = function (ID) {
          /*增加我的收藏*/
          var collect = $rootScope.host +"/ASHX/MobileAPI/Collection/Add.ashx";
          $scope.myloading = $ionicLoading.show();
          $http({
            method: 'post',
            url: collect,
            params: {
              UserID: $rootScope.UserID,
              ProID: ID
            }
          }).success(function (data) {
            //alert(data.tip);
            if ($scope.Collection == true) {
              $scope.Collection = false;
              var alertPopup = $ionicPopup.alert({
                title: data.tip
              });
              console.log(ID);
            }
            else {
              $scope.Collection = true;
              var alertPopup = $ionicPopup.alert({
                title: '取消收藏！'
              });
              var url3 = $rootScope.host +"/ASHX/MobileAPI/Collection/Delete.ashx";
              $http({
                method: 'post',
                url: url3,
                params: {
                  UserID: $rootScope.UserID,
                  CollectionID: ID
                }
              }).success(function (data) {
                console.log("success", data);
              }).error(function (error) {
                console.log("error", error);
              })
            }

            $scope.myloading = $ionicLoading.hide();
            console.log("success", data);
          }).error(function (error) {
            console.log("error", error);
          })
      };

    //加入购物车
    $scope.addToShopcart = function(proid,pcout){
      $scope.PID.push(proid);
      $scope.Qty.push(pcout);
      var pid = angular.toJson($scope.PID);
      var qty = angular.toJson($scope.Qty);
      shopCartService.addCart($rootScope.UserID,"",pid,qty);
      $log.debug("111",pid,qty);
      var alertPopup = $ionicPopup.alert({
        title: '加入购物车成功！'
      });
    };

    //立即购买
    $scope.goToPay = function(){
      $scope.list = [];
      $scope.list.push($scope.itemDetail);
      $log.debug($scope.list);
      if($scope.itemDetail.ShopPrice!=0)
      {
        if($rootScope.flag_address == 0)
        {
          $state.go("tab.order_check2",{
            orderPrice: angular.toJson($scope.itemDetail.ShopPrice),
            shopCarCount: angular.toJson($scope.itemDetail.ProCount),
            IDList: angular.toJson($scope.list)
          });
        }
        else if($rootScope.flag_address == 1)
        {
          $state.go("tab.order_check",{
            orderPrice: angular.toJson($scope.itemDetail.ShopPrice),
            shopCarCount: angular.toJson($scope.itemDetail.ProCount),
            IDList: angular.toJson($scope.list)
          });
        }


      }
    };

	});
