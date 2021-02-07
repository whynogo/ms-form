<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			// #ifdef APP-NVUE
			plus.screen.lockOrientation('portrait-primary');

			let appid = plus.runtime.appid;
			if (appid && appid.toLocaleLowerCase() != "hbuilder") {
				uni.request({
					url: 'https://uniapp.dcloud.io/update', //检查更新的服务器地址
					data: {
						appid: plus.runtime.appid,
						version: plus.runtime.version
					},
					success: (res) => {
						if (res.statusCode == 200 && res.data.isUpdate) {
							let openUrl = plus.os.name === 'iOS' ? res.data.iOS : res.data.Android;
							// 提醒用户更新
							uni.showModal({
								title: '更新提示',
								content: res.data.note ? res.data.note : '是否选择更新',
								success: (showResult) => {
									if (showResult.confirm) {
										plus.runtime.openURL(openUrl);
									}
								}
							})
						}
					}
				})
			}

			var domModule = weex.requireModule('dom');
			domModule.addRule('fontFace', {
				'fontFamily': "texticons",
				'src': "url('./static/text-icon.ttf')"
			});
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
	.state-text.warn {
		background:#FE9A2B;
		border:1px solid #fe9f3f;
        border-radius:30px;
		color:#fff;
	}
	
	.state-text.success {
		background:#22BE71;
		border:1px solid #22BE71;
	    border-radius:30px;
		color:#fff;
	}
	
	.state-text.none {
		background:#909399;
		border:0.7px solid #909399;
	    border-radius:30px;
		color:#fff;
	}
</style>
