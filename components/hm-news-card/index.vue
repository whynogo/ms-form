<template>
	<div class="hm-news-card" @longpress="onLongPress">
		<div class="container">
			<div class="box" @click="onClick">
				<img class="img" :src="options.image" />
				<span class="title">{{ options.title }}</span>
				<span v-if="null!=options.brief" class="summary">{{ options.brief }}</span>
				<div class="submain">
					<!-- <span class="author">{{ options.source }}</span> -->
					<text class="date">{{ options.date }}</text>
				</div>
				<div class="row_2" />
				<div class="ft">
					<span class="comments" >{{ options.source }} 主办</span>
					<span class="likes" >{{ options.rev_count }}人已预约</span>
				</div>
			</div>
		</div>
		
		<view v-if="isOperating&&options.canOperation">
			<u-button class="operation " shape="square" type="error" size="mini" @click="onRemove">删除</u-button>
			<u-button class="operation" type="primary" size="mini" @click="onModify">修改</u-button>
			<u-button class="operation" type="primary" size="mini" @click="onDownload">下载</u-button>
			<u-button class="operation" type="primary" size="mini" @click="onPoster">海报</u-button>
			<u-button class="operation" type="primary" size="mini" @click="quit">取消</u-button>
		</view>
	</div>
</template>
<script>
	export default {
		props: {
			dataId: {
				type: String,
				default: 'hm-news-card'
			},
			operating:{
				type: Boolean,
				default: false
			},
			options: {
				type: Object,
				default: function() {
					return {
						img: '/static/hm-news-card/images/img_22726_0_0.png',
						title: '新闻标题',
						author: '作者',
						date: '16 MAY 2016',
						summary: '新闻概要。新闻概要长度最好控制在50字符以内沙发撒发顺丰胜多负少的方式的发生防守打法',
						comments: "14 评论",
						likes: "254 喜欢",
						url: '',
						showComments: true,
						showLikes: true
					};
				}
			}
		},
		data() {
			return {
				isOperating:this.operating
			};
		},
		watch: {
			operating: function(newVal, oldVal){
				console.log("Y->", newVal);
				this.isOperating=newVal
			}
		},
		methods: {
			onClick() {
				uni.navigateTo({
					url: this.options.url
				});
			},
			onRemove(){
				this.$emit('cardRemove', this.options);
			},
			onModify(){
				this.$emit('cardModify', this.options);
				this.quit()
			},
			onDownload(){
				this.$emit('cardDownload', this.options);
				this.quit()
			},
			onPoster(){
				this.$emit('cardPoster', this.options);
				this.quit()
			},
			quit(){
				this.isOperating=false
			},
			onLongPress(e){
				this.isOperating=true
				this.$emit('cardActive', this.options);

			}
		}
	};
</script>
<style>
	@import './index.response.css';
	.operation{
		margin:20rpx;
		width:100rpx;
	}
</style>
