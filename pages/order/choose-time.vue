<template>
    <view class="page-wrapper">
				<hx-navbar ref="hxnb" :config="naviConfig" @clickBtn="onNaviClick" />
		<u-top-tips ref="uTips" :navbar-height="naviHeight"></u-top-tips>
		<an-text-area-tip title="提示" lineColor="#9bbd9a" titleBgColor="#aed3af" color="#fff">
		    <text>1、请选择您要预约的时间段\n</text>
		    <text>2、先点击开始时间再选择结束时间\n</text>
		    <text style="color: #3a3acb">3、您现在想预定:{{seat_prompt}}\n</text>
			<text v-if="null!=rev_info" style="color: #cb0000">4、您之前已预定:{{rev_info}}</text>
		</an-text-area-tip>
		<view class="cus-warp">
			<cus-subsection class="date-select":list="dateList" style="width:200px"  :current="current"></cus-subsection>
			<s-select-time ref="selectTime"
							:isDisabled="true"
						   :startTime="startTime"
						   :disableTimes="disableTimes"
						   :offTime="endTime"
						   :interval="30"
						   @selectedTime="selectedTime"></s-select-time>
		</view> 
		  <view v-if="!is_beon">
			 <u-button v-if="canRev()" type="primary" style="width: 80%;" @click="submit" >预约座位</u-button>
			 <u-button v-if="!is_rev&&!button_state" type="primary"disabled  style="width: 80%;" >预约座位</u-button>
			 <u-button v-if="is_rev" type="warning"  style="width: 80%;" @click="signDown">取消座位</u-button>
		 </view>
		 	 <u-button v-if="canRelease()" type="error"  style="width: 80%;" @click="releaseSeat">释放座位</u-button>
    </view>
</template>

<script>
import SSelectTime from '@/components/s-select-time/s-select-time.vue'
import anTextAreaTip from '@/components/an-textarea-tip/an-textarea-tip'
import cusSubsection from '@/components/cus-subsection.vue'
import moment from 'dayjs'
import {revSeat,isUserRev,cancelOrder,getSeatInfo} from '@/api/seat.js'
import {
	checkLogin,
	loginTo,
	getUserId,
	naviTo,
	closeTo,
	relaunch
} from '@/common/route.js';
import {
	isEmpty,
	convertUTCTimeToLocalTime,
	orderCall,
	confirmDo,
	confirmCancel,
	toAsync,
	today,
	compareDate,
	delayToast,
	reloadToast,
	backToast
} from '@/common/util.js';


export default {
    components: {
        SSelectTime,
		anTextAreaTip,
		cusSubsection
    },
    data () {
        return {
			option:null,
			model:{
				id:null,
				begin:'',
				end:'',
				date:today()	
			},
			naviHeight:44,
			is_beon:false,
			is_rev:false,
			rev_info:null,
			button_state:false,
			seat_prompt:'',
			startTime:"07:00:00",
			endTime:"22:00:00",
            disableTimes: [

            ],
			dateList: [
				{
					label: '今天'
				}
			],
			current: 0,
			naviConfig: {
				back: true,
				backPage: null,
				title: '预约记录',
				color: '#ffffff',
				//背景颜色;参数一：透明度（0-1）;参数二：背景颜色（array则为线性渐变，string为单色背景）
				backgroundColor: [1, ['#a9a1ff', '#6970ff']],
				// 滑动屏幕后切换颜色，注意颜色为数组时长度必须一样，还有使用滑动切换必须监听 onPageScroll 事件
				//    slideBackgroundColor: [0,['#a9a1ff','#6970ff','#ff55ff','#ff9999']],
				// 状态栏 ，数组则为滑动变色
				statusBarBackground: ['', '#ffffff'],
				rightButton: [{
					key: 'btn3',
					icon: '&#xe800;',
					position: 'left'
				}],
			},
        }
    },
	onLoad(option) {
		console.log("options =>",option)
		this.option=Object.assign({},option)
		this.model.id=option.seat_id
		if(null!=option.sections)
			this.disableTimes=JSON.parse(option.sections)
		this.seat_prompt=option.seat_prompt
		//console.log("disableTimes=>",this.disableTimes)
		this.fectchRemoteData()
	},
    methods: {
		canRev(){
			return !this.is_rev&&this.button_state
		},
		canCancel(){
			return this.is_rev
		},
		canRelease(){
			return this.is_beon
		},
        selectedTime (e) {
            console.log(e)
			this.button_state=2==e.length
			this.model.begin=e[0]>e[1]?e[1]:e[0]
			this.model.end=e[1]>e[0]?e[1]:e[0]
        },
		notifySeatChanged(){
			uni.$emit("seatChanged",{});
		},
		submit(){
			var fun_getArea=toAsync(this,function(that,resolve,reject){
				let _that=that
				console.log("that=>",that.buildingGrid)
				revSeat(that.model).then(rsp=>{
					if (0 == rsp.code) {
						backToast("预约成功","/pages/news/index")
						that.setCanChoose()
						that.notifySeatChanged()
						resolve(true)
					}else
						that.fail(rsp.message)
					})
				})
			orderCall(fun_getArea)
		},
		signDown(item) {
			let that=this
			confirmCancel(function(){
				cancelOrder({id:that.model.id,cause:6}).then(rsp=>{
					if(0==rsp.code){
						//reloadToast('预约已取消，您可以重新预约','/pages/news/index')
						uni.showToast({
							title:'预约已取消',
							duration: 2000
						})
						that.setCanChoose()
						//that.fectchRemoteData()//刷新
						relaunch("/pages/order/choose-time",that.option)//直接刷新，否则动态改的内容太多了
						that.notifySeatChanged()
					}		
				})	
			},"机会难得，确定取消吗？")
		
		},
		setCanChoose(){
			this.is_rev=false
			this.button_state=true
		},
		releaseSeat(item) {
			let that=this
			confirmCancel(function(){
				cancelOrder({id:that.model.id,cause:5}).then(rsp=>{
					if(0==rsp.code){
						uni.showToast({
							title:'座位已释放',
							duration: 2000
						})
						//that.fectchRemoteData()//刷新
						relaunch("/pages/order/choose-time",that.option)//直接刷新，否则动态改的内容太多了
						that.notifySeatChanged()
					}		
				})	
			},"机会难得，确定释放座位吗？")
		
		},
		fectchRemoteData(){
			var fun_isRev=toAsync(this,function(that,resolve,reject){
				isUserRev(that.model).then(rsp=>{
				if (0 == rsp.code) {
					if(rsp.data.is_rev){
						that.$refs.uTips.show({
							title: "您已预约："+rsp.data.rev_info,
							type: 'warning',
							duration: 4000
						})
						that.dateList=[{label:rsp.data.date==today()?"今天":"明天"}]	
						that.rev_info=rsp.data.rev_info
						that.is_rev=rsp.data.is_rev
						that.is_beon=rsp.data.is_beon
					}
					resolve(true)
				}else
					that.fail()
				})
			})
			
			var fun_seatInfo=toAsync(this,function(that,resolve,reject){
				getSeatInfo(that.model).then(rsp=>{
				if (0 == rsp.code) {
					var arr=new Array()
					that.disableTimes.length=0
					rsp.data.sections.map(item=>{
						arr.push(item)
					})
					that.disableTimes=arr
					that.startTime=rsp.data.seat_begin
					that.endTime=rsp.data.seat_end
					resolve(true)
				}else
					that.fail()
				})
			})
			
			orderCall(fun_isRev,fun_seatInfo)
		},
		onNaviClick(item) {
			naviTo("/pages/center/index")
		},
    }
}
</script>

<style lang="scss" scoped>
	.page-wrapper {

		flex-direction: column;
		justify-content:center;
		padding-top: 25upx;
	    width: 100%;
		align-items: center;
	}
	.date-select{
	}
	.cus-warp{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>