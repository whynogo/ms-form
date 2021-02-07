import moment from 'dayjs'
var Validator={
		setModel(model){
			this.model=model
		},	
		valEnum(required,name,list,message){
			var all=new Set()
			list.forEach(item=>{
				all.add(item.value)
			})
			return [
				// {
				// 	required: required,
				// 	message: '请输入'+name,
				// 	trigger: 'blur' ,
				// },
				{
					// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
					validator: (rule, value, callback) => {
						// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
						//console.log("==>",rule, value)
						return all.has(value)
					},
					message:message,
					// 触发器可以同时用blur和change，二者之间用英文逗号隔开
					trigger: ['change','blur'],
				},
			]
		},
		valTime(required,name,message){
			return [
				{
					required: required,
					message: '请选择'+name,
					trigger: 'blur' ,
				},
				{
					// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
					validator: (rule, value, callback) => {
						// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
						   return moment("2021-01-23 "+value, ["YYYY-MM-DD HH:mm"]).isValid()
					},
					message:"时间格式非法",
					// 触发器可以同时用blur和change，二者之间用英文逗号隔开
					trigger: ['change','blur'],
				},
				{
					// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
					validator: (rule, value, callback) => {
						// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
						if(rule.fullField=="end"&& "begin" in this.model){
							return moment("2021-01-23 "+value)>moment("2021-01-23 "+this.model.begin)
						}
						else
						   return true
					},
					message:"结束时间应该晚于开始时间",
					// 触发器可以同时用blur和change，二者之间用英文逗号隔开
					trigger: ['change','blur'],
				},
			]
		},
		valDate(required,name,message){
			return [
				{
					required: required,
					message: '请选择'+name,
					trigger: 'blur' ,
				},
				{
					// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
					validator: (rule, value, callback) => {
						// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
						return moment(value, ["YYYY-MM-DD"]).isValid()
					},
					message:message,
					// 触发器可以同时用blur和change，二者之间用英文逗号隔开
					trigger: ['change','blur'],
				},
				{
					// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
					validator: (rule, value, callback) => {
						// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
						if(rule.fullField=="end"&& "begin" in this.model){
							return moment(value)>moment(this.model.begin)
						}
						else
						   return true
					},
					message:"结束时间应该晚于开始时间",
					// 触发器可以同时用blur和change，二者之间用英文逗号隔开
					trigger: ['change','blur'],
				},
			]
		},
		valDatetime(required,name,message){
			return [
				{
					required: required,
					message: '请选择'+name,
					trigger: 'blur' ,
				},
				{
					// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
					validator: (rule, value, callback) => {
						// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
						return moment(value, ["YYYY-MM-DD HH:mm"]).isValid()||moment(value, ["YYYY-MM-DD HH:mm:ss"]).isValid()
					},
					message:message,
					// 触发器可以同时用blur和change，二者之间用英文逗号隔开
					trigger: ['change','blur'],
				},
				{
					// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
					validator: (rule, value, callback) => {
						// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
						if(rule.fullField=="end"&& "begin" in this.model){
							return moment(value)>moment(this.model.begin)
						}
						else
						   return true
					},
					message:"结束时间应该晚于开始时间",
					// 触发器可以同时用blur和change，二者之间用英文逗号隔开
					trigger: ['change','blur'],
				},
			]
		},
		valRegex(required,name,regex,message){
			return [
				{
					required: required,
					message: '请输入'+name,
					trigger: ['change','blur'],
				},
				{
					// 正则不能含有两边的引号
					pattern: regex,
					message: message,
					trigger: ['change','blur'],
				}
			]},
		valNumber(required,name,min,max){
			return [
				// {
				// 	required: required,
				// 	message: '请输入'+name,
				// 	trigger: ['change','blur'],
				// },
				{
					type: 'number',
					message: name+'只能为数字',
					trigger: ['change','blur'],
				},
				{
					// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
					validator: (rule, value, callback) => {
						// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
						return value>=min&&value<=max
					},
					message:name+'在'+min+'到'+max+'之间',
					// 触发器可以同时用blur和change，二者之间用英文逗号隔开
					trigger: ['change','blur'],
				},
			]
		},
		valText(required,name,min,max,chineseOnly=false){
			return [
				{
					required: required,
					message: '请输入'+name,
					trigger: ['change','blur']
				},
				{
					min: min,
					max: max,
					message: name+'长度在'+min+'到'+max+'个字符',
					trigger: ['change','blur'],
				},
				// {
				// 	// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
				// 	validator: (rule, value, callback) => {
				// 		// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
				// 		return value.length>=min&&value.length<=max	
				// 	},
				// 	message:name+'长度在'+min+'到'+max+'个字符',
				// 	// 触发器可以同时用blur和change，二者之间用英文逗号隔开
				// 	trigger: ['change','blur'],
				// },
				{
					// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
					validator: (rule, value, callback) => {
						// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
						if(chineseOnly)
							return this.$u.test.chinese(value);
						else
							return true	
					},
					message: name+'必须为中文',
					// 触发器可以同时用blur和change，二者之间用英文逗号隔开
					trigger: ['change','blur'],
				},
			]
		}
}

module.exports = {
	Validator
}