<template>
	<view class="mix-tree-content">
		<view class="mix-tree-list">
			<block v-for="(item, index) in treeList" :key="index">
				<view 
					class="mix-tree-item"
					:style="[{
							paddingLeft: item.rank*15 + 'px',
							zIndex: item.rank*-1 +50,
							height:(item.show?'36px':'0px')
						}]"
					:class="{
							border: treeParams.border === true,
							show: item.show,
							last: item.lastRank,
							showchild: item.showChild,
							active:item.id==currentItem
						}"
					@click.stop="treeItemTap(item, index)"
				>
					<image class="mix-tree-icon" :src="item.lastRank ? treeParams.lastIcon : item.showChild ? treeParams.currentIcon : treeParams.defaultIcon"></image>
					<image class="mix-tree-item-image" :src="item.image"></image>
					{{item.label}}
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default(){
					return [];
				}
			},
			params: {
				type: Object,
				default(){
					return {}
				}
			}
		},
		data() {
			return {
				treeList: [],
				treeParams: {
					defaultIcon: '/static/mix-tree/defaultIcon.png',
					currentIcon: '/static/mix-tree/currentIcon.png',
					lastIcon: '',
					border: false
				},
				currentItem:''
			}
		},
		watch: {
			list(list){
				
				this.treeParams = Object.assign(this.treeParams, this.params);
				console.log(this.treeParams, this.params);

				this.renderTreeList(list,0,[],true);
				
				if(list.length>0)
				   this.treeItemTap(list[0],true)

			}
		},
		methods: {
			//扁平化树结构
			renderTreeList(list=[], rank=0, parentId=[],init=false){
				list.forEach((item,index)=>{
					this.treeList.push({
						id: item.id,
						name: item.shortname,
						label:item.label,
						image:item.image,
						parentId,  // 父级id数组
						rank,  // 层级
						showChild: init&&0==index?true:false,  //子级是否显示,默认初始化话时打开第一个
						show: rank === 0  // 自身是否显示
					})
					if(Array.isArray(item.children) && item.children.length > 0){
						let parents = [...parentId];
						parents.push(item.id);
						this.renderTreeList(item.children, rank+1, parents);
					}else{
						this.treeList[this.treeList.length-1].lastRank = true;
					}
				})
			},
			// 点击
			treeItemTap(item){
				let list = this.treeList;
				let id = item.id;
				if(item.lastRank === true){
					//点击最后一级时触发事件
					this.currentItem=id
					this.$emit('treeItemClick', item);
					return;
				}

				item.showChild = !item.showChild;
				list.forEach(childItem=>{
					if(item.showChild === false){
						//隐藏所有子级
						if(!childItem.parentId.includes(id)){
							return;
						}
						if(childItem.lastRank !== true){
							childItem.showChild = false;
						}
						childItem.show = false;
					}else{
						if(childItem.parentId[childItem.parentId.length-1] === id){
							childItem.show = true;
						}
					}
				})
			}
		}
	} 
</script>

<style scoped>
	.mix-tree-content{
		height:300px;
	}
	.mix-tree-list{
		display: flex;
					height:300px;	
		flex-direction: column;
		padding-left: 30upx;
		background-color: #ECF5FE;
	}
	.mix-tree-item{
		display: flex;
		align-items: center;
		font-size: 30upx;
		color: #333;
		height: 0px;
		opacity: 0;
		transition: .2s;
		position: relative;
	}
	
	.mix-tree-item.active{
		display: flex;
		align-items: center;
		font-size: 21px;
		color: #333;
		height: 0;
		opacity: 0;
		transition: .2s;
		position: relative;
		background-color: #EAECED;
	}
	
	.mix-tree-item.border{
		border-bottom: 1px solid #eee;
	}
	.mix-tree-item.show{
		height: 80upx;
		opacity: 1;
	}
	.mix-tree-icon{
		width: 13px;
		height: 13px;
		margin-right: 8px;
		opacity: .9;
	}
	
	
	.mix-tree-item-image{
		width: 20px;
		height: 20px;
		margin-right: 8px;
		opacity: .9;
	}
	
	.mix-tree-item.showchild:before{
		transform: rotate(90deg);
	}
	.mix-tree-item.last:before{
		opacity: 0;
	}
</style>
