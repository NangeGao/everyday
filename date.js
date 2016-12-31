/********
Show Date
********/

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
			console.error("计算当前月份数据错误");
			return;
		}
		for(var i=0, len=this.rowAmout*this.rows; i<len; i++) {
			this.$calendarCache[i].$dayView.innerHTML = currentMonthArr[i].date;	
		}
	},
	/**
	 * 计算当前月份日期数据
	 * @param {String/Int} year 年份
	 * @param {String/Int} month 月份
	 * @return {Array}  返回当前月份渲染到日历的数据，格式如下：
	 * @example
	 * [{
		 isCurrent: 0,	//是否当前月份，-1：上个月；0：当前月份；1：下个月
		 date: '20'		//日期
	   },...]
	 */
	calcMonthly: function(year, month) {
		var currentMonthArr = [];
		var commonYearArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		var leapYearArr = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

		for(var i=0, len=this.rowAmout*this.rows; i<len; i++) {
			var day = {"date": i+1};

			currentMonthArr.push(day);
		}
		return currentMonthArr;
	}
};

(new Calendar()).init();




