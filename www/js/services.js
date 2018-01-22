angular.module('ico2o.services', [])

.factory('localData',['$window',function($window){
  /*本地存储*/
  var set_JSONData =function(key,data){
    console.log(data);
    $window.localStorage[key] = data;
  };
  var get_JSONData = function(key){
    return JSON.parse($window.localStorage[key] || '{}');
  };
  var set_Data = function (key, value) {
    $window.localStorage[key] = value;
  };
  var get_Data = function (key) {
    return $window.localStorage[key] || null;
  };
  var clear = function(){
    return $window.localStorage.clear();
  };
  return{
    set_Data:set_Data,
    get_Data:get_Data,
    set_JSONData:set_JSONData,
    get_JSONData:get_JSONData,
    clear:clear
  }
}])
  //保存数据到本地的服务
  .factory('cache_productService',function($http,$q,localData,$rootScope){
    //localData.clear();localData.get_JSONData('ProList')
    console.log(localData.get_Data('ProVersion'));
    console.log(localData.get_JSONData('ProList'));
    var url_updateList = $rootScope.host +"/ASHX/MobileAPI/Product/Update.ashx";
    var url_getVersion = $rootScope.host +"/ASHX/MobileAPI/Product/Version.ashx";
    var deffered_version = $q.defer();
    var pr_v = deffered_version.promise;
    var ProVersion = 0;
    return {
      set_cache_proList: function () {
        //查看版本区别
        $http.get(url_getVersion)
          .success(function (data) {
            console.log("success getVersion" + JSON.stringify(data));
            if (localData.get_Data('ProVersion') == null || localData.get_Data('ProVersion') != data.ProVersion||localData.get_JSONData('ProList')) {
              deffered_version.resolve(data.ProVersion);
            }
            else {
              deffered_version.reject(data.ProVersion);
            }
          })
          .error(function (error) {
            console.log("error getVersion" + error);
          });

        pr_v.then(function (data) {//success 接resolve
          localData.set_Data('ProVersion', data);
          $http({
            method: "get",
            url: url_updateList
          })
            .success(function (response) {
              console.log("1 success:productList:"+JSON.stringify(response));
              return response;
            })
            .error(function (error) {
              console.log("1 error updateList:" + error);
            });
        }, function (error) {//error 接reject
          localData.set_Data('ProVersion', error);
          console.log("1 error version:"+JSON.stringify(error));
          return "elseResult true";
        })
          .then(function(proData){
            console.log("2 productList localData:"+JSON.stringify(proData));
          });
        /*.then(function (result) {
          //重新存储数据
          localData.set_JSONData('ProList',result);
          console.log("productList localData"+JSON.stringify(result));
          return true;
        }, function (elseResult) {
          console.log(elseResult);
          return true;
        });*/
      }
    }
  })
  /*product cache 封装缓存的方法*/
  .factory('cache_proService',function($cacheFactory){
    var cache_product = $cacheFactory('cache_product');
    var cache_ProIDList = $cacheFactory('cache_ProIDList');
    return {
      cache_product:function(){
        return cache_product;
      },
      cache_ProIDList:function(){
        return cache_ProIDList;
      }
    }
  })
  //查找配件->产品列表
  .factory('get_proListCache',function(cache_proService,$q){
    var cache_setProIDList = cache_proService.cache_ProIDList();
    cache_setProIDList.put('sortOneID',null);
    cache_setProIDList.put('sortSecondID',null);
    cache_setProIDList.put('sortThreeID',null);
    cache_setProIDList.put('sortFourID',null);
    var cache_getProduct = cache_proService.cache_product();
    //配置产品列表
    var get_proList = function (depth, parentID, name) {
      /*异步的同步*/
      var deferred = $q.defer();

      var j = 0, tmp;
      var _list = [];
      tmp = depth + 1;
      for (var i = 0; i < cache_getProduct.get('dataLength'); i++) {
        if (tmp == cache_getProduct.get('products' + i).Depth &&
          parentID == cache_getProduct.get('products' + i).ParentID) {
          _list[j] = cache_getProduct.get('products' + i);
          j++;
        }
      }
      //设置IDList
      switch (tmp){
        case 2:
          cache_setProIDList.put('sortOneID',parentID);
                      break;
        case 3:
          cache_setProIDList.put('sortSecondID',parentID);
                      break;
        case 4:
          cache_setProIDList.put('sortThreeID',parentID);
                      break;
        case 5:
          cache_setProIDList.put('sortFourID',parentID);
                      break;
      }
      deferred.resolve(_list);
      return deferred.promise;
    };
    return{
      get_proList:get_proList
    }

  });
