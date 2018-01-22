angular.module('ico2o.service.wechatPay', [])
  .service('wechatPayService',  function ($rootScope,$window,$ionicLoading,locals,
  	cookieService,$location,$ionicPopup,$http) {
  	
  	//获取openid
    var getOpenId = function () {
        if(!cookieService.get("OpenId"))
            window.location.href = $rootScope.host + "/ASHX/MobileAPI/Pay/getOpenId.ashx?WxIndexUrl=" + $location.absUrl();
        locals.set("OpenId",cookieService.get("OpenId"));
    };
  	
  	/*订单支付*/
    var payOrder = function (orderId) {
        //alert(orderId);
        loadingShow();
        if (!locals.get("OpenId")) {
            //alert(!$scope.openId);
            getOpenId();
        }
        //alert(!$scope.openId);
        if (!locals.get("OpenId")) {
            loadingClose();
            //显示支付失败，重新点击支付
            alertPopup = $ionicPopup.alert({
                title: '',
                template: '微信支付失败，请稍后再试！'
            });
            return;
        }

        //订单支付的接口
        var payDataUrl = $rootScope.host + '/ASHX/MobileAPI/Pay/WxJsApiPayData.ashx';
        $http({
            method: 'post',
            url: payDataUrl,
            params: {
                openId: locals.get("OpenId"),
                OrderId: orderId
            }
        }).success(function (data) {
            loadingClose();
            console.log("payData:", data);
            
            //获取支付数据成功
            if (data.state) {
                var json = JSON.parse(data.data);
                
                var payData = json;
                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', function () {
                            jsApiCall(json);
                        }, false);
                    }
                    else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', function () {
                            jsApiCall(json);
                        });
                        document.attachEvent('onWeixinJSBridgeReady', function () {
                            jsApiCall(json);
                        });
                    }
                }
                else {
                    jsApiCall(json);
                }
            }
                //获取支付数据失败
            else {
                console.log("访问payDataUrl成功，但payData错误:", data.result);
                $ionicPopup.alert(
                	{
                		title:data.result
                	}
                )
            }
        }).error(function (err) {
            loadingClose();
            console.log("获取payData时出错:", err);
        })
    }
    /* 调用微信支付接口 */
    var jsApiCall = function (payData) {
        WeixinJSBridge.invoke(
                   'getBrandWCPayRequest',
                    payData,//josn串
                    function (res) {
                        WeixinJSBridge.log(res.err_msg);
                        alert(res.err_code + res.err_desc + res.err_msg);
                    }
        );
    }


    //显示正在加载动画
    var loadingShow = function () {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    };
    //关闭正在加载动画
    var loadingClose = function () {
        $ionicLoading.hide();
    };
  	
  	return {
  		payOrder:payOrder
  	}
  	
  })





