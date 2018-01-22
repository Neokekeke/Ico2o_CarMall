/**
 * Created by fan on 2016/9/18 .
 */
angular.module('ico2o.controllers.orderlist2', [])
  .controller('orderlist2',function($scope,$cacheFactory){
    $scope.orderitem = $cacheFactory.get("reservationService_cache").get("orderlist");
  });
