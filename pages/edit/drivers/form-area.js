	import {FormDriver} from "@/common/form-driver.js"
	import {list,getForm,getCusForm,add,get,update,names,getBuildingNames} from '@/api/area.js'
	import {
		isEmpty,
		convertUTCTimeToLocalTime,
		orderCall,
		confirmDo,
		toAsync,
		today,
		compareDate,
		delayToast,
		reloadToast
	} from '@/common/util.js';
	
	
	export	class AreaForm extends FormDriver{
			constructor(name,page,json,dir) {
			    super(name,page,json,dir)
			}	
			
	
			fectchRemoteData(id){
				//必须调用父类的方法来设置id,但是在小程序中不知道为什么无效
				super.fectchRemoteData(id)

				var fun_getBuildingNames =this.getOption(getBuildingNames(),'buildings')
					
				var fun_getForm=super.getForm(getCusForm())
				
				if(!isEmpty(id))				
					orderCall(super.getGet(get({id:id})),fun_getBuildingNames,fun_getForm)
				else
					orderCall(fun_getBuildingNames,fun_getForm)
			}
		
			add(model){
				super.doAdd(add(model))
			}
			update(model){
				super.doUpdate(update(model))
			}
			get(){
				console.log("get=>",this.model.id)
				super.doGet(get({id:this.model.id}))
			}
	}