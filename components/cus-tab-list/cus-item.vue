<template>
	<view class="item-container" 
			@longpress.stop.capture="$emit('cardEvent',{name:'cardLongPress',item:item})"
			@click.stop.capture="$emit('cardEvent',{name:'cardClick',item:item})"
			@cardRemove.stop.capture="$emit('cardEvent',{name:'cardRemove',item:item})" 
			@cardModify.stop.capture="$emit('cardEvent',{name:'cardModify',item:item})"
			@cardDownload.stop.capture="$emit('cardEvent',{name:'cardDownload',item:item})"
			@cardPoster.stop.capture="$emit('cardEvent',{name:'cardPoster',item:item})"
			@cardActive.stop.capture="$emit('cardEvent',{name:'cardActive',item:item})">
<!-- 				<text >站位的</text> -->
		<text v-if="'text'==name">将您的view起个名字放在这里</text>
<!-- 		<news-item v-if="'newsItem'==name" ref="itemView" :newsItem="item" 
			@click="$emit('cardEvent',{name:'cardClick',item:item})"
			@cardRemove="$emit('cardEvent',{name:'cardRemove',item:item})" 
			@cardModify="$emit('cardEvent',{name:'cardModify',item:item})"
			@cardDownload="$emit('cardEvent',{name:'cardDownload',item:item})"
			@cardPoster="$emit('cardEvent',{name:'cardPoster',item:item})"
			@cardActive="$emit('cardEvent',{name:'cardActive',item:item})">
		</news-item> -->
		<item-record v-if="'record'==name" :item="item"></item-record>
	</view>
</template>




<script>
	//import newsItem from '@/pages/news/news-item.nvue';
	import itemRecord from '@/pages/center/item-record.nvue';
	export default {
		components: {
			itemRecord,
			//newsItem: resolve => {require(['@/pages/news/news-item.nvue'], resolve)},
		},
		props:{
			name:{
				type:String,
				default:"text"
			},
			item:{
				type:Object,
				default:()=>{}
			},
		},
		data() {
			return {
				itemData:this.item
			}
		},
		watch:{
			 item:function(newVal,oldVal) {
				 console.log("Y->item",newVal,oldVal);
				 this.itemData=Object.assign({},newVal)	
			 },
			 name:function(newVal,oldVal) {
 				 console.log("Y->item",newVal,oldVal);
	
			 },
		}
	}
</script>

<style scoped lang="scss">
	.item-container{
		width:100%;
		height:100%;
	}
</style>
