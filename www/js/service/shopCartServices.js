/**
 * Created by huang on 2016/9/21 0021.
 */
angular.module('ico2o.services.shopCart', [])
	.service('shopCartService', function($rootScope, $q, $http, $log, $ionicPopup) {
		/*购物车*/
		var url_getCart = $rootScope.host + "/ASHX/MobileAPI/ShopCar/Get.ashx"; //查看
		var url_addCart = $rootScope.host + "/ASHX/MobileAPI/ShopCar/Add.ashx"; //增加
		var url_updateCart = $rootScope.host + "/ASHX/MobileAPI/ShopCar/Update.ashx"; //更新
		var url_deleteCart = $rootScope.host + "/ASHX/MobileAPI/ShopCar/Delete.ashx"; //删除
		var url_getShopCarNum = $rootScope.host + '/ASHX/MobileAPI/ShopCar/GetShopCarNum.ashx'; //查看商品数量
		/*订购车/代购车*/
		var url_shopper_get = $rootScope.host + "/ASHX/MobileAPI/ShopCar/Shopper/Get.ashx"; //查看
		var url_shopper_add = $rootScope.host + "/ASHX/MobileAPI/ShopCar/Shopper/Add.ashx"; //添加
		var url_shopper_delete = $rootScope.host + "/ASHX/MobileAPI/ShopCar/Shopper/Delete.ashx"; //删除

		/*$q服务*/
		var deffered;
		/*购物车*****************************************************/
		/*参数列表 和 方法*/
		/*int UserID, int PageNO, int IsShopper*/
		var getCart = function(UserID) {
			deffered = $q.defer();
			$http({
					method: 'post',
					url: url_getCart,
					params: {
						UserID: UserID,
						PageNO: 1,
						IsShopper: 0 /*购物车*/
					}
				})
				.success(function(result) {
					deffered.resolve(result);
				})
				.error(function(error) {
					deffered.reject(error);
				});
			return deffered.promise;

		};
		//var UserID = locals.get("UserID");
		/*{UserID:int,Area:string,ProductID:[int],Quantity:[int]}*/
		var addCart = function(UserID, Area, ProductID, Quantity) {
			$log.debug("add cart", UserID, ProductID, Quantity);
			deffered = $q.defer();
			$http({
					method: 'post',
					url: url_addCart,
					params: {
						UserID: UserID,
						Area: Area,
						ProductID: ProductID,
						Quantity: Quantity
					}
				})
				.success(function(result) {
					$log.debug("result", result);
					deffered.resolve(result);
				})
				.error(function(error) {
					$log.debug("error", error);
					$log.error("添加购物车错误", error);
				});
			return deffered.promise;

		};
		/*int ID，int Quantity(数量)*/
		var updateCart = function(ID, Quantity) {
			deffered = $q.defer();

		};
		/* int ID*/
		var deleteCart = function(ID) {
			deffered = $q.defer();
			$http({
					method: 'post',
					url: url_deleteCart,
					params: {
						ID: ID
					}
				})
				.success(function(result) {
					deffered.resolve(result);
				})
				.error(function(error) {
					deffered.reject("删除失败");
				});
			return deffered.promise;
		};
		/*订购车*****************************************************/
		/*int UserID, int PageNO*/
		var shopperGet = function() {
			deffered = $q.defer();

		};
		/*{UserID:int,Area:string,ProductID:[int],Quantity:[int]}*/
		var shopperAdd = function(UserID, Area, ProductID, Quantity) {
			deffered = $q.defer();
			$http({
					method: 'post',
					url: url_shopper_add,
					params: {
						UserID: UserID,
						Area: Area,
						ProductID: ProductID,
						Quantity: Quantity
					}
				})
				.success(function(result) {
					deffered.resolve(result);
				})
				.error(function(error) {
					deffered.reject("添加到购物车错误");
				});
			return deffered.promise;
		};
		/*int ID*/
		var shopperDelete = function() {

		};

		//get 购物车数量
		var getShopCarNum = function() {
			deffered = $q.defer();
			$http({
					method: 'post',
					url: url_getShopCarNum
				})
				.success(function(data) {
					deffered.resolve(data);
				})
				.error(function(error) {
					deffered.reject("购物车数量错误");
				});
			return deffered.promise;
		};

		return {
			/*购物车*/
			getCart: getCart,
			addCart: addCart,
			updateCart: updateCart,
			deleteCart: deleteCart,
			getShopCarNum: getShopCarNum,
			/*订购车*/
			shopperGet: shopperGet,
			shopperAdd: shopperAdd,
			shopperDelete: shopperDelete
		}

	});