<template>
	<view ref="QS-SwiperGrid-items" class="QS-SwiperGrid-items" :style="{ padding: padding + 'px' }">
		<!-- #ifndef APP-NVUE -->
		<view class="QS-SwiperGrid-item" v-for="(item, index) in grids" :key="index" :style="{
			width: (gridWidth-.1)  + 'px', 
			'min-height':  String(hideText) === 'true'?(iconHeight || 0):(gridWidth  + 'px'),
			outline: gridOutline,
			padding: gridPadding
		}"
		 @tap="_click(item.id)">
			<!-- #endif -->
			<!-- #ifdef APP-NVUE -->
			<view class="QS-SwiperGrid-item" v-for="(item, index) in grids" :key="index" :style="getItemStyleObj" @tap="_click(item.id)" >
				<!-- #endif -->
				<image :src="item[getImageField]" mode="aspectFill" class="grid-img" :style="{ 
				'height': item[getImageHeightField] || iconHeight || getIconSize, 
				'width': item[getImageWidthField] || iconWidth || getIconSize,
				'border-radius': iconBorderRadius
			}"></image>
				<text v-if="String(hideText) !== 'true'" class="grid-text" :style="{ color: gridTextColor, 'font-size': gridTextSize, 'margin-top': gridTextMarginTop }">{{item[getTextField] || item}}</text>
				<cus-badge v-if="showBadge" class="seat_badge" :text="item.badge" type="success" @click="bindClick" :numberOnly="numberOnly" ></cus-badge>
			</view>
		</view>
</template>

<script>
	import cusBadge from "@/components/cus-badge/cus-badge.vue"
	// #ifdef APP-NVUE
	const dom = weex.requireModule('dom')
	// #endif
	export default {
		components:{
			cusBadge
		},
		props: {
			row: {
				type: [Number, String],
				default: 5
			},
			grids: {
				type: Array,
				default () {
					return []
				}
			},
			gridWidth: {
				type: [Number, String],
				default: 0
			},
			padding: {
				type: [Number, String],
				default: 0
			},
			iconSizeScale: {
				type: [Number, String],
				default: .8
			},
			gridTextColor: {
				type: String,
				default: '#000'
			},
			gridTextSize: {
				type: String,
				default: '28rpx'
			},
			gridTextMarginTop: {
				type: [Number, String],
				default: '10px'
			},
			props: {
				type: Object,
				default () {
					return {}
				}
			},
			gridOutline: {
				type: String,
				default: 'none'
			},
			gridPadding: {
				type: [Number, String],
				default: '15rpx'
			},
			iconBorderRadius: {
				type: [Number, String],
				default: '0'
			},
			hideText: {
				type: [String, Boolean],
				default: false
			},
			iconWidth: {
				type: [String, Number],
				default: 0
			},
			iconHeight: {
				type: [String, Number],
				default: 0
			},
			gridPaddingTop: {
				type: [Number, String],
				default: 0
			},
			gridPaddingBottom: {
				type: [Number, String],
				default: 0
			},
			gridPaddingLeft: {
				type: [Number, String],
				default: 0
			},
			gridPaddingRight: {
				type: [Number, String],
				default: 0
			},
			numberOnly: {
				type: Boolean,
				default: false
			},
			showBadge: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			getImageField() {
				return this.props.imageField || 'img'
			},
			getImageWidthField() {
				return this.props.widthField || 'width'
			},
			getImageHeightField() {
				return this.props.heightField || 'height'
			},
			getTextField() {
				return this.props.textField || 'text'
			},
			getIconSize() {
				return Number(this.gridWidth) * Number(this.iconSizeScale) + 'px'
			},
			getItemStyleObj() {
				let obj = {
					width: (this.gridWidth - .1) + 'px',
					'min-height': String(this.hideText) === 'true' ? (this.iconHeight || 0) : (this.gridWidth + 'px'),
					outline: this.gridOutline
				}
				if (this.gridPaddingTop || this.gridPaddingBottom || this.gridPaddingLeft || this.gridPaddingRight) {
					obj['padding-top'] = this.gridPaddingTop;
					obj['padding-bottom'] = this.gridPaddingBottom;
					obj['padding-left'] = this.gridPaddingLeft;
					obj['padding-right'] = this.gridPaddingRight;
				} else {
					obj.padding = this.gridPadding;
				}

				return obj;
			}
		},
		methods: {
			_click(index) {
				this.$emit('_click', index)
			},
			countGridInfo(cb) {
				// #ifdef APP-NVUE
				dom.getComponentRect(this.$refs['QS-SwiperGrid-items'], option => {
					if (cb && typeof cb === 'function') cb(option.size)
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
				view.select('.QS-SwiperGrid-items').fields({
					size: true
				})
				view.exec(res => {
					// console.log('获取grid节点信息成功:' + JSON.stringify(res))
					if (res[0]) {
						if (cb && typeof cb === 'function') cb(res[0])
					}
				})
				// #endif
			}
		}
	}
</script>

<style scoped>
	/* #ifndef APP-NVUE */
	@import url("css/box-sizing-border-box.css");

	/* #endif */
	.QS-SwiperGrid-items {
		/* #ifdef APP-NVUE */
		/* flex: 1; */
		/* #endif */
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
	}

	.QS-SwiperGrid-item {
		/* #ifndef APP-NVUE */
		display: flex;
		position: relative; 

		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top:26rpx;
	}

	.grid-img {
		background-color: #f8f8f8;
	}

	.grid-text {
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		/* #ifndef APP-NVUE */
		width: 100%;
		/* white-space: nowrap; */
		/* #endif */
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: center;
	}
	
	.seat_badge{
/* 		margin-top:10rpx; */
		position: absolute;
		right: 0px; 
		top: 0px; 
	}
</style>
