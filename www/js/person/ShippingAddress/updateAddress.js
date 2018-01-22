/**
 * Created by fan on 2016/9v/18 .
 */
angular.module('ico2o.controllers.updateAddress', [])
	.controller('updateAddress', function($scope, $stateParams, $ionicPopup, $location, $cacheFactory, findAddressService, $ionicTabsDelegate) {
		
		var UpdateReceiving_cache;
		
		if($cacheFactory.get("UpdateReceiving_cache")) {
			UpdateReceiving_cache = $cacheFactory.get("UpdateReceiving_cache");
			$scope.UpdateReceiving = UpdateReceiving_cache.get("UpdateReceiving");
		} else {
			UpdateReceiving_cache = $cacheFactory('UpdateReceiving_cache');
			$scope.UpdateReceiving = angular.fromJson($stateParams.gml);
		}
		/*更改收货地址*/

		console.log($scope.UpdateReceiving);
		$scope.UpdateReceiving.PCD = $scope.UpdateReceiving.Province + " " + $scope.UpdateReceiving.City + $scope.UpdateReceiving.District;

		//var tmp = findAddressService.getAddressList();

		$scope.submit_UpdateReceiving = function() {

			findAddressService.submit_UpdateReceivingMessage($scope.UpdateReceiving);
			
		}

		$scope.cities;
		$scope.areas;

		$scope.proToCity = function() {
			$scope.cities = $scope.pro.cityList;
			//$scope.areas = "---请选择区---";
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
			UpdateReceiving_cache.put("UpdateReceiving", $scope.UpdateReceiving);
			// 自定义弹窗
			var myPopup = $ionicPopup.show({
				scope: $scope,
				templateUrl: 'templates/person/ShippingAddress/AddArea.html',

			});
			myPopup.then(function(res) {
				
				if(!$cacheFactory.get("UpdateReceiving_cache")) {
					return;
				}
				$scope.UpdateReceiving = UpdateReceiving_cache.get("UpdateReceiving");
				console.log($scope.UpdateReceiving);
				$scope.UpdateReceiving.PCD = $scope.UpdateReceiving.Province + $scope.UpdateReceiving.City + $scope.UpdateReceiving.District;
				
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
			$scope.UpdateReceiving.Province = $scope.pro.name;
			$scope.UpdateReceiving.City = $scope.city.name;
			$scope.UpdateReceiving.District = $scope.area;
			console.log($scope.UpdateReceiving);
			UpdateReceiving_cache.put("UpdateReceiving", $scope.UpdateReceiving);

			$scope.close();
		}

	});