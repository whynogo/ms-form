<template>
	<view ref="QS-SwiperGrid" class="QS-SwiperGrid">
		<block v-if="mode === 'swiper'">
			<swiper :indicator-dots="indicatorDots" :indicator-color="indicatorColor" :indicator-active-color="indicatorActiveColor"
			 :autoplay="autoplay" :interval="interval" :previous-margin="previousMargin" :next-margin="nextMargin" :circular="circular"
			 :current="getCurrent()" :duration="Number(duration)" @animationfinish="swiperChange" :style="{ height: (20+(swiperHieght) + Number(indicatorDotsHieght)) + 'px' }">
				<swiper-item v-for="(item, index) in grids" :key="index">
					<QSGrid ref="QS_Grid" :grids="item" :hideText="hideText" :gridWidth="getWidth" :padding="padding" :iconSizeScale="iconSizeScale"
					 :gridTextColor="gridTextColor" :gridTextSize="gridTextSize" :gridTextMarginTop="gridTextMarginTop" :props="props" 
					 :gridOutline="gridOutline" :gridPadding="gridPadding" :iconBorderRadius="iconBorderRadius" :iconHeight="iconHeight"
					 :iconWidth="iconWidth" :gridPaddingTop="gridPaddingTop" :gridPaddingBottom="gridPaddingBottom" :gridPaddingLeft="gridPaddingLeft"
					 :gridPaddingRight="gridPaddingRight" @_click="_click($event, index)" :numberOnly="numberOnly" :showBadge="showBadge"></QSGrid>
				</swiper-item>
			</swiper>
		</block>
		<block v-else>
			<QSGrid :grids="grids" :hideText="hideText" :gridWidth="getWidth" :padding="padding" :iconSizeScale="iconSizeScale"
			 :gridTextColor="gridTextColor" :gridTextSize="gridTextSize" :gridTextMarginTop="gridTextMarginTop" :props="props"
			 :gridOutline="gridOutline" :gridPadding="gridPadding" :iconBorderRadius="iconBorderRadius" :iconHeight="iconHeight"
			 :iconWidth="iconWidth" :gridPaddingTop="gridPaddingTop" :gridPaddingBottom="gridPaddingBottom" :gridPaddingLeft="gridPaddingLeft"
			 :gridPaddingRight="gridPaddingRight" @_click="_click($event)" :numberOnly="numberOnly" :showBadge="showBadge" ></QSGrid>
		</block>
	</view>
</template>

<script>
	import QSGrid from './QS-Grid.vue'
	// #ifdef APP-NVUE
	const dom = weex.requireModule('dom')
	// #endif
	export default {
		name: 'QS-SwiperGrid',
		components: {
			QSGrid
		},
		props: {
			row: { // 单行个数
				type: [Number, String],
				default: 5
			},
			col: { //列数
				type: [Number, String],
				default: 2
			},
			padding: { //内边距
				type: [Number, String],
				default: 0
			},
			iconSizeScale: { //图标比例
				type: [Number, String],
				default: .8
			},
			gridTextColor: { //文本颜色
				type: String,
				default: '#000'
			},
			gridTextSize: { //文本大小
				type: String,
				default: '28rpx'
			},
			gridTextMarginTop: { //文本顶部外边距
				type: [Number, String],
				default: '10px'
			},
			mode: { //模式 swiper 或者 default
				type: String,
				default: ''
			},
			props: { //配置对象 { imageField: '图标地址属性名', textField: '文本内容属性名' }
				type: Object,
				default () {
					return {}
				}
			},
			gridOutline: { //线条 , 目前 vue支持
				type: String,
				default: 'none'
			},
			gridPadding: { //单个的内边距
				type: [Number, String],
				default: '15rpx'
			},
			iconBorderRadius: { //图标圆角值
				type: [Number, String],
				default: '0'
			},


			indicatorDots: { //同官方swiper
				type: [Boolean, String],
				default: false
			},
			indicatorDotsHieght: { //同官方swiper
				type: [Number, String],
				default: 0
			},
			duration: { //同官方swiper
				type: [Number, String],
				default: 500
			},
			circular: { //同官方swiper
				type: [String, Boolean],
				default: false
			},
			defCurrent: { //默认项
				type: [String, Number],
				default: 0
			},
			previousMargin: { //同官方swiper
				type: String,
				default: '0px'
			},
			nextMargin: { //同官方swiper
				type: String,
				default: '0px'
			},
			indicatorColor: { //同官方swiper
				type: String,
				default: 'rgba(0, 0, 0, .3)'
			},
			indicatorActiveColor: { //同官方swiper
				type: String,
				default: '#000000'
			},
			autoplay: { //同官方swiper
				type: [String, Boolean],
				default: false
			},
			interval: { //同官方swiper
				type: [String, Number],
				default: 5000
			},
			gridsData: { //绑定的 grids数据
				type: Array,
				default: () => []
			},
			hideText: { //隐藏文本块
				type: [String, Boolean],
				default: false
			},
			iconWidth: { //手动指定图标宽度
				type: [String, Number],
				default: 0
			},
			iconHeight: { //手动指定图标高度
				type: [String, Number],
				default: 0
			},
			gridPaddingTop: { //单个grid上内边距, nvue专有，若指定则padding值失效
				type: [Number, String],
				default: 0
			},
			gridPaddingBottom: { //单个grid下内边距, nvue专有，若指定则padding值失效
				type: [Number, String],
				default: 0
			},
			gridPaddingLeft: { //单个grid左内边距, nvue专有，若指定则padding值失效
				type: [Number, String],
				default: 0
			},
			gridPaddingRight: { //单个grid右内边距, nvue专有，若指定则padding值失效
				type: [Number, String],
				default: 0
			},
			numberOnly: {
				type: Boolean,
				default: true
			},
			showBadge: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			getWidth() {
				// console.log('QS-Grids: componentWidth: ' + this.componentWidth);
				// console.log('QS-Grids: padding: ' + this.padding);
				// console.log('QS-Grids: row: ' + this.row);
				const a = (this.componentWidth - Number(this.padding) * 2)/ this.row;
				// console.log('QS-Grids: 单项宽度:' + a);
				return a;
			}
		},
		watch: {
			gridsData(n) {
				this.setData(n);
			}
		},
		data() {
			return {
				curSelectedIndex:'',
				id_pre: 'QS-Grids_',
				grids: [],
				singleLenth: 0,
				componentWidth: 0,
				swiperHieght: 200,
				swiperCurrent: 0
			}
		},
		mounted() {
			// #ifndef APP-NVUE
			this.countInfo()
			// #endif
			this.setData(this.gridsData);
		},
		methods: {
			getCurrent(){
				console.log("current",this.swiperCurrent)
				return this.swiperCurrent
			},
			swiperChange(e){
				console.log("swipperChanged",e.detail)
				this.swiperCurrent = e.detail.current;
			},
			countInfo() {
				// #ifdef APP-NVUE
				dom.getComponentRect(this.$refs['QS-SwiperGrid'], option => {
					console.log('获取QS-SwiperGrid布局信息成功: ' + JSON.stringify(option))
					if (option.size) this.componentWidth = option.size.width;
					// this.$nextTick(()=>{
					this.countGridInfo();
					// })
				})
				// #endif
				// #ifndef APP-NVUE
				let view
				// #ifndef MP-BAIDU || MP-ALIPAY
				view = uni.createSelectorQuery().in(this)
				// #endif
				// #ifdef MP-BAIDU || MP-ALIPAY
				view = uni.createSelectorQuery()
				// #endif
				view.select('.QS-SwiperGrid').fields({
					size: true
				})
				view.exec(res => {
					// console.log('获取节点信息成功:' + JSON.stringify(res))
					if (res[0] && res[0].width) {
						this.componentWidth = res[0].width
						// this.$nextTick(()=>{
						this.countGridInfo();
						// })
					} else {
						console.log('获取节点信息失败!!')
					}
				})
				// #endif
			},
			countGridInfo() {
				if (this.mode === 'swiper') {
					this.$nextTick(() => {
						setTimeout(() => {
							const refs = this.$refs.QS_Grid;
							if (!refs) return;
							const ref = refs[0];
							if (!ref) return;
							const fn = ref.countGridInfo;
							if (!fn || typeof fn !== 'function') return;
							fn(res => {
								this.swiperHieght = res.height
							})
						}, 100)
					})
				}
			},
			setData(arr) {
				this.setGrids(arr);
			},
			setGrids(arr) {
				let newArr = [];

				if (this.mode === 'swiper') {
					const singleLenth = Number(this.row) * Number(this.col);
					if (singleLenth < 0) {
						console.log('行数与列数不正确');
						return;
					}
					this.singleLenth = singleLenth;

					const totalPage = Math.ceil(arr.length / singleLenth);

					for (let i = 0; i < totalPage; i++) {
						const page = [];

						for (let j = 0; j < singleLenth; j++) {
							const c = i * singleLenth + j;
							if (c > arr.length - 1) break;
							page.push(arr[c]);
						}
						newArr.push(page);
					}
				} else {
					newArr = arr
				}

				this.grids = newArr;
				this.$nextTick(() => {
					this.countInfo()
					// this.countGridInfo();	
				})
			},
			_click(index, pageNum) {
				let count;
				if (pageNum !== undefined) {
					count = this.singleLenth * pageNum + index;
				} else {
					count = index;
				}
				this.curSelectedIndex=count
				this.$emit('gridClick', index)
			}
		}
	}
</script>

<style scoped>
	/* #ifndef APP-NVUE */
	@import url("css/box-sizing-border-box.css");

	/* #endif */
	.QS-SwiperGrid {
		/* #ifdef APP-NVUE */
		/* flex: 1; */
		/* #endif */
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
		position: relative;
	}
</style>
