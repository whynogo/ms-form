<template>
	<cus-form  :name="name" :fields="items" :fieldMap="options" :data="model" ref="cusForm" @onSubmit="onSubmit" :nextPage="nextPage" />
</template>
<script>
	import {FormDriver,fectchRemoteForm,submitForm,releaseForm} from "@/common/form-driver.js"
	import cusForm from '@/components/cus-form/cus-form.vue'
	
	export default {
	    components: {
	        cusForm,

	    },
		props:{
			itemId:{
				type:String|Number,
				default:''
			},
			items:{
				type:Array,
				default:()=>[]
			},
			options:{
				type:Object,
				default:()=>{}
			},
			model:{
				type:Object,
				default:()=>{}
			},
			nextPage:{
				type:String,
				default:null
			}
		},
		methods:{
			onSubmit(model){
				submitForm(this.form.name,model)
			},
			setForm(form,id){
				this.form=Object.assign({},form)
				fectchRemoteForm(this.form.name,id)
			},
			getCurrentPageNo(){
				return this.$refs.cusForm.getCurrentPageNo()
			},
			tryBack(){
				this.$refs.cusForm.tryBack()
			},
			forceUpdate(page){
				//小程序下无法通过props传入更新后的值，只能这样强行传入
				this.$refs.cusForm.forceUpdate(page)
			},
		},
		beforeDestroy(){
			//释放form对象，formDriver中和本地的
			if(null!=this.form)
				releaseForm(this.form.name)
			this.form=null	
		},
		onBackPress:function(e) {
			this.$refs.cusForm.onBackPress(e)
		},
		mounted(){
		},
	    data() {
	        return {
				form:null,
				name:null,
				key:0,
				itemData:[]
			}
	    }
	}
	

	

</script>

<style>
</style>
