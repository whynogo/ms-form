<template>
	<view class="content" >

		<!-- 生成海报 -->
		<view class="flex_row_c_c modalView" :class="qrShow?'show':''" @tap="hideQr()">
			<view class="flex_column">
				<view class="backgroundColor-white padding1vh border_radius_10px">
					<image :src="poster.finalPath || ''" mode="widthFix" class="posterImage"></image>
				</view>
				<view class="flex_row marginTop2vh">
					<button type="primary" size="mini" @tap.prevent.stop="saveImage()">保存图片</button>
					<button type="primary" open-type="share" size="mini" @tap.prevent.stop="share()">分享图片</button>
				</view>
			</view>
		</view>
		<!-- 画布 -->
		<view class="hideCanvasView">
			<canvas class="hideCanvas" canvas-id="default_PosterCanvasId" :style="{width: (poster.width||10) + 'px', height: (poster.height||10) + 'px'}"></canvas>
		</view>
	</view>
</template>


<script>
	import _app from '@/js_sdk/QS-SharePoster/app.js';
	import {
		getSharePoster
	} from '@/js_sdk/QS-SharePoster/QS-SharePoster.js';
	
	import {
		decodeOption
	}from "@/common/route.js"
	import {
		delayToast
	}from "@/common/util.js"
	export default {
		data() {
			return {
				poster: {},
				qrShow: false,
				canvasId: 'default_PosterCanvasId',
				qr:{
					qs:0.4,
					qh:0.86,
					background:'',
					title:"",
					datetime:"",
					qrText:"",
					bottomText:""
				}
			}
		},
		onReady: function() {
			console.log("do qr=>",this.qr)
			this.shareFc()
		},
		onLoad: function(option) {
			this.qr=decodeOption(option)
			console.log("qr=>",this.qr)
		},
		
		methods: {
			async shareFc() {
				var that=this
				try {
					_app.log('准备生成:' + new Date())
					const d = await getSharePoster({
						_this: this, //若在组件中使用 必传
						type: 'testShareType',
						formData: {
							//访问接口获取背景图携带自定义数据

						},
						posterCanvasId: this.canvasId,	//canvasId
						delayTimeScale: 40, //延时系数
						backgroundImage:this.qr.background,
						/* background: {
							width: 1080,
							height: 1920,
							backgroundColor: '#666'
						}, */
						drawArray: ({
							bgObj,
							type,
							bgScale
						}) => {
							const dx = bgObj.width * 0.3;
							const fontSize = bgObj.width * 0.045;
							const lineHeight = bgObj.height * 0.04;
							//可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
							return new Promise((rs, rj) => {
								rs([{
										type: 'custom',
										setDraw(Context) {
											Context.setFillStyle('black');
											Context.setGlobalAlpha(0.3);
											Context.fillRect(0, bgObj.height - bgObj.height * 0.2, bgObj.width, bgObj.height * 0.2);
											Context.setGlobalAlpha(1);
										}
									},
									{
										type: 'text',
										text: that.qr.title,
										size: 48,
										color: 'white',
										alpha: 1,
										textAlign: 'left',
										textBaseline: 'middle',
										infoCallBack(textLength) {
											return {
												dx: (bgObj.width - textLength - fontSize)/2,
												dy: (bgObj.height-bgObj.width * that.qr.qs)*that.qr.qh- (lineHeight*2.5)
											}
										}
									},
									{
										type: 'text',
										text: that.qr.datetime,
										size: 32,
										color: 'white',
										alpha: 1,
										textAlign: 'left',
										textBaseline: 'middle',
										infoCallBack(textLength) {
											return {
												dx: (bgObj.width - textLength - fontSize)/2,
												dy: (bgObj.height-bgObj.width * that.qr.qs)*that.qr.qh- lineHeight
											}
										}
									},
									{
										type: 'text',
										text: this.qr.bottomText,
										size: 32,
										color: 'white',
										alpha: 1,
										textAlign: 'left',
										textBaseline: 'middle',
										infoCallBack(textLength) {
											return {
												dx: bgObj.width - textLength - fontSize,
												dy: bgObj.height - lineHeight
											}
										}
									},
									{
										type: 'qrcode',
										text: this.qr.qrText,
										size: bgObj.width * this.qr.qs,
										dx: (bgObj.width-bgObj.width * this.qr.qs)*0.5,
										dy: (bgObj.height-bgObj.width * this.qr.qs)*that.qr.qh
									}
								]);
							})
						},
						setCanvasWH: ({
							bgObj,
							type,
							bgScale
						}) => { // 为动态设置画布宽高的方法，
							this.poster = bgObj;
						}
					});
					_app.log('海报生成成功, 时间:' + new Date() + '， 临时路径: ' + d.poster.tempFilePath)
					this.poster.finalPath = d.poster.tempFilePath;
					this.qrShow = true;
				} catch (e) {
					_app.hideLoading();
					delayToast(JSON.stringify(e));
					console.log(JSON.stringify(e));
					uni.navigateBack({
						
					})
				}
			},
			saveImage() {
				uni.saveImageToPhotosAlbum({
					filePath: this.poster.finalPath,
					success(res) {
						_app.showToast('保存成功');
						uni.navigateBack({
							delta: 1
						})
					}
				})
			},
			share() {
				// #ifdef APP-PLUS
				_app.getShare(false, false, 2, '', '', '', this.poster.finalPath, false, false);
				// #endif

				uni.navigateBack({
					delta: 1
				})
			},
			hideQr() {
				this.qrShow = false;
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style>
	.hideCanvasView {
		position: relative;
	}

	.hideCanvas {
		position: fixed;
		top: -99999upx;
		left: -99999upx;
		z-index: -99999;
	}

	.flex_row_c_c {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.modalView {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		outline: 0;
		transform: scale(1.2);
		perspective: 2500upx;
		background: rgba(0, 0, 0, 0.6);
		transition: all .3s ease-in-out;
		pointer-events: none;
		backface-visibility: hidden;
		z-index: 999;
	}

	.modalView.show {
		opacity: 1;
		transform: scale(1);
		pointer-events: auto;
	}

	.flex_column {
		display: flex;
		flex-direction: column;
	}

	.backgroundColor-white {
		background-color: white;
	}

	.border_radius_10px {
		border-radius: 10px;
	}

	.padding1vh {
		padding: 1vh;
	}

	.posterImage {
		width: 60vw;
	}

	.flex_row {
		display: flex;
		flex-direction: row;
	}

	.marginTop2vh {
		margin-top: 2vh;
	}
</style>
