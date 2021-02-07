	import {FormDriver} from "@/common/form-driver.js"
	import {list,getForm,getCusForm,add,get,update} from '@/api/building.js'
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
	
	
	export	class BuildingForm extends FormDriver{
			constructor(name,page,json,dir) {
			    super(name,page,json,dir)
			}	
			
	
			fectchRemoteData(id){
				super.fectchRemoteData(id)

				if(!isEmpty(id))				
					orderCall(super.getGet(get({id:id})),super.getForm(getForm()))
				else
					orderCall(super.getForm(getForm()))			
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