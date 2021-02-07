
<template>
    <view class="wrapper">
		<hx-navbar ref="hxnb" :config="naviConfig" @clickBtn="onNaviClick" />
		<u-top-tips ref="uTips" :navbar-height="naviHeight"></u-top-tips>
        <QSGrids 
        ref="buildingGrid" 
        mode="swiper" 
		row="5"
		col="1"
        gridAddHeight="20"
        iconBorderRadius="50%"
		:indicatorDots="true"
		:gridsData="buildingGrid"
        @gridClick="onBuildingClick"></QSGrids>
<!--        <view style="height: 30px;display:flow;align-items: center">

        </view> -->
		<an-text-area-tip title="提示" lineColor="#9bbd9a" titleBgColor="#aed3af" color="#fff">
		    <text >上面是可选的建筑，下面是建筑中可选的区域\n</text>
		</an-text-area-tip>
		<u-button class="action-button" v-if="canCheckin" type="warning"  @click="checkin">签到</u-button>
		<view class="grid-container">
			<QSGrids
			class="cusGrid"
			ref="areaGrid"
			row="3"
			:gridsData="areaGrid"
			:numberOnly="false"
			 gridOutline="#f2f2f2 solid 1px"
			@gridClick="onAreaClick"></QSGrids>
		</view>
    </view>
</template>


<script>
import QSGrids from '@/components/QS-Grids/QS-Grids.vue'
import anTextAreaTip from '@/components/an-textarea-tip/an-textarea-tip'

import {
	checkLogin,
	loginTo,
	getUserId,
	goto,
	closeTo,
	naviTo
} from '@/common/route.js';
import {getAreaInBuilding,isUserRev,checkin} from '@/api/seat.js'
import {
	get,
	isEmpty,
	convertUTCTimeToLocalTime,
	orderCall,
	confirmDo,
	toAsync,
	today,
	compareDate,
	delayToast,
	reloadToast,
	longToast
} from '@/common/util.js';


export default {
    components: {QSGrids,anTextAreaTip},
    data() {
        return {
			model:{id:null},
			area_name:'', 
			area_mac:'',
			canCheckin:false,
            builds: [],
			area:[],
			buildingGrid:[],
			areaGrid:[],
			naviHeight:44,
			naviConfig: {
				back: true,
				backPage:null,
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
				}]

			},
        }
    },
    onReady() {
		 uni.$on("seatChanged", res => {
			this.fectchRemoteData()
		        // 清除监听
		//        uni.$off('seatChanged');
		})
    },
	onLoad(option) {
		console.log("options=>",option)
		this.model.id=option.id
		this.fectchRemoteData()

	},
    methods: {
        setGridData(that) {
         //  that.$refs.buildingGrid.setData(that.buildingGrid)
         //  that.$refs.areaGrid.setData(that.areaGrid)
		   console.log("building area count=",that.buildingGrid.length,that.areaGrid.length)
        },
		getLeft(item){
			return (item.total||0)-(item.count||0)
		},
		getPercent(item){
			return 100-get(item,"percent",100)
		},
		getAreaName(item){
			return item.area_name+item.building_floor+"楼"
		},
		updateArea(building_id){
			var arr=new Array()
			this.areaGrid.filter(obj=>{return obj.building_id==building_id}).forEach(item=>{
			 	arr.push(item)
			})
			this.$refs.areaGrid.setData(arr)
		},	
        onBuildingClick(id) {
			this.updateArea(id)
			uni.showToast({
				icon: 'none',
				position: 'bottom',
				title: "已刷新",
				during: 2500
			});
        },
		onAreaClick(area_id) {
			var item=this.area.find(obj=>{return obj.area_id==area_id})
			naviTo("/pages/order/choose-seat",{id:item.area_id,area_name:item.area_name+item.building_floor+"层" })
		},
		fectchRemoteData(){
			var fun_getArea=toAsync(this,function(that,resolve,reject){
				getAreaInBuilding(that.model).then(rsp=>{
				if (0 == rsp.code) {
					that.builds=rsp.data.building
					that.area=rsp.data.area	
					that.buildingGrid.length=0
					rsp.data.building.forEach(item=>{
						that.buildingGrid.push({
							id:item.building_id,
							badge:that.getPercent(item),//that.getLeft(item),
							text:item.building_name,
							img:item.building_image
						})
					})
					that.areaGrid.length=0
					rsp.data.area.forEach(item=>{
						that.areaGrid.push({
							id:item.area_id,
							building_id:item.building_id,
							badge:that.getPercent(item),//that.getLeft(item),
							text:that.getAreaName(item),
							img:item.area_image
						})
					})
					that.setGridData(that) 
					resolve(true)
				}else
					that.failCode(rsp.code)
				})
			})
			
			var fun_isRev=toAsync(this,function(that,resolve,reject){
				isUserRev(that.model).then(rsp=>{
					if (0 == rsp.code) {
						if(rsp.data.is_rev)
							that.$refs.uTips.show({
								title: "您已预约："+rsp.data.rev_info,
								type: 'warning',
								duration: '4000'
							})
						that.area_mac=rsp.data.area_mac
						that.area_name=	rsp.data.rev_info
						that.canCheckin=1==rsp.data.state
						resolve(true)
					}else
						that.failCode(rsp.code)
					})
			})
			
			orderCall(fun_getArea,fun_isRev)
		},
		onNaviClick(item) {
			naviTo("/pages/center/index")
		},
		checkin(){
			var that=this
			if(isEmpty(this.area_mac))
				uni.showToast({
					icon: 'error',
					title: "此区域MAC地址没有配置",
					during: 2500
				});
			else	
				this.$dva.wifi().search(this.area_mac).start(function(find){
					console.log("wifi=>",find,that.area_mac)
					if(find){
						checkin({area_mac:that.area_mac}).then(rsp=>{
							//如果没有报错，且提示可以继续重复操作
							if(0==rsp.code&&!rsp.data.redo)
								that.canCheckin=false
							if(rsp.data.success)
								uni.showToast({
									icon:'scuccess',
									title:rsp.message
								})
							else	
								longToast(rsp.message)
						})
					}else
						longToast("签到失败，请靠近"+that.area_name)
					
				})
		},
    }
}
</script>

<style lang="scss" scoped>
	.wrapper {
	    padding-bottom: 5px;
	    width: 100%;
		align-items: center;
	}
	.prompt-text{
		text-align: center;
	}
	
	.grid-container{
		margin: 20rpx;
	}
	
	.action-button{
		width:80%;
	}
</style>