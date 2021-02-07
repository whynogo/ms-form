### AnTextAreaTip 文本域提示

> 引入组件：

```
import anTextAreaTip from '@/components/an-textarea-tip/an-textarea-tip'

export default {
	components:{
		anTextAreaTip
	},
}
```

> 使用组件

```
<an-text-area-tip title="标题来了" lineColor="#f00" titleBgColor="#f00" color="#fff">
	<text style="color: #cb0000">1、上来看对方接受了快递费在季度付快递费都if降低偶比较信息\n</text>
	<text>2、如大口大口福晶科技地方前完成\n</text>
	<text>3、如有其它疑问请阅读《你的须知》</text>
</an-text-area-tip>

//哪里使用放哪里
```

> 属性

属性名 | 类型 | 默认值 | 说明 | 平台差异说明 
-|-|-
title | String | "Andot Warn" | 虚线上的标题 | 无
lineColor | String | "#7C7C7C" | 虚线框颜色 | 无
titleBgColor | String | "#F2F2F2" | 标题背景颜色 | 无

> 提示

titleBgColor: 这个颜色最好是与背景色相同，体验效果会更佳哦