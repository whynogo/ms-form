var _DEBUG_LOCAL=false
var _DEBUG_LOCAL=true


const fileHost = "https://miao-share.oss-cn-shenzhen.aliyuncs.com";//你的oss地址
const config = {
  //aliyun OSS config
  uploadImageUrl: `${fileHost}`,
  OSSAccessKeyId: "LTAI4Fdh7DNT8372sNj5jmjt",//登录oss控制台查看
  AccessKeySecret: "自己换",//登录oss控制台查看
  timeout: 87600
};

const LOCAL_CONFIG = {
	customer_code:"466dfee41299324600fb5cbc0f9ce0ae",
	ossConfig:{
	  //aliyun OSS config
	  uploadImageUrl: `${fileHost}`,
	  OSSAccessKeyId: "LTAI4Fdh7DNT8372sNj5jmjt",//登录oss控制台查看
	  AccessKeySecret: "自己换",//登录oss控制台查看
	  timeout: 87600,
	},
	HTTP_BASE_URL:'http://127.0.0.1:81/api',
	WX_BASE_URL:'http://127.0.0.1:81/app',
};

const PROD_CONFIG = {
	customer_code:"466dfee41299324600fb5cbc0f9ce0ae",
	ossConfig:{
	  //aliyun OSS config
	  uploadImageUrl: `${fileHost}`,
	  OSSAccessKeyId: "LTAI4Fdh7DNT8372sNj5jmjt",//登录oss控制台查看
	  AccessKeySecret: "自己换",//登录oss控制台查看
	  timeout: 87600,
	},
	HTTP_BASE_URL:'https://api.askxyz.top/api',
	WX_BASE_URL:'https://api.askxyz.top/app',
};

var CONFIG=_DEBUG_LOCAL?LOCAL_CONFIG:PROD_CONFIG

module.exports = {
	_DEBUG_LOCAL,
	CONFIG
}