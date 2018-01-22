/**
 * Created by huang on 2016/10/9.
 */
angular.module('ico2o.services.maintenance', [])
	.service('maintenanceService', function($q, $http, $rootScope, $log, locals) {
		var url_MaintenanceItem_getProducts = $rootScope.host + "/ASHX/MobileAPI/MaintenanceItem/GetProducts.ashx";
		var url_updateMaintenanceItem = $rootScope.host + "/ASHX/MobileAPI/MaintenanceItem/Update.ashx";
		var url_getMaintenanceItemVersion = $rootScope.host + "/ASHX/MobileAPI/MaintenanceItem/Version.ashx";
		var deff;
		var MaintenanceList = [];
		$log.debug('run maintenance');
		/*获取版本号*/
		var getVersion = function() {
			deff = $q.defer();
			$http({
					method: 'post',
					url: url_getMaintenanceItemVersion,
					cache: true
				})
				.success(function(res) {
					deff.resolve(res.MainItemVersion);
					$log.debug('version', res);
					//return v.MainItemVersion;
				})
				.error(function(error) {
					$log.warn("error getVersion");
				});
			return deff.promise;
		};

		/*更新数据*/
		var updateMaintenance = function() {
			//deff = $q.defer();
			$http({
					method: 'post',
					url: url_updateMaintenanceItem,
					cache: true
				})
				.success(function(result) {
					//MaintenanceList = result;
					//$log.debug("updateMaintenance", MaintenanceList);
					angular.forEach(result, function(data, index, arr) {
						locals.setObject("MaintianceItem" + index, data);
						MaintenanceList[index] = data;
					});
					locals.set("MaintianceItemLength", result.length);
					//deff.resolve(true);
				})
				.error(function(error) {
					//deff.reject(false);
					$log.warn("error update maintenance");
				});
			$log.debug('update');
			//return deff.promise;
		};

		/******************************************/
		//初始化保养项目的数据
		var MainItemVersion;
		MainItemVersion = locals.get('MainItemVersion') ? locals.get('MainItemVersion') : -1;
		if(!locals.get('kmMsgLength')){
			locals.set('kmMsgLength', 0);
		}
/*		getVersion()
			.then(function(res) {
				if(MainItemVersion != res) {
					locals.set('MainItemVersion', res);
					MainItemVersion = res;
					updateMaintenance();
				}
				$log.debug('getVersion', res, MainItemVersion);
			});*/
			updateMaintenance();
		/******************************************/
		//获取项目对应产品
		var getProducts = function(item) {
			var ModelCode = locals.get('ModelCode');
			deff = $q.defer();
			$http({
					method: 'post',
					url: url_MaintenanceItem_getProducts,
					params: {
						ModelCode: ModelCode,
						MaintianceItem: item
					}
				})
				.success(function(data) {
					deff.resolve(data);
				})
				.error(function(error) {
					$log.warn("error get Product");
				});
			return deff.promise;
		};

		//按公里数保养
		var searchByKM = function(kmNum) {
			deff = $q.defer();
			var item = [];
			var tmp;
			for(var i = 0; i < MaintenanceList.length; i++) {
				tmp = MaintenanceList[i];
				if(tmp.KM <= kmNum) {
					item.push(tmp.Name);
				}
				$log.debug('search item', item);
			}
			deff.resolve(item);
			return deff.promise;
		};
		return {
			getVersion: getVersion,
			updateMaintenance: updateMaintenance,
			getProducts: getProducts,
			searchByKM: searchByKM
		}
	})

	.factory('MaintenanceCacheFactory', function($cacheFactory) {
		var MaintenanceCache;
		var createCache = function() {
			if($cacheFactory.get("MaintenanceCache")) {
				$cacheFactory.get("MaintenanceCache").destroy();
			}
			$cacheFactory('MaintenanceCache');
			MaintenanceCache = $cacheFactory.get('MaintenanceCache');
		};
		var getCache = function(key) {
			return MaintenanceCache.get(key);
		};
		var setCache = function(key, value) {
			MaintenanceCache.put(key, value);
		};

    //键值对，方法名，方法
		return {
			createCache: createCache,
			getCache: getCache,
			setCache: setCache
		};
	});
