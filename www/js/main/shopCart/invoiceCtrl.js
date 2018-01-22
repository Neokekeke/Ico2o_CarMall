/**
 * Created by huang on 2016/9/28 0028.
 */
angular.module('ico2o.controllers.invoiceCtrl', [])
	.controller('invoiceCtrl', function($scope, $state, $ionicHistory, $cacheFactory, $rootScope, $log) {

		//跳转的状态
		$scope.goToInvoice = function() {
			if($rootScope.flag_address == 0) {
				$state.go('tab.invoice2');
			}
			if($rootScope.flag_address == 1) {
				$state.go('tab.invoice');
			}
		};

		//设置缓存变量		
		var cache = $cacheFactory.get("GetOrder_cache");

		//数据的 默认值
		$scope.checked = true;
		$scope.form = {
			need: false,
			Itype: true,
			invoiceHeader: "",
			invoiceNumber: "",
			invoiceAddress: ""
		};

		//点击执行
		$scope.submitInvoice = function() {
			var invoice = {
				type: "",
				invoiceHeader: "",
				invoiceNumber: "",
				invoiceAddress: ""
			};
			if($scope.form.need) { //需要发票
				
				if($scope.form.Itype){//个人发票
					invoice.type = "个人";
				}
				else{			//单位发票
					invoice.type = "单位";
					invoice.invoiceNumber = $scope.from.invoiceNumber;
					invoice.invoiceAddress = $scope.from.invoiceAddress;
				}
				invoice.invoiceHeader = $scope.form.invoiceHeader;
			}
			cache.put("invoiceMessage",invoice);
			$ionicHistory.goBack();
		};

	});