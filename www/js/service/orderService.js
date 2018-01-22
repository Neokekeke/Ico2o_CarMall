/**
 * Created by huang on 2016/9/30 0030.
 */
angular.module('ico2o.services.order', [])
  .service('orderService',function($q,$http,$rootScope,$log) {
    var url_addOrder = $rootScope.host + "/ASHX/MobileAPI/Order/AddOrder.ashx";
    var url_getPaymentTypes = $rootScope.host + "/ASHX/MobileAPI/Pay/GetPaymentTypes.ashx";

    var deffered;
/*      $http(
        {
          method:'post',
          url:url_getPaymentTypes
        }
      )
        .success(function(result){

        })
    };*/
    var addOrder = function(UserID,ShopCarsID,Address,Mobile,ExpresPrice,Name,InvoiceType,InvoiceAddress,InvoiceName,InvoiceTariff,
                            BookingDate,Description,IsShopper,IsBindingBoxCost,LogisticsCompany,PaymentID,PayMethod,
                            PostCode,TypeValue,IsShopToBooking){
      $log.debug("",UserID,ShopCarsID,Address,Mobile,ExpresPrice,Name,InvoiceType,InvoiceAddress,InvoiceName,InvoiceTariff,
                            BookingDate,Description,IsShopper,IsBindingBoxCost,LogisticsCompany,PaymentID,PayMethod,
                            PostCode,TypeValue,IsShopToBooking);
      deffered = $q.defer();
      $http(
        {
          method:'post',
          url:url_addOrder,
          params: {
            UserID: UserID,
            ShopCarsID: ShopCarsID,
            Address: Address,
            Mobile: Mobile,
            ExpresPrice: ExpresPrice,
            Name: Name,
            InvoiceType: InvoiceType,//发票信息
            InvoiceAddress: InvoiceAddress,
            InvoiceName: InvoiceName,
            InvoiceTariff: InvoiceTariff,
            BookingDate:BookingDate,//预约时间
            Description: Description,//备注
            IsShopper: IsShopper,//是否为订购车
            IsBindingBoxCost: IsBindingBoxCost,//是否需要钉箱费
            LogisticsCompany: LogisticsCompany,
            PaymentID: PaymentID,//支付类型ID(支付宝),
            PayMethod: PayMethod,//支付方式
            PostCode: PostCode,//邮政编码
            TypeValue: TypeValue,//提货方式(发货到定点维修站,自提预约,送货上门)
            IsShopToBooking: IsShopToBooking//是否预约提货(如果发货点为自提预约则为true)
          }
        }
      )
        .success(function(result){
          deffered.resolve(result);
        })
        .error(function(error){
          deffered.reject(error);
        });
      return deffered.promise;
    };

    //将状态编码转换为状态描述
    var orderStatusDes = function(orderStatus){
    	if(orderStatus == 'HasOrder')
    		return "待付款";
    	if(orderStatus == 'InTransit')
    		return "待收货";
    	if(orderStatus == 'OrderPayed')
    		return "待发货，买家已付款";
    	if(orderStatus == 'OrderHadCancelled')
    		return "已取消";
    	if(orderStatus == 'OrderAlreadyForIncomed')
    		return "已支付";
    	if(orderStatus == 'OrderAlreadyForDeliver')
    		return "已收货";
    	if(orderStatus == 'ToBeSelfReference')
    		return "待自提";
    	if(orderStatus == 'OrderAlreadyForReceive')
    		return "已收货";
    	if(orderStatus == 'OrderHadFinished')
    		return "交易成功";
    	else
    		return orderStatus;
    };

    //根据订单状态判断是否可以查看物流信息
    var isShowDK = function(order){
    	if(order.Status == 'OrderAlreadyForReceive' || order.Status == 'InTransit' || order.Status == 'OrderAlreadyForDeliver' || order.Status == 'OrderHadFinished' || order.Status == 'ToBeSelfReference')
    		return true;
    	return false;
    };

    function ParseDateTime(str)
	{
	    str = str.replace("T"," ");
	    var date = new Date(str);
	    return date;
	}

    //是否显示退货按钮
    var isShowReturnGoodsBtn = function(order){
    	if(order.IsReturnGoods)
    		return false;

    	if(order.Status == 'HasOrder' && order.Status == 'OrderHadCancelled')
    		return false;


    	if(order.ReceiveDate != null && new Date().getTime() - ParseDateTime(order.ReceiveDate.toString()).getTime() >= 7 * 24 * 60 * 60 * 1000);
	    	return false;
	    return true;
    };

    return{
      addOrder:addOrder,
      orderStatusDes:orderStatusDes,
      isShowDK:isShowDK,
      isShowReturnGoodsBtn:isShowReturnGoodsBtn
    }
  });
