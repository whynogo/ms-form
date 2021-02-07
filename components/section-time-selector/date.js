//字符串拼接
function strFormat(str) {
	return str < 10 ? `0${str}` : str
}
//时间戳转日期
export function timeStamp(time) {
	const dates = new Date(time)
	const year = dates.getFullYear()
	const month = dates.getMonth() + 1
	const date = dates.getDate()
	const day = dates.getDay()
	const hour = dates.getHours()
	const min = dates.getMinutes()
	const days = ['日', '一', '二', '三', '四', '五', '六']
	return {
		allDate: `${year}-${strFormat(month)}-${strFormat(date)}`,//注:此处ios系统如"-"分割无法显示,只能用"/"分割符
		date: `${strFormat(month)}-${strFormat(date)}`, //返回的日期 07-01
		day: `星期${days[day]}`, //返回的礼拜天数  星期一
		hour: strFormat(hour) + ':' + strFormat(min) //返回的时钟 08:00
	}
}


function differDays(sDate1, sDate2) {  
   var dateSpan,tempDate,iDays
   dateSpan = Date.parse(sDate2) - Date.parse(sDate1);    
   dateSpan = Math.abs(dateSpan)
   iDays = Math.floor(dateSpan / (24 * 3600 * 1000));        
   return iDays+1    
}

function deltaDays(sDate1, sDate2) { 
   var days=Date.parse(sDate1.toDateString())-Date.parse(sDate2.toDateString() )
   var iDays = Math.abs(Math.floor(days/ (24 * 3600 * 1000)));        
   return iDays  
}

function isSameYear(sDate1, sDate2){
	return sDate1.getFullYear()==sDate2.getFullYear()
}
//获取最近dayCount天的日期和礼拜天数
export function dateData(begin,end,maxDay) {
	const time = []
	console.log("Z->",new Date(begin),new Date())
	const date = new Date(begin)>new Date()?new Date(begin):new Date()
	const now = date.getTime() //获取当前日期的时间戳
	let timeStr = 3600 * 24 * 1000 //一天的时间戳
	var dayCount=Math.min(differDays(date,end),maxDay)
	for (let i = 0; i < dayCount; i++) {
		const timeObj = {}
		timeObj.date = timeStamp(now + timeStr * i).date //保存日期
		timeObj.fullDate = timeStamp(now + timeStr * i).allDate //保存日期
		timeObj.timeStamp = now + timeStr * i //保存时间戳
		
		var curDate=new Date(timeObj.fullDate);
		var days=deltaDays(curDate,new Date())
		if (0 == days) {
			timeObj.week = '今天'
		} else if (days == 1) {
			timeObj.week = '明天'
		} else if (days == 2) {
			timeObj.week = '后天'
		} else {
			if(isSameYear(curDate,new Date()))
				timeObj.week = timeStamp(now + timeStr * i).day
			else
				timeObj.week=curDate.getFullYear()+"年"
		}
		time.push(timeObj)
		//console.log("dateData",time)
	}
	return time
}
//时间数组
export function timeData(startTime = '08:00', endTime = '18:30', timeInterval = 0.5) {
	const time = []
	const date = timeStamp(Date.now()).allDate
	const startDate = `${date} ${startTime}`
	const endDate = `${date} ${endTime}`
	const startTimeStamp = new Date(startDate).getTime()
	const endTimeStamp = new Date(endDate).getTime()
	const timeStr = 3600 * 1000 * timeInterval
	//console.log(startTimeStamp)
	let count = 0
	for (let i = startTimeStamp; i <= endTimeStamp; i = i + timeStr) {
		const timeObj = {}
		timeObj.time = timeStamp(i).hour
		timeObj.disable = 1
		timeObj.index = count
		time.push(timeObj)
		count ++
	}
	//console.log(JSON.stringify(time))
	return time
}

