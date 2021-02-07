<template>
	<view class="page">
		<view class="uni-input" @click="show_picker = true" @confirm="onConfirm">{{value}}</view>

		<u-select :default-value="intValue" v-model="show_picker" mode="mutil-column" :list="multiArray" ref="picker" @cancel="onCancel"
		 @confirm="onChanged" @columnchange="bindMultiPickerColumnChange" style="margin-bottom: 00rpx;">
		</u-select>
	</view>
</template>
<script>
	export default {
		model: {
			prop: 'times', //指向props的参数名
			event: 'change' //事件名称
		},
		props: {
			activeValue: {
				type: String,
				default: null
			}
		},
		data() {
			return {
				// multiArray 为初始化数据，不管以后用户是否已有数据，再进行初始化，都以该初始化数据为准，这样逻辑实现才会更清晰
				// 默认让服务端提供 第1列的数据，然后根据第1列数据的第1条数据，再次请求第2列、第3列的数据列表
				multiArray: [
					['00'],
					['00'],
					['-'],
					['00'],
					['59']
				],
				multiIndex: [0, 0, 0, 0, 0],
				multiData: [
					[],
					[],
					[],
					[],
					[]
				],
				initValue: null,
				value: '00:00-00:00',
				show_picker: false,
				intValue: [0, 0, 0, 0, 0]
			}
		},
		watch: {
			activeValue: function(newVal, oldVal) {
				console.log("Y->", newVal);
				this.value = newVal
				this.intValue = this.getIntValue(newVal)

				//console.log("FF=>",this.intValue)
			}
		},
		created(options) {
			this.init()
		},
		methods: {
			init() {
				this.multiArray[0].length = 0
				this.multiArray[1].length = 0
				this.multiArray[2].length = 0
				this.multiArray[2].push({
					value: '-',
					label: '-'
				})
				this.multiArray[3].length = 0
				this.multiArray[4].length = 0
				for (var i = 0; i < 24; i++) {
					var v = i < 10 ? '0' + i : '' + i
					this.multiArray[0].push({
						value: v,
						label: v
					})
					this.multiArray[3].push({
						value: v,
						label: v
					})
				}

				for (var i = 0; i < 60; i++) {
					var v = i < 10 ? '0' + i : '' + i
					this.multiArray[1].push({
						value: v,
						label: v
					})
					this.multiArray[4].push({
						value: v,
						label: v
					})
				}
				//必须保留，否则值无法传出
				//this.onChanged()
				this.$forceUpdate();
				this.intValue = this.getIntValue(this.value)
			},
			onChanged(e) {
				console.log('---onChanged----', e)
				// var clazz=JSON.stringify(this.multiIndex)
				var result = this.getResult(e)
				if (new Date("2020-11-23 " + e[0].value + ':' + e[1].value).getTime() >= new Date("2020-11-23 " + e[3].value + ':' + e[4].value).getTime()) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: "开始时刻不能晚于结束时刻",
						during: 2000
					});
					return
				}

				this.value = result
				console.log('---onChanged----', result)

				// #ifndef MP-WEIXIN
				this.$emit('change', this.value);
				// #endif
				// #ifdef MP-WEIXIN
				this.$emit('input', this.value);
				// #endif
			},
			onCancel() {
				// this.value=this.initValue
			},
			// output() {
			// 	let ma = this.multiArray
			// 	let mi = this.multiIndex
			// 	return ma[0][mi[0]] + ':' + ma[1][mi[1]] + "-" + ma[3][mi[3]] + ':' + ma[4][mi[4]]
			// },
			getResult(e) {
				return e[0].value + ':' + e[1].value + "-" + e[3].value + ':' + e[4].value
			},
			show() {
				this.intValue = this.getIntValue(this.value)
				this.show_picker = true
			},
			getIntValue(strValue) {
				var s = strValue
				//console.log("DD",s,s.substring(3,5))
				return [Number(s.substring(0, 2)), Number(s.substring(3, 5)), 0, Number(s.substring(6, 8)), Number(s.substring(9,
					11))]
			}
		}
	}
</script>
