	import {FormDriver} from "@/common/form-driver.js"
	import {list,getForm,getCusForm,add,get,update,getAreaNames} from '@/api/seat.js'
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
	
	
	export	class SeatForm extends FormDriver{
			constructor(name,page,json,dir) {
			    super(name,page,json,dir)
			}	
			
	
			fectchRemoteData(id){
				super.fectchRemoteData(id)
				var fun_getAreaNames = this.getOption(getAreaNames(), 'area')
				if(!isEmpty(id))				
					orderCall(super.getGet(get({id:id})),fun_getAreaNames,super.getForm(getForm()))
				else
					orderCall(fun_getAreaNames,super.getForm(getForm()))	
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