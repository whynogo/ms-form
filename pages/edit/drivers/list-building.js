import {
		ListDriver
	} from "@/common/list-driver.js"
	import {
		getArea,
		getBuildingNames,
		getBuildingList,
		areaAdd,
		areaDel,
		areaGet,
		areaUpdate
	} from '@/api/seat.js'
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


	export class BuildingList extends ListDriver {
		constructor(name, page, dir) {
			super(name, page, dir)
		}




		fectchRemoteData(listQuery) {
			//必须调用父类的方法来设置id
			super.fectchRemoteData(listQuery)

			var fun_getList = super.getList(getBuildingList(listQuery))

			orderCall(fun_getList)
		}

		getOptions() {
			return {
				state: [{
					value: 0,
					label: "关闭",
					state:"none"
				}, {
					value: 1,
					label: "开放",
					state:"success"
				}]
			}
		}

		getColumns() {
			return [
				{
				key: "floor",
				width: 160,
				format: {
					template: "<span style='vertical-align: middle;'>#floor#层</span>",
					names: ["floor"]
				},

			},
			]
		}

		add(id) {
			super.doAdd(this.name)
		}
		update(id) {
			super.doUpdate(id, this.name)
		}
		del(ids) {
			super.doDel(areaDel({
				ids: ids
			}), () => {
				super.doGetList(getBuidlingList())
			})
		}
	}
