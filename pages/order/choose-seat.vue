
<template>
    <view class="wrapper">
		<hx-navbar ref="hxnb" :config="naviConfig" @clickBtn="onNaviClick" />
		<an-text-area-tip title="提示" lineColor="#9bbd9a" titleBgColor="#aed3af" color="#fff">
			<text>1、颜色含义：绿色-这个座位还有较多时间可以预定，黄色-预定时间过半，红色-时间快预定完\n</text>
			<text style="color: #cb0000">2、您现在位置于{{area_name}}\n</text>
		</an-text-area-tip>
		<view class="cus-warp">
			<cus-subsection class="date-select":list="dateList" style="width:200px"  :current="current" ></cus-subsection>
		</view>  
		<view class="grid-container">
			<QSGrids
			:showBadge="false"
			class="cusGrid"
			ref="QSGrids2"
			row="6"
			:numberOnly="false"
			 gridOutline="#f2f2f2 solid 1px"
			@gridClick="onSeatClick"></QSGrids>
		</view>
    </view>
</template>


<script>
import QSGrids from '@/components/QS-Grids/QS-Grids.vue'
import anTextAreaTip from '@/components/an-textarea-tip/an-textarea-tip'
import cusSubsection from '@/components/cus-subsection.vue'
import {
	checkLogin,
	loginTo,
	getUserId,
	naviTo,
	closeTo
} from '@/common/route.js';
import {getSeatInArea} from '@/api/seat.js'
import {
	isEmpty,
	convertUTCTimeToLocalTime,
	orderCall,
	confirmDo,
	toAsync,
	today,
	compareDate,
	delayToast,
	reloadToast
	
} from '@/common/util.js';

export default {
    components: {QSGrids,anTextAreaTip,cusSubsection},
    data() {
        return {
			model:{id:null},
			area_name:'',
			seats:[],
            seatGrid: [],
			dateList: [
				{
					name: ""
				}
				// {
				// 	name: '明天'
				// }
			],
			update:false,
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
		console.log("options=>",option)
		this.model.id=option.id
		this.area_name=option.area_name
		this.dateList[0].label=this.area_name
		this.current=0
		this.fectchRemoteData()
	},
    onReady() {
        this.setGridData();
		 uni.$on("seatChanged", res => {
			this.fectchRemoteData()
		        // 清除监听
		//        uni.$off('seatChanged');
		})
    },
    methods: {
        setGridData() {
           this.$refs.QSGrids2.setData(this.seatGrid)
        },
		getSections(item){
			return "["+item.sections+"]"
		},
        onSeatClick(seat_id) {
			var item=this.seats.find(obj=>{return obj.seat_id==seat_id})
			if(true){
				naviTo("/pages/order/choose-time",{
					id:this.model.id,
					seat_id:item.seat_id,
					seat_prompt:item.area_name+item.seat_name+"号座",
					sections:this.getSections(item)})
			}else{
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: "已经没有剩余时间",
					during: 2500
				});
			}
        },
		getSeatImage(item){
			var p=item.percent
			if(p<30)
				return "https://miao-share.oss-cn-shenzhen.aliyuncs.com/sys_images/office-chair-green.png"
			else if(p<50)
				return "https://miao-share.oss-cn-shenzhen.aliyuncs.com/sys_images/office-chair-blue.png"
			else if(p<70)
				return "https://miao-share.oss-cn-shenzhen.aliyuncs.com/sys_images/office-chair-yellow.png"
			else 
				return "https://miao-share.oss-cn-shenzhen.aliyuncs.com/sys_images/office-chair-red.png"						
		},
		fectchRemoteData(){

			var fun_getSeat=toAsync(this,function(that,resolve,reject){
				getSeatInArea(that.model).then(rsp=>{
				if (0 == rsp.code) {
					that.seats=rsp.data.rows
					that.seatGrid.length=0
					rsp.data.rows.forEach(item=>{
						that.seatGrid.push({
							id:item.seat_id,
							badge:0,
							text:item.seat_name+"号",
							img:that.getSeatImage(item)
						})
					})
					that.setGridData()
					that.list=[{"name":that.area_name}]
					resolve(true)
				}else
					that.fail("加载失败，请重试!")
				})
			})
			
			orderCall(fun_getSeat)
		},
		onNaviClick(item) {
			naviTo("/pages/center/index")
		},
		
    }
}
</script>

<style lang="scss" scoped>
	.wrapper {
		padding-top: 25upx;
	    width: 100%;
	}
	.cusGrid{
		//margin:0 20rpx;
	}
	
	.grid-container{
		margin: 20rpx;
	}
	.cus-warp{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>