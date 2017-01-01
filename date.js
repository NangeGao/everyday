
var Calendar = function(){
	this.$vessel = document.querySelector("#vessel");
	this.vesselWidth = this.$vessel.offsetWidth;
	this.vesselHeight = this.$vessel.offsetHeight;
	this.rowAmout = 7;	//每行显示几天
	this.rows = 6;	//一共有几行

	this.today = {};
	var today = new Date();
	this.today.year = today.getYear() + 1900;
	this.today.month = today.getMonth() + 1;
	this.today.day = today.getDate();
};

Calendar.prototype = {
	init: function(){
		this.renderViewport();
		this.generateCalendar();
	},
	renderViewport: function(){
		this.$calendarCache = [];
		this.$calendar = document.createElement("ul");
		this.$calendar.setAttribute("class", "calendar");
		for(var i=0,len=this.rowAmout*this.rows; i<len; i++) {
			var $day = document.createElement("li");
			$day.style.width = this.vesselWidth/this.rowAmout + "px";
			$day.style.height = this.vesselHeight/this.rows + "px";
			var $dayView = document.createElement("span");
			$day.appendChild($dayView);
			this.$calendar.appendChild($day);
			this.$calendarCache.push({
				"$day": $day,
				"$dayView": $dayView
			});
		}
		this.$vessel.appendChild(this.$calendar);
	},
	generateCalendar: function(){
		this.renderMonthly(this.today.year, this.today.month);
	},
	renderMonthly: function(year, month) {
		var currentMonthArr = this.calcMonthly(year, month);
		if (currentMonthArr.length !== this.$calendarCache.length) {
			console.error("计算当前月份渲染数据错误");
			return;
		}
		for(var i=0, len=this.rowAmout*this.rows; i<len; i++) {
			this.$calendarCache[i].$dayView.innerHTML = currentMonthArr[i].date;
			if(currentMonthArr[i].ifCurrent) {
				this.$calendarCache[i].$dayView.setAttribute("class", "disabled");
			}	
		}
	},
	/**
	 * 计算当前月份日期数据
	 * @param {String/Int} year 年份
	 * @param {String/Int} month 月份
	 * @return {Array}  返回当前月份渲染到日历的数据，格式如下：
	 * @example
	 * [{
		 ifCurrent: 0,	//是否当前月份，-1：上个月；0：当前月份；1：下个月
		 date: '20'		//日期
	   },...]
	 */
	calcMonthly: function(year, month) {
		var currentMonthArr = [];
		var thisMonthDays = calcMonthDays(year, month);
		var thisMonth = getProgressiveArray(thisMonthDays);
		console.log(thisMonth);

		//计算上个月份
		var lastMonthAmout = 0;	//上个月显示几天
		var lastMonth_month = month-1 ? month-1 : 12;
		var lastMonth_year = lastMonth_month===12 ? year-1 : year;
		var lastMonthDays = calcMonthDays(lastMonth_year, lastMonth_month);
		var lastMonth = (function(){
			var arr = getProgressiveArray(lastMonthDays);
			//计算当月第一天是星期几
			var firstDayOfMonth = new Date(year+'-'+month+'-01');
			var whatDay = firstDayOfMonth.getDay();
			if (!whatDay) {		
				whatDay = 7;	//如果是0，则是周日
			}
			lastMonthDays = whatDay-1;
			arr = arr.slice(-lastMonthDays);
			console.log('lastMonth',arr);

			return arr;
		})();

		//计算下个月份
		var nextMonthAmout = this.rowAmout*this.rows - thisMonthDays - lastMonthDays;	//下个月显示几天
		var nextMonth_month = month+1>12 ? 1 : month+1;
		var nextMonth_year = nextMonth_month===1 ? year+1 : year;
		var nextMonthDays = calcMonthDays(nextMonth_year, nextMonth_month);
		var nextMonth = (function(){
			var arr = getProgressiveArray(nextMonthDays);
			arr = arr.slice(0, nextMonthAmout);
			console.log('nextMonth',arr);

			return arr;
		})();

		//合成渲染日期数据
		lastMonth = lastMonth.map(function(item, index){
			return {
				"ifCurrent": -1,
				"date": item
			}
		});
		thisMonth = thisMonth.map(function(item, index){
			return {
				"ifCurrent": 0,
				"date": item
			}
		});
		nextMonth = nextMonth.map(function(item, index){
			return {
				"ifCurrent": 1,
				"date": item
			}
		});
		currentMonthArr = lastMonth.concat(thisMonth.concat(nextMonth));
		console.log(currentMonthArr);


		//计算某个月份的天数
		function calcMonthDays(year, month) {
			var commonYearArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			return (month==2)&&((!(year%4)&&(year%100))||(!(year%400))) ? 29 : commonYearArr[month-1];
		}
		//生成一个[1,2,3,...,n]的数组
		function getProgressiveArray(n) {
			return (new Array(n)).toString().split(",").map(function(item, index){
				return index+1;
			});
		}

		return currentMonthArr;
	}
};

(new Calendar()).init();