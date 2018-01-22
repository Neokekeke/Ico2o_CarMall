/**
 * Created by lwx on 2016/10/14.
 */
angular.module('ico2o.services.cookie', [])
  .service('cookieService',function($q,$http,$rootScope) {

	var set = function(name,value)
	{
		var Days = 30;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days*24*60*60*1000);
		document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	};
	//使用示例
	//setCookie("name","hayden");
	//alert(getCookie("name"));

	//如果需要设定自定义过期时间
	//这是有设定过期时间的使用示例：
	//s20是代表20秒
	//h是指小时，如12小时则是：h12
	//d是天数，30天则：d30
	//setCookie("name","hayden","s20");
	/*function set(name,value,time)
	{
		var strsec = getsec(time);
		var exp = new Date();
		exp.setTime(exp.getTime() + strsec*1);
		document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	};*/
	function getsec(str)
	{
		var str1=str.substring(1,str.length)*1;
		var str2=str.substring(0,1);
		if (str2=="s")
		{
			return str1*1000;
		}
		else if (str2=="h")
		{
			return str1*60*60*1000;
		}
		else if (str2=="d")
		{
			return str1*24*60*60*1000;
		}
	};



	var deleteCookie = function(name)
	{
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval=get(name);
		if(cval!=null)
			document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	};

  	var get = function(name)
	{
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	};

	return {
		set:set,
		delete:deleteCookie,
		get:get
	}
  });
