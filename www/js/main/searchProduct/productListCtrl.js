/**
 * Created by huang on 2016/9/13 0013.
 */
angular.module('ico2o.controllers.productListCtrl', [])
	.controller('productListCtrl', function($scope, $http, $rootScope, $state, $ionicLoading, $log, $ionicPopup, $timeout, productListService, shopCartService, locals) {
		var UserID = $rootScope.UserID;
		/*配件列表*/
		$scope.product_list = [];
		var l = 0;
		/*配件属性*/
		$scope.bt_state = [];
		//$log.debug("sortID list:",JSON.stringify($rootScope.sortID));
		/*获取列表数据*/
		var pageNo = 0;
		$scope.hasmorePro = false;
		$scope.loadProlist = function() {
				pageNo++;
				productListService.getBySearch($rootScope.keyWord, pageNo)
					.then(function(data) {
						//$log.debug('data',data);
						if(data.length != 0) {
							$scope.product_list = $scope.product_list.concat(data);
						} else {
							$rootScope.keyWord == null;
							$scope.hasmorePro = false;
						}
						$log.debug('shopList', $scope.shopList, pageNo);
					})
					.then(function() {
						setState();

						$log.debug('loadMore success');
						$timeout(function() {
							$timeout(function() {
								$scope.$broadcast('scroll.infiniteScrollComplete');
							});
						});
						$ionicLoading.hide();
					});
			}
			/*类型区分*/
		$ionicLoading.show();
		$log.debug('keyword', $rootScope.KeyWord);
		if($rootScope.keyWord == null) { //通過多級查詢獲得
			productListService.get_listByPro()
				.then(function(data) {
					$scope.product_list = data;
					l = data.length;
					$ionicLoading.hide();
				})
				.then(function() {
					setState();
				});
		} else { //通過keyword 獲得
			$scope.product_list = [];
			pageNo = 0;
			$scope.hasmorePro = true;
			$scope.loadProlist();
			$rootScope.keyWord == null

		}

		/*设置产品属性*/
		var setState = function() {
			angular.forEach($scope.product_list, function(data, index) {
				$scope.bt_state[index] = true;
				if(data.Inventory == 0) {
					$scope.bt_state[index] = false;
				}
				$log.debug("Inventory:" + data.Inventory + " bt_state:" + $scope.bt_state[index]);
			});
		};
		//加入购物车或订购车
		$scope.addShopcarOr = function(bool, Proid) {
			var id = [];
			var Quantity = [];
			id.push(Proid);
			Quantity.push(1);
			var IDList = angular.toJson(id);
			var QList = angular.toJson(Quantity);
			$log.debug('id,q', $scope.product_list, IDList, QList);
			if(bool == true) {
				var BTtitle;
				shopCartService.addCart(UserID, "", IDList, QList) //添加到购物车
					.then(function(result) {
						BTtitle = "加入购物车成功";
						if(!result) {
							BTtitle = "加入购物车失败";
						}
					}, function(error) {
						BTtitle = error;
					})
					.then(function() {
						$ionicPopup.show({
							title: BTtitle,
							scope: $scope,
							buttons: [{
								text: "确定",
								type: 'button button-positive'
							}]
						});
					});
			} else {
				//添加到订购车
				var shopperAddtitle;
				shopCartService.shopperAdd(UserID, "", IDList, QList) //添加到订购车
					.then(function(result) {
						shopperAddtitle = "加入订购车成功";
						if(!result) {
							shopperAddtitle = "加入订购车失败";
						}
					}, function(error) {
						shopperAddtitle = error;
					})
					.then(function() {
						$ionicPopup.show({
							title: shopperAddtitle,
							template: "是否前往订购车",
							scope: $scope,
							buttons: [{
								text: "确定",
								type: 'button button-positive',
								onTap: function(e) {
									$state.go('tab.OnBehalOfTheCar2');
									//e.preventDefault();
								}
							}, { // Array[Object] (optional). Buttons to place in the popup footer.
								text: '取消',
								type: 'button-default'
							}]
						});
					});
			} //if-else
		};
		/*页面切换*/
		$scope.open_proDetail = function(id) {
			$state.go('tab.product_detail', {
				productID: id
			});
		};

	})
	.controller('searchProCtrl', function($scope, $http, $rootScope, $state, $ionicLoading, $log,$ionicPopup, 
		$timeout, productListService, shopCartService, locals) {
		var UserID = $rootScope.UserID;
		/*配件列表*/
		$scope.product_list = [];
		var l = 0;
		/*配件属性*/
		$scope.bt_state = [];
		/*获取列表数据*/
		var pageNo = 0;
		$scope.hasmorePro = false;
		$scope.keyWord = {
			key: ''
		};
		
		$scope.search = false;
		
		//加载数据
		$scope.loadProlist = function() {
				//$ionicLoading.show();
				pageNo++;
				productListService.getBySearch($scope.keyWord.key,pageNo)
					.then(function(data) {
						//$log.debug('data',data);
						if(data.length != 0) {
							$scope.product_list = $scope.product_list.concat(data);
						} else if(data.length < 7){
							$scope.hasmorePro = false;
						}
						$log.debug('shopList', $scope.product_list, pageNo);
					})
					.then(function() {
						$timeout(setState,100);
						$log.debug('loadMore success');
						$timeout(function() {
							$timeout(function() {
								$scope.$broadcast('scroll.infiniteScrollComplete');
							});
						});
						//$ionicLoading.hide();
						$scope.search = true;
					});
			};
		
			//搜索
		$scope.searchPro = function() {
			$log.debug('key',$scope.keyWord.key);
			$scope.product_list = [];
			pageNo = 0;
			$scope.hasmorePro = true;
			$scope.loadProlist();
		};

		/*设置产品属性*/
		var setState = function() {
			angular.forEach($scope.product_list, function(data, index) {
				$scope.bt_state[index] = true;
				if(data.Inventory == 0) {
					$scope.bt_state[index] = false;
				}
				$log.debug("Inventory:" + data.Inventory + " bt_state:" + $scope.bt_state[index]);
			});
		};
		//加入购物车或订购车
		$scope.addShopcarOr = function(bool, Proid) {
			var id = [];
			var Quantity = [];
			id.push(Proid);
			Quantity.push(1);
			var IDList = angular.toJson(id);
			var QList = angular.toJson(Quantity);
			$log.debug('id,q', $scope.product_list, IDList, QList);
			if(bool == true) {
				var BTtitle;
				shopCartService.addCart(UserID, "", IDList, QList) //添加到购物车
					.then(function(result) {
						BTtitle = "加入购物车成功";
						if(!result) {
							BTtitle = "加入购物车失败";
						}
					}, function(error) {
						BTtitle = error;
					})
					.then(function() {
						$ionicPopup.show({
							title: BTtitle,
							scope: $scope,
							buttons: [{
								text: "确定",
								type: 'button button-positive'
							}]
						});
					});
			} else {
				//添加到订购车
				var shopperAddtitle;
				shopCartService.shopperAdd(UserID, "", IDList, QList) //添加到订购车
					.then(function(result) {
						shopperAddtitle = "加入订购车成功";
						if(!result) {
							shopperAddtitle = "加入订购车失败";
						}
					}, function(error) {
						shopperAddtitle = error;
					})
					.then(function() {
						$ionicPopup.show({
							title: shopperAddtitle,
							template: "是否前往订购车",
							scope: $scope,
							buttons: [{
								text: "确定",
								type: 'button button-positive',
								onTap: function(e) {
									$state.go('tab.OnBehalOfTheCar2');
									//e.preventDefault();
								}
							}, { // Array[Object] (optional). Buttons to place in the popup footer.
								text: '取消',
								type: 'button-default'
							}]
						});
					});
			} //if-else
		};
		
		/*页面切换*/
		$scope.open_proDetail = function(id) {
			$state.go('tab.product_detail', {
				productID: id
			});
		};
	})