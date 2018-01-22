/**
 * Created by huang on 2016/9/20 0020.
 */
angular.module('ico2o.services.proList', [])
	.service('productListService', function($q, $http, locals, $cacheFactory, $rootScope, $state, $log,
		carCodeService,$timeout) {
		var deffered;
		var url_getVersion = $rootScope.host + "/ASHX/MobileAPI/Product/Version.ashx";
		var url_updateList = $rootScope.host + "/ASHX/MobileAPI/Product/Update.ashx";
		var url_getBySearch = $rootScope.host + "/ASHX/MobileAPI/Product/GetBySearch.ashx";
		var url_getProduct = $rootScope.host + "/ASHX/MobileAPI/Product/Get.ashx";
		var CarCode = locals.getObject("carCode");

		/*版本检测*/
		var getproListVersion = function() {
			var deffered = $q.defer();
			$http({
					method: 'get',
					url: url_getVersion,
					cache: true
				})
				.success(function(v) {
					deffered.resolve(v);
				})
				.error(function(error) {
					$log.error(" getproListVersion error");
				});
			return deffered.promise;
		};

		/*更新所有数据*/
		var proList = [];
		var updateProList = function() {
			$http({
					method: 'get',
					url: url_updateList,
					cache: true
				})
				.success(function(data) {
					var count = 0;
					locals.setObject("proList", data);
					proList = data;
					angular.forEach(data, function(item, index, arr) {
						if(item.Depth == 1 && item.ParentID == null) {
							locals.setObject("list1" + count, item);
							count++;
						}
					});
					locals.set("list1Length", count);
				})
				.error(function(error) {
					$log.error('update proList error');
				});
		};

		/********************************************/
		//初始化数据
		var version = locals.get('ProVersion') ? locals.get('ProVersion') : -1;
/*		getproListVersion()
			.then(function(v) {
				if(version != v) {
					updateProList();
				} else {
					proList = locals.getObject('proList');
				}
			})
			.then(function () {
				if(proList == []){
					updateProList();
				}
			});*/
			updateProList();
			//测试
			$timeout(function () {
				$log.debug('list',proList);
			},100);
		/********************************************/
		/*设置页面列表*/
		var get_listToPage = function(Depth, ParentID) {
			deffered = $q.defer();
			var depth = Depth + 1;
			var list = [];
			var tmplist = locals.getObject("proList");
			angular.forEach(tmplist, function(dataa, index, arr) {
				if(dataa.Depth == depth && dataa.ParentID == ParentID) {
					list.push(dataa);
				}
			});
			deffered.resolve(list);
			return deffered.promise;

		};
		var getListToPage = function(_Depth, _ParentID) {
			var depth = _Depth + 1;
			var list = [];
			angular.forEach(proList, function(item, index, arr) {
				if(item.Depth == depth && item.ParentID == _ParentID) {
					list.push(item);
					$log.debug('item',item.Name);
				}
			});
			return list;
		};
		
		//通过key查找配件对应商品
		/*string KeyWord, string ModelCode, int PageNO, int PageSize */
		var getBySearch = function(keyword, PageNO) {
			var ModelCode = locals.get('ModelCode');
			deffered = $q.defer();
			$http({
					method: 'get',
					url: url_getBySearch,
					params: {
						KeyWord: keyword,
						ModelCode: ModelCode,
						PageNO: PageNO,
						PageSize: 7
					}
				})
				.success(function(data) {
					deffered.resolve(data);
				})
				.error(function(error) {
					$log.error('get by search error');
				});
			return deffered.promise;

		};
		
		/*获取配件列表*/
		var get_listByPro = function() {
			$log.debug("sort", $rootScope.sortID);
			deffered = $q.defer();
			/*请求*/
			$http({
					method: 'get',
					url: url_getProduct,
					params: {
						sortOneID: $rootScope.sortID.sortOneID,
						sortSecondID: $rootScope.sortID.sortSecondID,
						sortThreeID: $rootScope.sortID.sortThreeID,
						sortFourID: $rootScope.sortID.sortFourID
					}
				})
				.success(function(data) {
					console.log("get_listByPro get length:" + data.length);
					deffered.resolve(data);
				})
				.error(function(error) {
					console.log("error get_proList:" + error);
				});
			console.log("get_listByPro end");
			/*清空*/
			$rootScope.sortID = {
				sortOneID: '',
				sortSecondID: '',
				sortThreeID: '',
				sortFourID: ''
			};
			return deffered.promise;
		};
		/*设置状态*/
		var set_state = function(name) {
			switch(name) {
				case 'tab.product_depth_0':
					$state.go('tab.product_depth_0.subheader');
					break;
				case 'tab.product_depth_1':
					$state.go('tab.product_depth_1.subheader');
					break;
				case 'tab.product_depth_2':
					$state.go('tab.product_depth_2.subheader');
					break;
				case 'tab.product_depth_3':
					$state.go('tab.product_depth_3.subheader');
					break;
			}
		};
		var cache_keyword = function() {
			return $cacheFactory("KeyWord");
		};
		return {
			getproListVersion: getproListVersion,
/*			update_proList: update_proList,*/
			get_listToPage: get_listToPage,
			getListToPage: getListToPage,
			get_listByPro: get_listByPro,
			/*关键字查找*/
			getBySearch: getBySearch,
			cache_keyword: cache_keyword,
			/*设置状态*/
			set_state: set_state
		}
	});