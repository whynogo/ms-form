### 评价 列表

评价列表组件，组件名：``uni-evaluate``，可预览图片

**使用方式：**

下载组件，在 ``script`` 中引用组件 

```javascript
import timeSelector from '@/components/xiujun-time-selector/index.vue';
export default {
    components: {timeSelector}
}
```

用法

```html
<time-selector @selectTime="selectTimeEvent" endTime="结束时间" selectedTabColor="tab选中的颜色" selectedItemColor="时间选中的颜色"></time-selector>
```

**组件属性说明：**	

|属性名|类型|默认值	|说明|
|---|----|---|---|
|startTime|String|08:00|开始时间选项|
|endTime|String|18:00|结束时间选项|
|timeInterval|Number,String|0.5|时间间隔，0.5表示半小时，1表示1小时|
|advanceTime|Number|0|提前预约时间,2表示提前2小时预约|
|timeSlot|Number|2|选中的时间段(08:00-10:00)|
|selectedTabColor|String| #0092D5 |选中的tab颜色|
|selectedItemColor|String|#0094D7|选中的时间颜色|
|disableText|String|约满|禁用时显示的文本|

**事件说明：**

|事件|类型|获取到值|
|---|----|---|
|@selectTime| event |可获取当前点击的时间|

