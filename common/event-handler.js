	/**
	 * 一个处理时间冲突的类，根据时间到来的实际过滤低优先级的事件
	 * 注意input传入的优先级不能>99
	 */
	export class EventHandler{
		constructor(args) {
		    this.level=99
			this.timestamp=+new Date()
		}	
		
		input(level){
			const timestamp = +new Date();
			if(timestamp-this.timestamp>200)
				this.level=99
			
			if((level<=this.level)&&(timestamp-this.timestamp>200)){
				this.timestamp=timestamp			
				this.level=level
				return true
			}
			return false
		}
	}