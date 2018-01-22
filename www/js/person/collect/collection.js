/**
 * Created by fan on 2016/9/18 .
 */
angular.module('ico2o.controllers.collection', [])
	.controller('collection', function($scope,$ionicLoading,$http,$ionicPopup,locals,$timeout,$rootScope) {

    //$scope.UserID = locals.get("UserID");
		$scope.myfavs = [];

    $scope.pageNO = 1;
    $scope.pageSize = 6;

		var url1 = $rootScope.host +'/ASHX/MobileAPI/Collection/Get.ashx';
		$scope.myloading = $ionicLoading.show();
		$http({
			method: 'get',
			url: url1,
			params: {
				UserID: $rootScope.UserID,
				PageNO: $scope.pageNO,
				PageSize: $scope.pageSize
			}
		}).success(function(data) {
			$scope.myfavs = data;

      $scope.hasmore = true;//上拉加载

			$scope.myloading = $ionicLoading.hide();
			console.log("success", data);
		}).error(function(error) {
			console.log("error", error);
		});


		/*增加购物车的商品*/
      $scope.addShopcar = function (ProductID) {
        var url2 = $rootScope.host +"/ASHX/MobileAPI/ShopCar/Add.ashx";
        var productID = [];
        var quantity = [];
        quantity.push(1);
        productID.push(ProductID);
        console.log(productID);
        console.log(quantity);
        $http({
          method: 'post',
          url: url2,
          params: {
            UserID: $rootScope.UserID,
            Area: '',
            ProductID: angular.toJson(productID) ,
            Quantity:angular.toJson(quantity)
          }
        }).success(function (data) {
          alertPopup = $ionicPopup.alert({
            title: "加入购物车成功！"
          });
          console.log("success", data);
        }).error(function (error) {
          console.log("error", error);
        })
      };

      /*删除我的收藏*/
      $scope.delMyfav = function (ID, index) {
      	console.log(ID);
        var url3 = $rootScope.host +"/ASHX/MobileAPI/Collection/Delete.ashx";
        $http({
          method: 'post',
          url: url3,
          params: {
            UserID: $rootScope.UserID,
            CollectionID: ID
          }
        }).success(function (data) {
          $scope.myfavs.splice(index, 1);
          console.log("success", data);
        }).error(function (error) {
          console.log("error", error);
        })
      };

    $scope.loadMore1 = function() {
      $scope.pageNO++;
      var timer = null;
      $http({
        method: 'get',
        url: url1,
        params: {
          UserID: $rootScope.UserID,
          PageNO: $scope.pageNO,
          PageSize: $scope.pageSize
        }
      })
        .success(function(data) {
          console.log("当前页码数"+$scope.pageNO);
          var _data = [];
          _data = data;
          console.log("每页的长度"+_data.length);
          if(_data.length!=0) {
            for(var i=0;i<_data.length;i++){
              $scope.myfavs.push(_data[i]);
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
