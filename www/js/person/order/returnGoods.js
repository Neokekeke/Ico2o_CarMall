/**
 * Created by Happy Every Day on 2016/9/29.
 */
angular.module('ico2o.controllers.returnGoods',[])
  .controller("returnGoods",function($scope,$http,$ionicLoading,$stateParams,locals,$ionicPopup,$log,$rootScope){

    $scope.returnSum = 0;

    $scope.UserID = locals.get("UserID");

    $scope.Status4 = "OrderAlreadyForDeliver";

    $scope.reGoods = [];
    var url = $rootScope.host +'/ASHX/MobileAPI/Order/Get.ashx';
    /*数据加载中*/
    $scope.myloading = $ionicLoading.show();
    $http({
      method: 'get',
      url: url,
      params: {
        UserID: $rootScope.UserID,
        IsShopper: false,
        /*购物车*/
        PageNO: 1,
        PageSize: 3,
        Status: '',
        OrderNO:$stateParams.index
      }
    })
      .success(function(data) {
        $scope.reGoods = data.data[0];

        console.log($scope.reGoods);
        $scope.myloading = $ionicLoading.hide();
        $scope.TotalSum1 = 0;
        for(var i = 0; i < $scope.reGoods.ListOrdersItem.length; i++) {
          /*商品总价格*/
          $scope.TotalSum1 += $scope.reGoods.ListOrdersItem[i].Price * $scope.reGoods.ListOrdersItem[i].Quantity;
          /*商品总数量*/
          $scope.ProductSum += $scope.reGoods.ListOrdersItem[i].Quantity;
          //$scope.TotalSum[$stateParams.index] = $scope.ProductSum;
        }
      }).error(function(error) {
      console.log("error", error);
    });

    /*单选订购车商品*/
    /*设置单选按钮--全选或反选的状态*/
    $scope.setBoxCheckedIndex = false;
    $scope.Selected = [];/*选定监听器数组*/

    $scope.itemArr = [];//退货item数据加所需参数

    $scope.Itemsboolean = [];//商品选中后取消判断,布尔数组存值

    var setBox = function (bool) {
      for (var i = 0; i < $scope.reGoods.length; i++) {
        $scope.Selected[i] = bool;
        $scope.selectAllProduct = bool;
      }
    };
    setBox(true);

    /*单选*/
        $scope.isSelected = function (index) {

          $scope.Selected[index] = !$scope.Selected[index];

          //$scope.Itemsboolean.push($scope.Selected[index]);

          if ($scope.Selected[index] == true) {
            $scope.returnSum += $scope.reGoods.ListOrdersItem[index].Price * $scope.reGoods.ListOrdersItem[index].Quantity;

            $scope.Itemsboolean[index] = true;

            //items数组所需参数
            $scope.item =
            {
              OrderItemID: $scope.reGoods.ListOrdersItem[index].ProductID,
              Name: $scope.reGoods.ListOrdersItem[index].Name,
              Price: $scope.reGoods.ListOrdersItem[index].Price,
              Quantity: $scope.reGoods.ListOrdersItem[index].Quantity,
              IsReturnOtherPrice: false,
              OtherPrice: $scope.reGoods.OtherPrice
            };

            //将选中的商品加入数组中
            $scope.itemArr.push($scope.item);

            $log.debug("items选中", $scope.itemArr,$scope.Itemsboolean);
          }

          if ($scope.Selected[index] == false) {
            $scope.Itemsboolean[index] = false;

            $scope.setBoxCheckedIndex = false;
            $scope.selectAllProduct = false;
            $scope.returnSum -= $scope.reGoods.ListOrdersItem[index].Price * $scope.reGoods.ListOrdersItem[index].Quantity;

            //退货item数组取消

            for(var j = 0; j < $scope.reGoods.ListOrdersItem.length;j++)
            {
              if($scope.Itemsboolean[j] == false)
              $scope.itemArr.splice(j, 1);
            }
              $log.debug("items取消选择后", $scope.itemArr,$scope.Itemsboolean);
          }
        };


    //申请退货退款
    //申请退货
    $scope.reason = [
      {reasons: "1" },
      {reasons: "2" },
      {reasons: "3" }
    ];

    $scope.reason2 = '';
    $scope.returngoods = function(){
      var url2 = $rootScope.host +'/ASHX/MobileAPI/ReturnGood/Add.ashx';

      if($scope.returnSum!=0)
      {
        $http({
          method: 'post',
          url: url2,
          params: {
            UserID: $rootScope.UserID,
            OrderNO:$scope.reGoods.OrderNO,
            OrderID:$scope.reGoods.ID,
            Items:angular.toJson($scope.itemArr),
            Amount:$scope.returnSum,
            Freight:0,
            Reason:$scope.returnReason,
            Note:$scope.reason2,
            IsReturnFreight:false
          }
        })
          .success(function(data) {
            $scope.reason2 = '';

            console.log(data,
              $scope.itemArr,
              $scope.$scope.returnReason,
              $scope.reason2
            );
            alertPopup = $ionicPopup.alert({
              title: data.message
            });
          }).error(function(error) {
          console.log("error", error);
        });
      }
      else {
        $ionicPopup.alert({
          title: "请选择要退货的商品"
        });
      }
    };


  });
