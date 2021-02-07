import {
	list,
	add,
	del,
	get,
	update,
	getAreaNames 
} from '@/api/seat.js'

import {
		ListDriver
	} from "@/common/list-driver.js"
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


	export class SeatList extends ListDriver {
		constructor(name, page, dir) {
			super(name, page, dir)
		}




		fectchRemoteData(listQuery) {
			//必须调用父类的方法来设置id
			super.fectchRemoteData(listQuery)

			var fun_getAreaNames = this.getOption(getAreaNames(), 'area')

			var fun_getList = super.getList(list(listQuery))

			orderCall(fun_getAreaNames,fun_getList)
		}

		getOptions() {
			return {
				state: [{
					value: 0,
					label: "关闭"
				}, {
					value: 1,
					label: "开放"
				}]
			}
		}

		getColumns() {
			return [
			]
		}

		add(id) {
			super.doAdd(this.name)
		}
		update(id) {
			super.doUpdate(id, this.name)
		}
		del(ids) {
			super.doDel(del({
				ids: ids
			}), () => {
				super.doGetList(list())
			})
		}
	}
