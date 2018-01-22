/**
 * Created by huang on 2016/9/13 0013.
 */
angular.module('ico2o.controllers.productDepth3Ctrl', [])
  .controller('productDepth3Ctrl',function($scope, $http,$state,$rootScope,$stateParams,$ionicHistory,$log,productListService){
    /*监听路由状态变化*/
    var get_subheader = function(){
      productListService.set_state($ionicHistory.currentStateName());
    };
    $scope.$on('$stateChangeSuccess',get_subheader);

    //获取参数
    $scope.title = $stateParams.Name;
    /*获取列表*/
    $scope.lists = [];
    //$scope.lists = $rootScope.list.list_4;
    $scope.lists = angular.fromJson($stateParams.listd3);
    $log.debug("list3", JSON.stringify($scope.lists));
    /*切换状态*/
    $scope.goToPage = function(_Depth,_ParentID,_Name){
    	$rootScope.keyWord =null;
      $rootScope.sortID.sortFourID = _ParentID;
      //console.log("sortID:",JSON.stringify($rootScope.sortID));
      $log.debug("sortID",$rootScope.sortOneID,$rootScope.sortSecondID,$rootScope.sortThreeID,$rootScope.sortFourID);
      $state.go("tab.productList");
    };
  });
