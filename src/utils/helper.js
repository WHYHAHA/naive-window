let timeout = null

export default {
	/**
	 * debounce 函数防抖
	 * @param {function} fn
	 * @param {number} wait
	 * @returns
	 */
	Debounce: function (fn, wait) {
		if (timeout !== null) clearTimeout(timeout)
		timeout = setTimeout(fn, wait)
	},
	/**
	 * debounce 判断一个字符串(str)是否以指定的字符串(target)结尾。
	 * @param {String} str
	 * @param {String} target
	 * @returns
	 */
	confirmEnding: function (str, target) {
		// 请把你的代码写在这里
		var start = str.length - target.length;
		var arr = str.substr(start, target.length);
		if (arr == target) {
			return true;
		}
		return false;
	},
	readFile: function (file) {
		return new Promise(resolve => {
			let reader = new FileReader()
			reader.readAsBinaryString(file)
			reader.onload = ev => {
				resolve(ev.target.result)
			}
		})
	},

	/**
	 * format 时间戳转 yyyy-mm-dd hh:mm:ss
	 * @param {number} timestamp
	 * @returns
	 */
	format: function (timestamp) {
		var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
		var year = date.getFullYear(),
			month = ("0" + (date.getMonth() + 1)).slice(-2),
			day = ("0" + date.getDate()).slice(-2),
			hour = ("0" + date.getHours()).slice(-2),
			minute = ("0" + date.getMinutes()).slice(-2),
			second = ("0" + date.getSeconds()).slice(-2);
		// 拼接
		var result = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
		// 返回
		return result;
	},

	/**
	 * format 时间戳转 yyyy-mm-dd 00:00:00 
	 * @param {number} timestamp
	 * @returns
	 */
	formatStartTamp: function (timestamp) {
		var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
		var year = date.getFullYear(),
			month = ("0" + (date.getMonth() + 1)).slice(-2),
			day = ("0" + date.getDate()).slice(-2)
		// 拼接
		var result = year + "-" + month + "-" + day + " 00:00:00"
		// 返回
		return result;
	},

	/**
	 * format 时间戳转 yyyy-mm-dd 23:29:29 
	 * @param {number} timestamp
	 * @returns
	 */
	formatEndTamp: function (timestamp) {
		var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
		var year = date.getFullYear(),
			month = ("0" + (date.getMonth() + 1)).slice(-2),
			day = ("0" + date.getDate()).slice(-2)
		// 拼接
		var result = year + "-" + month + "-" + day + " 23:59:59"
		// 返回
		return result;
	},

	/**
	 * format 处理列表上的时间显示格式 2020-06-29 00:00:00 转为 2020-06-29  
	 * @param {number} timestamp
	 * @returns  yy-mm-dd
	 */
	timestampToTime: function (timestamp) {
		if (!timestamp) {
			return '';
		}
		var date = new Date(timestamp);
		var Y = date.getFullYear() + '-';
		var M = ("0" + (date.getMonth() + 1)).slice(-2) + '-';
		var D = ("0" + date.getDate()).slice(-2)
		return Y + M + D;
	},

	/**
	 * format 时间是否在当天
	 * @param {number} timestamp
	 * @returns
	 */
	dateInDay: function (timestamp) {
		var disabled = true
		var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
		var year = date.getFullYear(),
			month = ("0" + (date.getMonth() + 1)).slice(-2),
			day = ("0" + date.getDate()).slice(-2)
		// 拼接
		var toDayDate = new Date()
		var toDay_year = toDayDate.getFullYear(),
			toDay_month = ("0" + (toDayDate.getMonth() + 1)).slice(-2),
			toDay_day = ("0" + toDayDate.getDate()).slice(-2)

		if (year == toDay_year && month == toDay_month && day == toDay_day) {
			disabled = false
		}
		// 返回
		return disabled;
	},

	/**
	 * format 根据当前时间做比较是否在两天内 
	 * @param {number} timestamp
	 * @returns boolean
	 */
	dateInTwoDay: function (timestamp) {
		var date = new Date()//时间戳为10位需*1000，时间戳为13位的话不需乘1000
		var year = date.getFullYear(),
			month = ("0" + (date.getMonth() + 1)).slice(-2),
			day = ("0" + date.getDate()).slice(-2)
		// 当前时间
		var toDayDate = new Date(year + "-" + month + "-" + day + ' 00:00:00').getTime();

		var beforeYesterday = toDayDate - (2 * 24 * 3600 * 1000)

		return beforeYesterday > timestamp ? false : true
	},

	/**
	 * @param startDate  开始日期 yyyy-MM-dd
	 * @param enDate  结束日期 yyyy-MM-dd
	 * @returns {number} 两日期相差的天数
	 */
	getDaysBetween: function (startDate, enDate) {
		const sDate = Date.parse(startDate)
		const eDate = Date.parse(enDate)
		if (sDate > eDate) {
			return 0
		}
		if (sDate === eDate) {
			return 1
		}
		const days = (eDate - sDate) / (1 * 24 * 60 * 60 * 1000)
		return days
	},


	ObjectIsNull: function (object) {
		if (!object && typeof (object) != 'undefined' && object != 0) {
			return false
		}
		if (typeof (object) == "undefined") {
			return false //alert("undefined");
		}
		return Object.keys(object).length === 0
	},
	ObjectHaveKey: function (object) {
		if (!object && typeof (object) != 'undefined' && object != 0) {
			return false
		}
		if (typeof (object) == "undefined") {
			return false //alert("undefined");
		}
		if (Object.keys(object).length == 0) {
			return false
		}
		return true
	},
	StringIsNull: function (str) {
		return '' === str || str === null
	},

	fieldIsUndefined: function (object) {
		return typeof (object) === "undefined"
	},
	//生成从minNum到maxNum的随机数
	randomNum: function (minNum, maxNum) {
		switch (arguments.length) {
			case 1:
				return parseInt(Math.random() * minNum + 1, 10)
			case 2:
				return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
			//或者 Math.floor(Math.random()*( maxNum - minNum + 1 ) + minNum )
			default:
				return 0
		}
	},
	uuid: function () {
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = "-";

		var uuid = s.join("");
		return uuid;
	},

	/**
	 * Localstorage 存储数据
	 * @param {String} key
	 * @param {Object} value
	 * @returns
	 */
	setLocalstorage: function (key, value) {
		var storage = window.localStorage
		if (!storage) {
			window.alert('浏览器不支持localstorage')
			return false
		}
		if (Array.isArray(value)) {
			storage.setItem(key, JSON.stringify(value))
		} else {
			storage.setItem(key, value)
		}

	},

	/**
	 * Localstorage 提取存储
	 * @param   {String} key
	 * @returns {Boolean} Boolean or String
	 */
	getLocalstorage: function (key, defalut) {
		var storage = window.localStorage
		if (!storage) {
			window.alert('浏览器不支持localstorage')
			return defalut
		}
		let value = storage.getItem(key)
		if (value && value.charAt(value.length - 1) == ']') {
			return JSON.parse(value)
		} else {
			return value ? value : defalut
		}

	},

	/**
	 * Localstorage 删除存储
	 * @param {String} key
	 * @returns
	 */
	removeLocalstorage: function (key) {
		var storage = window.localStorage
		if (!storage) {
			window.alert('浏览器不支持localstorage')
			return false
		}
		storage.removeItem(key)
	},


}
