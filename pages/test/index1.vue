<template>
	<view class="content">
		<mix-tree :list="list" @treeItemClick="treeItemClick"></mix-tree>
	</view>
</template>

<script>
	import mixTree from '@/components/mix-tree/mix-tree';
	let testList = [{
			id: 1,
			name: '北京市',
			children: [{
				id: 11,
				name: '市辖区',
				children: [{
						id: 111,
						name: '西城区',
						children: [{
							id: 1111,
							name: '南河沿大街',
							children: [{
								id: 11111,
								name: '紫金宫饭店',
							}, ]
						}, ]
					},
					{
						id: 112,
						name: '东城区',
					},
					{
						id: 113,
						name: '朝阳区',
					},
					{
						id: 113,
						name: '丰台区',
					}
				]
			}, ]
		},
		{
			id: 2,
			name: '河北省',
			children: [{
					id: 21,
					name: '石家庄市',
				},
				{
					id: 22,
					name: '唐山市',
				},
				{
					id: 23,
					name: '秦皇岛市',
				},
			]
		},
		{
			id: 3,
			name: '山东省',
			children: [{
					id: 31,
					name: '济南市',
					children: [{
							id: 311,
							name: '历下区',
							children: [{
								id: 3131,
								name: '解放路街道办事处',
							}, ]
						},
						{
							id: 312,
							name: '槐荫区',
						},
						{
							id: 313,
							name: '天桥区',
						},
						{
							id: 314,
							name: '历城区',
						},
						{
							id: 315,
							name: '长清区',
						}
					]
				},
				{
					id: 32,
					name: '青岛市',
				},
				{
					id: 33,
					name: '临沂市',
					children: [{
							id: 331,
							name: '兰山区',
							children: [{
								id: 3331,
								name: '金雀山街道',
							}, ]
						},
						{
							id: 332,
							name: '河东区',
						},
						{
							id: 333,
							name: '罗庄区',
							children: [{
								id: 3331,
								name: '盛庄街道',
							}, ]
						}
					]
				},
				{
					id: 34,
					name: '日照市',
				},
				{
					id: 35,
					name: '淄博市',
				},
				{
					id: 36,
					name: '枣庄市',
				},
				{
					id: 37,
					name: '东营市',
				},
				{
					id: 38,
					name: '潍坊市',
				},
				{
					id: 39,
					name: '烟台市',
				},
				{
					id: 40,
					name: '济宁市',
				},
				{
					id: 41,
					name: '泰安市',
				},
				{
					id: 42,
					name: '威海市',
				},
				{
					id: 43,
					name: '滨州市',
				},
				{
					id: 44,
					name: '菏泽市',
				},
			]
		},
		{
			id: 4,
			name: '河南省',
		},
		{
			id: 5,
			name: '湖北省',
		},
		{
			id: 6,
			name: '湖南省',
		}
	]
	export default {
		components: {
			mixTree
		},
		data() {
			return {
				list: []
			}
		},
		onLoad() {
			setTimeout(()=>{
				this.list = testList;
			}, 300)
		},
		methods: {
			//点击最后一级时触发该事件
			treeItemClick(item) {
				let {
					id,
					name,
					parentId
				} = item;
				uni.showModal({
					content: `点击了${parentId.length+1}级菜单, ${name}, id为${id}, 父id为${parentId.toString()}`
				})
				console.log(item)
			}
		}
	}
</script>

<style>

</style>
