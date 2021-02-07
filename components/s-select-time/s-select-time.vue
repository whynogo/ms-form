<template>
    <view class="time-container">
        <view class="item-container" v-for="(item, index) in timeList" :key="index">
            <view class="time-item" @click="selectTime(item)" :class="{
                'disabled-time': item.disabled,
                'clicked-time': !item.disabled && item.selected,
                'range-time': item.range && !item.disabled,
                'start-time': true,
                'end-time': item.end,
            }">
                <view>{{item.time}}</view>
                <view class="tip-font" v-if="item.start">开始</view>
                <view class="tip-font" v-if="item.end">结束</view>
            </view>
            <view class="time-space" :class="{
                'range-space': item.rangeHelp
            }"></view>
        </view>
    </view>
</template>

<script>
//import moment from 'moment/min/moment.min.js'
import moment from 'dayjs'
export default {
    name: 'SSelectTime',
    props: {
        currentTime: {
            type: String,
            default: moment().format('YYYY-MM-DD HH:mm')
        },
        currentDate: {
            type: String,
            default: moment().format('YYYY-MM-DD')
        },
        interval: {
            type: Number, // 时间间隔取值1-60整数分钟
            default: 30
        },
        startTime: {
            type: String,
            default: '07:00:00'
        },
        offTime: {
            type: String,
            default: '23:00:00'
        },
        disableTimes: {
            type: Array,
            default: () => []
        },
        isDisabled: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            timeList: [],
            selectedTime: [],
			disabledTime:[],
			endTime:'23:00'
        }
    },
	watch:{
		 disableTimes:function(newVal,oldVal) {
			 //console.log("Y->disableTimes",newVal,oldVal);
			 this.disabledTime.length=0
			 newVal.map(item=>{
			//	 console.log("Y->",item)
				 this.disabledTime.push(item)
			 })
			this.hadleData()		
		 },
		 startTime:function(newVal,oldVal) {
			 console.log("Y->",newVal,oldVal);
			// this.hadleData() 为了节省cpu，注释掉一个		
		 },
		 offTime:function(newVal,oldVal) {
		 	console.log("Y->offTime",newVal,oldVal);
			this.endTime = newVal
		 	this.hadleData()		
		 }
	},
    methods: {
        timeHandle (Number) {
            if (`${Number}`.length < 2) {
                return `0${Number}`
            } else {
                return `${Number}`
            }
        },
		isDisableItem(st){
			let ret= this.isDisabled && st < moment(this.currentTime)
			if(ret)
				return true
			else{	
				if (this.disabledTime.length > 0) {
					for (const item of this.disabledTime) {
						const start = moment(`${this.currentDate} ${item.begin}`)
						const end = moment(`${this.currentDate} ${item.end}`)
						if ((st >= start||st.add(this.interval,"minutes")> start) && st <= end) {
							//console.log("disbale=>",st.format('HH:mm'),start.format('HH:mm'),end.format('HH:mm'))
							return true
						}
					}
					
				}
				return false
			}
			
		},
		update(){
			this.$nextTick(() => {
				this.hadleData()
			})
		},
        hadleData () { // 处理数据
			this.timeList.length=0
            const end = this.offTime
			var tomorrow=moment().add(1, 'days').format('YYYY-MM-DD')
			var endDate="00:00:00"==this.offTime?tomorrow:this.currentDate
			console.log("==>",moment(`${this.currentDate} ${start}`).add(this.interval,"minutes").format('HH:mm'))
			
	        let start = moment(`${this.currentDate} ${this.startTime}`)
			let st=start
			let et=	moment(`${endDate} ${end}`)
			while (start.add(this.interval,"minutes") < et) {
				
				let st=start.add(this.interval,"minutes")  
                const item = {
					datetime:st.format('YYYY-MM-DD HH:mm:ss'),
                    time: st.format('HH:mm'),
                    selected: false,
                    disabled: this.isDisableItem(st),
                    range: false,
                    rangeHelp: false,
                    start: false,
                    end: false
                }
				start=st
				//console.log("start=>",item.time)

                this.timeList.push(item)
            }
            const starteItem = {
				datetime:st.format('YYYY-MM-DD HH:mm:ss'),
                time:  st.format('HH:mm'),
                selected: false,
                disabled: this.isDisableItem(st),
                range: false,
                rangeHelp: false,
                start: false,
                end: false
            }
            this.timeList.unshift(starteItem)

            const endItem = {
				datetime:et.format('YYYY-MM-DD HH:mm:ss'),
                time: et.format('HH:mm'),
                selected: false,
                disabled: this.isDisableItem(et),
                range: false,
                rangeHelp: false,
                start: false,
                end: false
            }
            this.timeList.push(endItem)
        },
        selectTime (item) { // 选择时间
            if (!item.disabled && !item.selected) {
                for (const items of this.timeList) {
                    if (items.time === item.time) {
                        if (this.selectedTime.length < 2) {
							items.selected = true
							this.selectedTime.push(item.datetime)
                        }
                    }
                }
            } else if (!item.disabled && item.selected) { // 点击选中的时间取消选中，将该时间从选择的时间数组中删除
                for (const items of this.timeList) {
                    if (items.time === item.time) {
                        items.selected = false
                        items.start = false
                        items.end = false
                        this.selectedTime.splice(this.selectedTime.indexOf(item.datetime), 1)
                    }
                }
            }
            if (this.selectedTime.length < 2) {
                for (const items of this.timeList) {
                    if (this.selectedTime.length === 1) {
                        if (items.datetime === this.selectedTime[0]) {
                            items.start = true
                            items.end = false
                        }
                    } else {
                        items.start = false
                        items.end = false
                    }
                    items.range = false
                    items.rangeHelp = false
                }
            } else {
                const timeStrat = this.selectedTime[0]
                const timeEnd = this.selectedTime[1]
                const arr = []
                if (moment(timeStrat) > moment(timeEnd)) {
                    arr[0] = timeEnd
                    arr[1] = timeStrat
                } else {
                    arr[0] = timeStrat
                    arr[1] = timeEnd
                }
                for (const itemTime of this.timeList) {
                    if (itemTime.datetime === arr[0]) {
                        itemTime.start = true
                        itemTime.end = false
                    } else if (itemTime.datetime === arr[1]) {
                        itemTime.start = false
                        itemTime.end = true
                    } else {
                        itemTime.start = false
                        itemTime.end = false
                    }
                    if (moment(itemTime.datetime) > moment(arr[0]) 
						&& moment(itemTime.datetime) < moment(arr[1])) {
                        itemTime.range = true
                        itemTime.rangeHelp = true
                    } else if (itemTime.time === arr[0]) {
                        itemTime.rangeHelp = true
                    } else {
                        itemTime.range = false
                        itemTime.rangeHelp = false
                    }
                }
            }
            this.$emit('selectedTime', this.selectedTime)
        },
    },
    created () {
        //this.hadleData()
    }
}
</script>

<style lang="scss" scoped>
    .time-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding-top: 20upx;
        padding-bottom: 20upx;
        padding-left: 30upx;
        .item-container {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            padding: 10upx 0;

            .time-item {
                height: 90upx;
                width: 90upx;
                padding: 30upx 20upx 30upx 10upx;
                border:1upx solid rgba(206,207,218,1);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                -webkit-border-radius: 8upx;
                -moz-border-radius: 8upx;
                border-radius: 8upx;
                color: #3e4350;
                font-size: 26upx;
                position: relative;
				background: #c9e8c4;
                .tip-font {
                    font-size: 16upx;
                    // position: absolute;
                    bottom: -8upx;
                    left: 20upx;
                }
            }
            .time-space {
                width: 10upx;
                height: 90upx;
            }
            // 禁选时间样式
            .disabled-time {
                background: #CECFDA;
            }
            // 点击选择时间样式
            .clicked-time {
                background: #1D8BE8;
                border: none;
                color: #ffffff;
            }
            // 选择时间之间时间的样式
            .range-time {
                border: none;
                background: #DDEEFC;
                color: #474F66;
                border-radius: 0;
            }
            // 中间部分
            .range-space {
                background: #DDEEFC;
            }
        }
    }
</style>
