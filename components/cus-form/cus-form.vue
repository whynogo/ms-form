<template>
	<view class="wrap" :style="{height:formHeight+'px'}">
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType" :style="{height:formHeight+'px'}">
			<view v-for="(item,i) in items" :key="item.name">
				<!-- 文本 -->
				<u-form-item  :ref="item.name" v-if="canShow('text',item)" :leftIconStyle="{color: '#888', fontSize: '32rpx'}"  :label-width="labelWidth" :label-position="labelPosition" :label="item.label" :prop="item.name">
					<cus-input :name="item.name" :border="border" :placeholder="item.placeholder"  v-model="item.current" :current="item.current" type="text"     v-if="canShow('text',item)" @textChanged="onTextChanged" />
				</u-form-item>
				<u-form-item  :ref="item.name" v-if="canShow('textarea',item)" :leftIconStyle="{color: '#888', fontSize: '32rpx'}"  :label-width="labelWidth" :label-position="labelPosition" :label="item.label" :prop="item.name">
						<cus-input :border="border" :placeholder="item.placeholder" v-model="item.current" :current="item.current" type="textarea" />
				</u-form-item>
				<u-form-item  :ref="item.name" v-if="canShow('password',item)" :leftIconStyle="{color: '#888', fontSize: '32rpx'}" :label-width="labelWidth" :label-position="labelPosition" :label="item.label" :prop="item.name">
						<cus-input :border="border" :placeholder="item.placeholder" v-model="item.current" :current="item.current" type="password" />
				</u-form-item>

				<!-- 图片 -->
				<u-form-item  :ref="item.name"  v-if="canShow('upload',item)" :leftIconStyle="{color: '#888', fontSize: '32rpx'}"  :label-width="labelWidth" :label-position="labelPosition" :label="item.label" :prop="item.name">
					<u-upload :index="item.name" width="160" height="160" ref="fileSelector" :file-list="item.filelist"  :max-size="item.size" :max-count="1"
					 :auto-upload="false" @on-choose-complete="onImageSelected" @on-remove="onImageRemoved"></u-upload>
				</u-form-item>

				
				<!-- 列表 -->
				<u-form-item  :ref="item.name" v-if="canShow('select',item)" :leftIconStyle="{color: '#888', fontSize: '32rpx'}"  :label-width="labelWidth" :label-position="labelPosition" :label="item.label" :prop="item.name">
						<cus-input :border="border" :placeholder="item.placeholder" v-model="item.current" :current="item.current" type="select" @click="showSelection = true"/>
						<cus-select v-model="showSelection" :name="item.name" :list="getCurSelectList(i)" @confirm="saveSeletion" :default-value="1"></cus-select>
				</u-form-item>
				 <u-form-item  :ref="item.name" v-if="canShow('extKey',item)" :leftIconStyle="{color: '#888', fontSize: '32rpx'}"  :label-width="labelWidth" :label-position="labelPosition" :label="item.label" :prop="item.name">
				 		<cus-input :border="border" :placeholder="item.placeholder" v-model="item.current" :current="item.current" type="select" @click="showSelection = true"/>
				 		<cus-select v-model="showSelection" :name="item.name" :list="getCurExtName(i)" @confirm="saveExtName"></cus-select>
				 </u-form-item> 
				 
				
				<!-- 时间 -->
				<u-form-item  :ref="item.name" :key="item.name"  v-if="canShow('time',item)" :leftIconStyle="{color: '#888', fontSize: '32rpx'}"  :label-width="labelWidth" :label-position="labelPosition" :label="item.label" :prop="item.name">
					<cus-input :border="border" :placeholder="item.placeholder" v-model="item.current" :current="item.current" type="select" @click="onTimeShow(item)"  />
					<date-time-picker :ref="item.name+'time'" :name="item.name" :indicatorStyle='indicatorStyle' :type="'hour-minute'" :datestring="item.current" @change="saveDatetime"></date-time-picker>
				</u-form-item>
				<u-form-item  :ref="item.name" :key="item.name"  v-if="canShow('date',item)" :leftIconStyle="{color: '#888', fontSize: '32rpx'}"  :label-width="labelWidth" :label-position="labelPosition" :label="item.label" :prop="item.name">
					<cus-input :border="border" :placeholder="item.placeholder" v-model="item.current" :current="item.current" type="select" @click="onTimeShow(item)"  />
					<date-time-picker :ref="item.name+'time'" :name="item.name" :indicatorStyle='indicatorStyle' :type="'date'" :datestring="item.current" @change="saveDatetime"></date-time-picker>
				</u-form-item>
				<u-form-item  :ref="item.name" :key="item.name"  v-if="canShow('datetime',item)" :leftIconStyle="{color: '#888', fontSize: '32rpx'}"  :label-width="labelWidth" :label-position="labelPosition" :label="item.label" :prop="item.name">
					<cus-input :border="border" :placeholder="item.placeholder" v-model="item.current" :current="item.current" type="select" @click="onTimeShow(item)"  />
					<date-time-picker :ref="item.name+'time'" :name="item.name" :indicatorStyle='indicatorStyle' :type="'datetime'" :datestring="item.current" @change="saveDatetime"></date-time-picker>
				</u-form-item>
				
				<!-- 数字 -->
				<u-form-item  :ref="item.name" v-if="canShow('int',item)" :leftIconStyle="{color: '#888', fontSize: '32rpx'}"  :label-width="labelWidth" :label-position="labelPosition" :label="item.label" :prop="item.name">
						<cus-number-box v-model="item.current" :current="item.current" :min="item.min" :max="item.max" ></cus-number-box>
				</u-form-item>
				
				<!-- 杂类 -->
				<u-form-item  :ref="item.name" v-if="canShow('switch',item)" :leftIconStyle="{color: '#888', fontSize: '32rpx'}"  :label-width="labelWidth" :label-position="labelPosition" :label="item.label" :prop="item.name">
					<cus-switch :name="item.name"  :current="item.current" slot="right" @change="saveSwitch"></cus-switch>
				</u-form-item>	
				<u-form-item  :ref="item.name" v-if="canShow('enum',item)" :leftIconStyle="{color: '#888', fontSize: '32rpx'}"  :label-width="labelWidth" :label-position="labelPosition" :label="item.label" :prop="item.name">
					<cus-subsection :width="200" :name="item.name"slot="right" style="width:200px" vibrateShort :list="item.list" :current="item.current" @change="saveState" ></cus-subsection>
				</u-form-item>				
				<u-form-item  :ref="item.name" v-if="canShow('check',item)" :leftIconStyle="{color: '#888', fontSize: '32rpx'}"  :label-width="0" :label-position="labelPosition" :label="''" :prop="item.name">
					<cus-check  :name="item.name" v-model="item.current" @change="saveCheck"></cus-check>
					<view class="agreement-text">
						{{item.label}}
					</view>
				</u-form-item>
			</view>	
			<u-button class="submit-button"v-if="getItemCountInCurPage()>0" type="primary" @click="preSubmit">{{getButtonText()}}</u-button>
		</u-form>

	</view>
</template>

<script>
/**
 * H5版本下，v-model="model[item.name]完全正常，但是编译到小程序的版本总是不刷新数据，(v-model无效)。所以只能修改u-input，增加了current props(仅用于显示)，使用item.current的形式可以刷新
 */	

var SUPPORT_TYPES={"text":1,"textarea":1,"password":1,"upload":1,"select":1,"extKey":1,"time":1,"date":1,"datetime":1,"int":1,"switch":1,"enum":1,"check":1}
import {Validator} from "@/common/validate.js"
import cusSelect from "@/components/cus-select.vue"
import cusInput from "@/components/cus-input.vue"
import cusNumberBox from "@/components/cus-number-box.vue"
import cusSubsection from "@/components/cus-subsection.vue"
import cusCheck from "@/components/cus-checkbox.vue"
import cusSwitch from "@/components/cus-switch.vue"
import DateTimePicker from '@/components/bory-dateTimePicker/bory-dateTimePicker.vue'
import moment from 'dayjs'
	import {
		EditorDriver,
		fectchEditorContent,
		setEditorContent,
		getEditorContent
	} from "@/common/editor-driver.js"
	import {
		isEmpty,
		strToBase64
	} from '@/common/util.js';
	import {
		naviTo
	} from '@/common/route.js';
export default {
	components:{
		cusSelect,cusSubsection,cusInput,cusNumberBox,DateTimePicker,cusCheck,cusSwitch
	},
	props:{
		labelWidth:{
			type:Number,
			default:180		
		},
		fields:{
			type:Array,
			default:()=>[]
		},
		fieldMap:{
			type:Object,
			default:()=>{}
		},
		data:{
			type:Object,
			default:()=>{}
		},
		name:{
			type:String,
			default:"cus-form"		
		},
		nextPage:{
			type:String,
			default:null
		}
	},
	 computed: {

	},
	watch:{
		fields:function(nVal){
			//console.log("cus-form items in ")
			this.items=nVal.map(item=>{
				return item	
			})
			this.initValidator()
			//还要转化一下model数据显示
			this.$nextTick(function(){
				this.initModel()			
			})
		},
		data:function(nVal){
			//console.log("cus-form model in",nVal)
			this.model=Object.assign({},nVal)
						//还要转化一下model数据显示
			this.$nextTick(function(){
				this.initModel()			
			})
		},
		fieldMap:function(nVal){
			//console.log("cus-form options in ")
			this.options=this.$u.deepClone(nVal)
			
			this.$nextTick(function(){
				this.initModel()			
			})
		},
	},
	data() {
		let that = this;
		
		return {
			indicatorStyle: {
					background: 'rgba(156, 169, 255, 0.2)',
					height: '40px',
				
			},
			totalPage:1,
			curPage:0,
			model: {

			},
			rules: {

			},
			items:[],
			options:[],
			border: false,
			labelPosition: 'left',
			errorType: ['toast'],
			showSelection:false,
			showTime:"",
			formHeight:100
		};
	},
	onLoad() {

	},
	computed: {
		borderCurrent() {
			return this.border ? 0 : 1;
		}
	},
	
	mounted() {
		
		this.formHeight=uni.getSystemInfoSync().windowHeight-45
		this.$refs.uForm.setRules(this.rules);
		this.registerListener()
	},
	methods: {
		submit(){
			console.log("submit=>",this.model)
			this.$emit("onSubmit",this.model)
		},
		initValidator(){
			this.parseItems(this.items)
		},
		parseItems(items){
			//将model保存到Validator中，便于多字段直接进行校验
			var rules=new Array()
			var totalPage=0
			items.forEach(item=>{
				totalPage=Math.max(totalPage,item.page)
				
				if(item.type=="text"||item.type=="textarea")
					rules[item.name]= Validator.valText(item.required,item.label,item.min,item.max,item.chinese,item.message)
				else if(item.type=="extKey"||item.type=="select")
					rules[item.name]= Validator.valText(item.required,item.label,item.min,item.max,item.message)
				else if(item.type=="upload")
					rules[item.name]= Validator.valText(item.required,item.label,item.min,item.max,item.message)	
				else if(item.type=="enum")		
					rules[item.name]= Validator.valEnum(item.required,item.label,item.list,item.message)
				else if(item.type=="time")
					rules[item.name]= Validator.valTime(item.required,item.label,item.message)
				else if(item.type=="date")
					rules[item.name]= Validator.valDate(item.required,item.label,item.message)
				else if(item.type=="datetime")
					rules[item.name]= Validator.valDatetime(item.required,item.label,item.message)
				else if(item.type=="int")
					rules[item.name]= Validator.valNumber(item.required,item.label,item.min,item.max,item.message)
			})
			this.rules=rules
			this.totalPage=totalPage+1
			//console.log("rules=>",this.rules)
			this.$refs.uForm.setRules(this.rules);
		},
		initModel(){
			for(var field in this.model){
				var item=this.items.find(item=>{return item.name==field})
				if(!isEmpty(item))
					switch(item.type){
						case "extKey":{
								var value=this.model[field]
								var optionName=item.extTable
								//然后查找到对应的label让input显示出来
								if(null==value)
									item.current=""
								else	
									item.current=this.options[optionName].find(it=>{return it.value==value}).label
								break;
							}
						case "upload":{
								var value=this.model[field]
								//放入list让upload显示出来
								if(!isEmpty(value))
									item.filelist.push({url:value})
								break;
							}
						case "enum":{
								var value=this.model[field]
								item.current=value
								break;
							}
						case "text":{
								var value=this.model[field]
								item.current=value
								break;
							}
						default:{
							var value=this.model[field]
							item.current=value
							break;
						}
					}
			}
		},
		//文字一改变，马上校验
		onTextChanged(value,name){
			console.log(value,name)
			this.model[name]=isEmpty(value)?null:value
			this.validateItem(this,name)	
		},		
		onImageSelected(filelist,name) {
			console.log("file list0->",name, filelist[0].url)
			var item=this.items.find(item=>{return item.name==name})
			this.model[name]=filelist[0].url
			this.validateItem(this,name)
			console.log(this.model)
		},
		onImageRemoved(index,filelist,name) {
			console.log("image removed",filelist,name)
			var item=this.items.find(item=>{return item.name==name})
			this.model[name]=null
			console.log(this.model)
		},
		getButtonText(){
			if(this.curPage<this.totalPage-1)
				return "确认"+(this.curPage+1)+"/"+this.totalPage
			else
				return "提交"				
		},
		saveSwitch(value,name) {
			//console.log(value,name)	
			var item=this.items.find(item=>{return item.name==name})
			this.model[name]=value
			item.current= value
			this.$forceUpdate()//不加这一句，H5下不更新
		},
		saveCheck(e) {
			var item=this.items.find(item=>{return item.name==e.name})
			this.model[e.name]=e.value
			item.current= e.value
		},
		saveDatetime(value,name) {
			//console.log(value,name)
			var item=this.items.find(item=>{return item.name==name})
			this.model[item.name]=value
			item.current= value
			this.$forceUpdate()//不加这一句，H5下不更新
		},
		saveState(value,name){
			//console.log(value,name)
			var item=this.items.find(item=>{return item.name==name})
			item.current=value
			this.model[item.name]=value
			//console.log(this.model)
		},
		saveSeletion(value){
			console.log(value)
			var item=this.items.find(item=>{return item.name==value.owner})
			var label=""
			var model=[]
			value.selection.forEach(col=>{
				model.push(col.value)
				label+="-"+col.label
			})
			label=label.substr(1)
			this.model[item.name]=model
			item.curSelect=label	
		},
		saveExtName(value){
			console.log(value)
			var item=this.items.find(item=>{return item.name==value.owner})
			var label=""
			var model=[]
			value.selection.forEach(col=>{
				model.push(col.value)
				label+="-"+col.label
			})
			label=label.substr(1)
			this.model[item.name]=model[0]//extName只有一个，所以直接取第一个
			item.current=label	
		},
		getCurSelectList(index){
			console.log(index)
			return this.items[index].list
		},
		getCurExtName(index){
			//console.log("getCurExtName",index)
			//使用extTable作为选择options的key
			var name=this.items[index].extTable
			return this.options[name]
		},
		canShow(type,item){
			//console.log("show=>",type,item.type,(this.curPage==item.page)&&type==item.type)
			return type==item.type&&this.curPage==item.page
		},
		getCurrentPageNo(){
			return this.curPage
		},
		tryBack(){
			this.$nextTick(function(){
				this.doPrePage()			
			})
		},
		doNextPage(){
						console.log("doNextPage=>",this.curPage)
			if(this.curPage<this.totalPage)
				if(this.totalPage-this.curPage>1){
					this.curPage++
					if(0==this.getItemCountInCurPage(this.curPage)){
						this.gotoOtherPage("",this.curPage)
					}
				}	
							console.log("doNextPage=>",this.curPage)
		},
		doPrePage(){
			console.log("doPrePage=>",this.curPage)
			if(this.curPage>0){
				this.curPage--
				if(0==this.getItemCountInCurPage(this.curPage)){
					this.gotoOtherPage("",this.curPage)
				}
			console.log("doPrePage==>",this.curPage)
			}
		},
		doCurPage(){
			if(0==this.getItemCountInCurPage(this.curPage)){
				this.gotoOtherPage("",this.curPage)
			}
			
		},	
		collectSubmitData(){
			//有些已经在model中了，不需要处理
			this.items.forEach(item=>{
				if("text"==item.type||"textarea"==item.type){
					this.model[item.name]=isEmpty(item.current)?null:item.current
					//console.log("current=>",item.name,item.current,this.model[item.name])		
				}else if("rich"==item.type){
					this.model[item.name]=getEditorContent(item.name)
					console.log("rich=>",getEditorContent(item.name))
				}else if("extKey"!=item.type&&"select"!=item.type&&"upload"!=item.type){
					this.model[item.name]=item.current
					//console.log("current=>",item.name,item.current)
				}
			})
			//把數據也傳給Validator
			Validator.setModel(this.model)
			console.log("collectSubmitData=>",this.model)
		},
		preSubmit() {
			var that=this
			
			this.collectSubmitData()
				
			console.log('验证=>',that.totalPage,that.curPage);	
			this.validateCurrentPage(this,valid => {
				if (valid) {
					if(that.curPage<that.totalPage){
						if(that.totalPage-that.curPage>1){
							that.curPage++
							console.log('验证通过',""+that.curPage+"/"+that.totalPage);
							if(0==this.getItemCountInCurPage(that.curPage)){//本页只有一个无法处理的item
								that.$nextTick(function(){//加这个是为了这里状态退出，可以打出log
								
									that.gotoOtherPage(that.nextPage,that.curPage)//转移页面，将不能处理的类型给外部页面处理									
									//that.curPage=(0==that.curPage?0:that.curPage-1)//因为这个页面实际不在本form，所以设置为上一个页面
								})
								
							}
						}else if(that.totalPage-that.curPage==1){
							console.log('验证通过');
							that.submit()
						}
					}	
				} else {
					console.log('验证失败',""+(that.curPage+1)+"/"+that.totalPage);
				}
			});
		},
		gotoOtherPage(nextPage,pageNo){
			console.log('gotoOtherPage=>',nextPage,pageNo)
			//找到这一个item
			var item=this.items.filter(it=>{return it.page==pageNo&&!(it.type in SUPPORT_TYPES)})[0]
			switch(item.type){
				case "rich":{
						//注册一个editor
						var buttonLabel=this.isLastPage()?"提交":`提交${this.curPage+1}/${this.totalPage}`
						var editorContent=new EditorDriver(item.name,buttonLabel,this.model[item.name])
						//跳转到公用的editors
						naviTo("/pages/edit/editors?name="+item.name)
						//等待返回事件，registerListener


					}
			}
		},
		registerListener(){
			//避免多次注册，否则收到多次就乱了
			uni.$on("richtext-back", (name,cause)=>{
				console.log("===>","richtext-back received",name,cause,this.curPage)
				this.$nextTick(function(){
					if("save"==cause){
						//save 返回其实就是下一步
						this.model[name]=Object.assign({},getEditorContent(name).content)
						if(this.isLastPage()){
							this.collectSubmitData()
							//还要校验
							this.submit()
						}	
						else
							this.doNextPage()
					}else if("back"==cause)//back返回其实就是上一步
						this.doPrePage()								
				})
			})
		},
		getItemCountInPage(page){
			var items=this.items.filter(it=>{return it.page==page&&(it.type in SUPPORT_TYPES)})
			return items.length
		},
		getItemCountInCurPage(){
			var items=this.items.filter(it=>{return it.page==this.curPage&&(it.type in SUPPORT_TYPES)})
			return items.length
		},
		isLastPage(){
			return this.curPage==this.totalPage-1
		},	

		// 点击actionSheet回调
		actionSheetCallback(index) {
			uni.hideKeyboard();
			this.model.sex = this.actionSheetList[index].text;
		},
		// 校验全部数据
		validateAll(that,callback) {
			var validators=that.items
			return this.validate(that,validators,callback)	
		},
		validateCurrentPage(that,callback) {
			var validators=that.items.filter(it=>{return it.page==that.curPage})
			return this.validate(that,validators,callback)	
		},
		validateItem(that,name,callback) {
			var validators=that.items.filter(it=>{return it.name==name})
			return this.validate(that,validators,callback)	
		},
		validate(that,validators,callback) {
			return new Promise(resolve => {
				// 对所有的u-form-item进行校验
				let valid = true; // 默认通过
				let count = 0; // 用于标记是否检查完毕
				let errorArr = []; // 存放错误信息
				validators.map(field => {
						// 调用每一个u-form-item实例的validation的校验方法,注意这里要取第一个【0】，也可能不在本页
						var item=that.$refs[field.name]
						if(!isEmpty(item))
							that.$refs[field.name][0].validation('', error => {
								// 如果任意一个u-form-item校验不通过，就意味着整个表单不通过
								if (error) {
									valid = false;
									errorArr.push(error);
								}
								// 当历遍了所有的u-form-item时，调用promise的then方法
								if (++count === validators.length) {
									resolve(valid); // 进入promise的then方法
									// 判断是否设置了toast的提示方式，只提示最前面的表单域的第一个错误信息
									if(this.errorType.indexOf('none') === -1 && this.errorType.indexOf('toast') >= 0 && errorArr.length) {
										this.$u.toast(errorArr[0]);
									}
									// 调用回调方法
									if (typeof callback == 'function') callback(valid);
								}
							})
						else
							resolve(true)
				});
			});
		},
		onTimeShow(item){
			//console.log("onPickerClick",item)
			this.$refs[item.name+'time'][0].show()
		},
		forceUpdate(page){
			//小程序下无法通过props传入更新后的值，只能这样强行传入
			
			this.options=this.$u.deepClone(page.options)
			
			this.items=page.items.map(item=>{
				return item
			})
			this.parseItems(page.items)
			
			this.model=Object.assign({},page.model)
			//console.log("forceUpdate->",page.model,page.items,page.options)
			this.initModel()
			
			this.$forceUpdate()
		},

	}
};
</script>

<style scoped lang="scss">
.wrap {
	padding: 30rpx;
}

.submit-button {
	margin: 10rpx 20rpx;
}

.agreement {
	display: flex;
	align-items: center;
	margin: 40rpx 0;

	.agreement-text {
		padding-left: 8rpx;
		color: $u-tips-color;
	}
}
</style>
