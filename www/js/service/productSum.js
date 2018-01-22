/**
 * Created by Happy Every Day on 2016/10/10.
 */
angular.module('ico2o.productSumService',[])
  .factory('proSum',function($log){
    return{
      productSum : function(data,priSum,proSum){
      angular.forEach(data,
        function(datas,index,arr){
          //$scope.orderNo.push(datas.OrderNO);
          var pro = 0;
          var pri = 0;
          datas.ListOrdersItem = angular.fromJson(datas.ListOrdersItem);
          if(datas.length!=0)
          {
            for(var k =0;k < datas.ListOrdersItem.length ;k++)
            {
              var p = angular.fromJson(datas.ListOrdersItem[k]);
              pri += p.Price * p.Quantity;
              pro += p.Quantity;
            }
          }
          console.log(datas.ListOrdersItem,pri,pro);
          /*            $scope.priSum[index] = pri;
           $scope.proSum[index] = pro;*/
          priSum.push(pri);
          proSum.push(pro);
          $log.debug(priSum, proSum);
        });
      }
    }
  });
