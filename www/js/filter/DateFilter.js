/**
 * Created by huang on 2016/9/23 0023.
 */
angular.module('ico2o.filter.dateFilter', [])
	.filter('dateFilter', function($filter) {
			return function(date,format) {
					//先得到时间戳
					var timestamp = Number(date.replace(/\/Date\((\d+)\)\//, "$1"));
					//转成指定格式
					return $filter("date")(timestamp, format);
			}
	});