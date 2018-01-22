/**
 * Created by fan on 2016/9/18 .
 */
angular.module('ico2o.controllers.addAddress', [])
  .controller('addAddress',function($scope,$ionicPopup,$state,$rootScope, $location, $cacheFactory, findAddressService){
		var addReceiving_cache;
		$scope.addReceiving = {};
		console.log("执行controller");
		if($cacheFactory.get("addReceiving_cache")!=null) {
			addReceiving_cache = $cacheFactory.get("addReceiving_cache");
			$scope.addReceiving = addReceiving_cache.get("addReceiving");
		}else
			addReceiving_cache = $cacheFactory('addReceiving_cache');
		

		
		//var tmp = findAddressService.getAddressList();

		$scope.submit_address = function() {

			findAddressService.submit_addressMessgae($scope.addReceiving);
						/*修改跳转的状态 ---黄*/
			if($rootScope.flag_address == 0){
				$state.go("tab.shippingAddress");				
			}
			if($rootScope.flag_address == 1){
				$state.go("tab.shippingAddress2");				
			}
			alertPopup = $ionicPopup.alert({
                title: "收货地址添加成功"
              });
		}

		$scope.cities;
		$scope.areas;

		$scope.proToCity = function() {
			$scope.cities = $scope.pro.cityList;
			$scope.areas = "---请选择区---";
		}
		$scope.cityToArea = function() {
			console.log($scope.pro.name);
			$scope.areas = $scope.city.areaList;
		}

		var promise = findAddressService.getAddressList();
		promise.then(function(data) {
			$scope.provinces = angular.fromJson(data); //调用承诺接口resolove()
		}, function(data) {
			console.log('数据不存在。。。'); //调用承诺接口reject();
		});
		$scope.showPopup = function() {
			console.log(addReceiving_cache!=null);
			addReceiving_cache.put("addReceiving", $scope.addReceiving);
			// 自定义弹窗
			var myPopup = $ionicPopup.show({
				scope: $scope,
				templateUrl: 'templates/person/ShippingAddress/AddArea_.html',

			});
			myPopup.then(function(res) {
				
				if(!$cacheFactory.get("addReceiving_cache")) {
					return;
				}
				$scope.addReceiving = addReceiving_cache.get("addReceiving");
				console.log($scope.addReceiving);
				$scope.addReceiving.PCD = $scope.addReceiving.Province + $scope.addReceiving.City + $scope.addReceiving.District;
				
			})
			$scope.close = function() {

				myPopup.close();
			}

		};

		$scope.cancel = function() {
			
			$scope.close();
		}

		$scope.confirm = function() {
			if($scope.area==null){
					alert("请选择完整地址");
					return;
				}
			$scope.addReceiving = {};
			$scope.addReceiving.Province = $scope.pro.name;
			$scope.addReceiving.City = $scope.city.name;
			$scope.addReceiving.District = $scope.area;
			console.log($scope.addReceiving);
			addReceiving_cache.put("addReceiving", $scope.addReceiving);

			$scope.close();
		}
  });
