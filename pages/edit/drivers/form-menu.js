	import {FormDriver} from "@/common/form-driver.js"
	import {list,getForm,getCusForm,add,get,update,names} from '@/api/menu.js'
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
	
	
	export	class MenuForm extends FormDriver{
			constructor(name,page,json,dir) {
			    super(name,page,json,dir)
			}	
			
	
			fectchRemoteData(id){
				super.fectchRemoteData(id)
				var fun_names=super.getOption(names(),"menu")
				var fun_getForm=super.getForm(getForm())
				
				if(!isEmpty(id))
					orderCall(super.getGet(get({id:id})),fun_names,fun_getForm)
				else
					orderCall(fun_names,fun_getForm)	

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