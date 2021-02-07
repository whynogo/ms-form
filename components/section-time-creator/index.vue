<template>
	<view class="container">
		<view class="top-bar">

			<section-time-picker class="bar" ref="classSelector" @change="sectionChanged" @input="sectionChanged" v-model="timeSection" :activeValue="curTimeSection"></section-time-picker>
			<text>/</text>
			<uni-number-box :value="max_rev" class="bar" :min="1" :max="999" @change="numChanged"></uni-number-box>
			<u-button class="bar-button" shape="circle" type="primary" @click="addTimeSection">＋</u-button>

			<!-- 时间选项 -->
		</view>
		
		<view class="time-box">
			<block v-for="(item, key) in times" :key="key">
				<view class="item">
					<!-- <h6>productsCount: {{key}}</h6> -->
					<view class="item-box" :class="{ disable: item.disable, active:timeSelectdIndex==item.key}" :style="{
								background: 0==editMode?(timeSelectdIndex==item.key ? selectedItemColor : '#D6F5B0'):'#e7e4f0',
								filter: key < timeActive[1] && key > timeActive[0] ? 'opacity(0.3)' : ''
							}"
					 @click="selectTimeEvent(key, item)"
					 @longpress="editMode=editMode==0?1:0" 
					 >
						<text class="section-info">{{ item.time }}/{{ item.max }}</text>
						<text class="all section-info" v-if="item.disable">{{ disableText }}</text>
					<view class="delete-view">
							<u-button type="error" size="mini"v-show="1==editMode" @click="delSection(item)">删除</u-button>
					</view>
					</view>
				</view>
			</block>
		</view>
		<u-picker mode="time" v-model="params.show" :value="begin" :params="params" @confirm="onBeginChanged"></u-picker>
	</view>
</template>

<script>
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	var that=null
	import {
		dateData,
		timeData,
		timeStamp
	} from './date.js';
	import SectionTimePicker from '@/components/section-time-picker.vue';
	let maxIndex;
	export default {
		name: 'SectionTimeCreator',
		components: {
			SectionTimePicker, uniNumberBox
		},
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
			timeSections: {
				type: Array,
				default: () => [{
					key: '0',
					time: "08:00-10:00",
					disable: false,
					max:10
				}, {
					key: '1',
					time: "10:00-12:00",
					disable: false,
					max:10
				}, {
					key: '2',
					time: "22:00-24:00",
					disable: false,
					max:10
				}, {
					key: '2',
					time: "12:00-14:00",
					disable: false,
					max:10
				}]
			}

		},
		data() {
			return {
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false,
					show: false
				},
				begin: '',
				end: '',
				max_rev:10,
				times:this.timeSections,
				timeSection:'00:00-00:00',
				editMode:0,
				curTimeSection:'00:00-00:00',

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
				timeSelectdIndex: null,

			};
		},
		created() {
			that=this
			this.init()
		},
		watch: {
			timeSections: function(newVal, oldVal){
				console.log("Y->", newVal);
				this.times=newVal
				if(this.times.length>0&&null==this.timeSelectdIndex){
					this.timeSelectdIndex=this.times[0].key
					this.curTimeSection=this.times[0].time
				}
			}
		},
		methods: {
			init() {
				//console.log("init->",this.begin,this.end,this.maxDayCount);
			},
			getUUID(){
			  function rx() {
			    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
			  }
			  return `${+new Date()}_${rx()}${rx()}`
			},
			selectTimeEvent(index, item) {
				if (item.disable) return;
				this.timeSelectdIndex=item.key
				this.max_rev=item.max
				this.curTimeSection=item.time
				this.$forceUpdate();
				// this.selectTime=item.time
				// console.log('selectTimeEvent',item.key,this.timeSelectdIndex,item)
				// //this.$set(this.timeActive, 0, index);
				// //this.selectTime[0] = this.timeArr[index]['time'];
				// var ret={
				// 	date:this.selectDate,
				// 	slice:this.timeSelectdIndex,
				// 	label:`${this.selectDate} ${this.selectTime}`
				// }
				this.$emit('selectTime', item);
				this.$refs.classSelector.show()
			},
			findSection(key){
				return this.times.find( s=> {return s.key===key})
			},
			addTimeSection(){
				var ts=this.timeSection

				var key=this.getUUID()
				this.times.push({
					key: key,//new：需要后台生成，有id的后台修改
					time: ts,
					"disable": false,
					max:this.max_rev
				})
				this.sort()
				
				this.timeSelectdIndex=key
				
				this.$refs.classSelector.show()

				this.editMode=0
			},
			sort(){
				this.times.sort(function(a, b){
					//console.log("sort",a,b);
					return that.compareSection(a.time,b.time)
				})
			},
			compareSection(s1,s2){
				if(this.getBegin(s1)==this.getBegin(s2))
				   return this.compareTime(this.getEnd(s1),this.getEnd(s2))
				else
				   return this.compareTime(this.getBegin(s1),this.getBegin(s2))
			},
			compareTime(a,b){
				return new Date("2020-11-23 "+a).getTime()>new Date("2020-11-23 "+b).getTime()
			},
			getBegin(t){
				return t.substring(0,4) 
			},
			getEnd(t){
				return t.substring(6,10) 
			},
			numChanged(value){
				var s=this.findSection(this.timeSelectdIndex)
				if(typeof s !='undefined'){
					s.max=Number(value)
				}
				this.max_rev=Number(value)
				
				this.editMode=0
			},
			sectionChanged(value){
				console.log("s->",value)
				var s=this.findSection(this.timeSelectdIndex)
				if(typeof s !='undefined'){
					s.time=value
				}
				console.log("s1->",s)
				this.sort()
				
				this.editMode=0
			},
			delSection(item){
				Array.prototype.remove = function(val) { 
				var index = this.indexOf(val); 
					if (index > -1) { 
					this.splice(index, 1); 
					} 
				};
				console.log(item)
				this.times.remove(this.findSection(item.key))
				if(0==this.times.length)
					this.reset()
				
				this.editMode=0
				if(this.times.length>0){
					this.timeSelectdIndex=this.times[0].key
				}	
			},
			valiate(){
				let s = new Set()
				this.times.forEach(it=>{s.add(it.time)})
				console.log(this.times,s)
				return this.times.length==s.size
			},
			getSlices(){
				//get一次就代表用户OK了
				this.editMode=0
				if(!this.valiate())
				  return null
				  
				return this.times  
			},
			reset(){
				this.timeSection="00:00-00:00"
				this.max_rev=10
				this.editMode=0
			}

		}
	};
</script>

<style lang="scss" scoped>
	@import './index.scss';

	.container {
		.top-bar {
			width: 100%;
			min-width:250px;
			height: auto;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			margin: 0 0rpx;
			padding:0 0rpx;
			box-sizing: border-box;
			background-color: #f5f5f5;
			
			.bar{
				margin: 0 5rpx;
				padding-left:10rpx;
			}
			.bar-button{
				font-weight:bold;
				font-size:24px;
				width:72rpx;
				margin: 0 0rpx;
				padding:4 4rpx;
			}
		}
	}
	
	.delete-view{
		display:flex;
		flex-direction:row;
		width:50%;
		justify-content: flex-end;
		
	}
	
</style>
