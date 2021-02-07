<template>
	<view class="container">
		<!-- tab栏 -->
		<scroll-view class="scroll-view_H b-t b-b" scroll-x>
			<block v-for="(item, index) in dateArr" :key="index">
				<div class="flex-box" @click="selectDateEvent(index, item)" :style="{ 'box-shadow': index == dateActive ? 'inset 0 -2px 0 0 ' + selectedTabColor : '' }">
					<view class="date-box">
						<text class="days" :style="{ color: index == dateActive ? selectedTabColor : '#333' }">{{ item.week }}</text>
						<text class="date" :style="{ color: index == dateActive ? selectedTabColor : '#333' }">{{ item.date }}</text>
					</view>
				</div>
			</block>
		</scroll-view>
		<!-- 时间选项 -->
		<view class="time-box">
				<block v-for="(item, key) in times" :key="key">
					<view class="item">
						<!-- <h6>productsCount: {{key}}</h6> -->
						<view
							class="item-box"
							:class="{ disable: item.disable, active:timeSelectdIndex==item.key}"
							:style="{
								background: timeSelectdIndex==item.key ? selectedItemColor : '#D6F5B0',
								filter: key < timeActive[1] && key > timeActive[0] ? 'opacity(0.3)' : ''
							}"
							@click="selectTimeEvent(key, item)"
						>
							<text>{{ item.time }}</text>
							<text class="all" v-if="item.disable">{{ disableText }}</text>
						</view>
					</view>
				</block>
		</view>
		
	</view>
</template>

<script>
import { dateData, timeData, timeStamp } from './date.js';
let maxIndex;
export default {
	name: 'SectionTimeSelector',
	props: {
		// 可以选择的天数
		maxDayCount: {
			type: Number,
			default: 14
		},
		// 提前预约的时间
		advanceTime: {
			type: Number,
			default: 0
		},
		// 默认选择的时间段间隔
		timeSlot: {
			type: Number,
			default: 2
		},
		//时间间隔
		timeInterval: {
			type: [Number, String],
			default: 0.5 //半小时
		},
		//选中的tab颜色
		selectedTabColor: {
			type: String,
			default: '#0092D5'
		},
		//选中的时间颜色
		selectedItemColor: {
			type: String,
			default: '#0094D7'
		},

		//禁用显示的文本
		disableText: {
			type: String,
			default: '约满'
		},
		times: {
			type: Array,
			default:() => [{key:'0',time:"08:00-10:00","disable":true},{key:'1',time:"10:00-12:00","disable":false},{key:'2',time:"22:00-24:00","disable":false}]
		},
		begin: {
			type: String,
			default: new Date().toISOString()
		},
		end: {
			type: String,
			default: new Date().toISOString()
		}
	},
	data() {
		return {
			dateArr: [], //日期数据
			timeArr: [], //时间数据
			dateActive: 0, //选中的日期索引
			timeActive: [], //选中的时间索引
			oldTimeActive: [], //保存用户筛选的时间
			selectDate: '', //选择的日期数据
			selectTime: [], //选择的时间
			oldSelectTime: '',
			currentTimeStamp: '',
			currentTime: '',
			tabs: 0,
			timeSelectdIndex:0,

		};
	},
	created() {
		this.init()
	 },
	 watch:{
		 end:(newVal,oldVal) => {
			 console.log("Y->",newVal,oldVal);

		 }
	},
	methods: {
		init(){
			console.log("init->",this.begin,this.end,this.maxDayCount);
			//获取日期tab数据
			this.dateArr = dateData(this.begin,this.end,this.maxDayCount)
			//获取时间数据
			this.timeArr = timeData(this.startTime, this.endTime, this.timeInterval);
			maxIndex = this.timeArr[this.timeArr.length - 1]['index'];
			//当前时间戳
			this.currentTimeStamp = Date.now() + this.advanceTime * 3600 * 1000;
			this.currentTime = timeStamp(this.currentTimeStamp).hour;
			this.timeArr.map(item => {
				if (item.time > this.currentTime) {
					return (item.disable = 0); //判断当前时间大于时间选项则禁用
				} else {
					return (item.disable = 1);
				}
			});
			//默认选中的日期
			this.selectDate = `${this.dateArr[0]['fullDate']}`;
			this.$emit('selectDate', this.selectDate);
		},
		selectDateEvent(index, item) {
			this.tabs = 0;
			if (this.currentTimeStamp < item.timeStamp) {
				const endIndex = this.timeSlot / this.timeInterval;
				this.timeActive = [0, endIndex];
				this.selectTime = [this.timeArr[0]['time'], this.timeArr[endIndex]['time']];
				this.timeArr.map(item => {
					return (item.disable = 0);
				});
			} else {
				this.timeActive = this.oldTimeActive;
				this.selectTime = this.oldSelectTime;
				this.timeArr.map(item => {
					if (item.time > this.currentTime) {
						return (item.disable = 0);
					} else {
						return (item.disable = 1);
					}
				});
			}
			this.dateActive = index;
			//this.selectDate = `${this.dateArr[index]['date']}(${this.dateArr[index]['week']})`;
		//	this.$emit('selectTime', `${this.selectDate}${this.selectTime.join('-')}`);
			this.selectDate = `${this.dateArr[index]['fullDate']}`;
			this.timeSelectdIndex=-1
			this.$emit('selectDate', this.selectDate);
		},
		selectTimeEvent(index, item) {
			if (item.disable ) return;
			this.timeSelectdIndex=item.key
			this.selectTime=item.time
			console.log('selectTimeEvent',item.key,this.timeSelectdIndex,item)
			//this.$set(this.timeActive, 0, index);
			//this.selectTime[0] = this.timeArr[index]['time'];
			var ret={
				date:this.selectDate,
				slice:this.timeSelectdIndex,
				label:`${this.selectDate} ${this.selectTime}`
			}
			this.$emit('selectTime', ret);
		}
	}
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
