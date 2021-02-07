
let Fly = require("flyio/dist/npm/wx")
let fly = new Fly
import {cache} from "@/common/cache.js"
import {CONFIG} from "@/common/config.js"
//设置超时
fly.config.timeout = 10000;




//设置请求基地址
fly.config.baseURL = CONFIG.HTTP_BASE_URL;

// 添加请求拦截器
fly.interceptors.request.use((request) => {
    // 给所有请求添加自定义header，带上token信息让服务器验证用户登陆
	let token = null!=cache('setUserInfo')?cache('setUserInfo').token:null;
	request.headers = {
		      'content-type': 'application/json',
		      'token': token,
			  'customer':CONFIG.customer_code
		    }
	//console.log("0------>set token=",token,request.url)
    // 在当前页面显示导航条加载动画
    uni.showNavigationBarLoading();
    return request;
}, function(error) {
    // 对请求错误做些什么
	//console.log("0.0------>err=",error)
    return Promise.reject(error)
})
// 添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
    (response) => {
		  //console.log("------>raw response",response)
		  if (response.status ===200 && response.data.code === 105 ) {
			// to re-login
			//console.log("1------>clear token",response)
			uni.setStorageSync('setUserInfo',null);
			uni.showToast({
				title:"您还没有登录",
				icon: 'none',
			});		
			//alert("232")
			setTimeout(function(){
				 uni.redirectTo({
				    url: "/pages/login/login"
				 });
			},1500)

			// uni.redirectTo({
			//    url: "/pages/login/login"
			// });
		  }
		  
	
		//这里提示后台返回的错误，其它地方不用处理
        if (response.status ===200 && response.data.code !== 0 ) {
            uni.showToast({
                title: response.data.message,
                icon: 'none',
            });
        }
        uni.hideNavigationBarLoading()
        return response.data; //请求成功之后将返回值返回
    },
    (err) => {
        // 在当前页面隐藏导航条加载动画
        uni.hideNavigationBarLoading()

        if (err.status === 0) {
            uni.showToast({
                title: '网络请求延时',
                icon: "none",
            });
            return Promise.reject(err);
        }
        let code = err.status;
		if (code === 401) {
			uni.navigateTo({
				url: "/pages/mine/login?interceptors=1"
			});
			return Promise.reject(err);
		} else if (code === 403) {
			uni.showToast({
			    title: '没有权限',
			    icon: "none",
			});
			return Promise.reject(err);
		} else {
            uni.showToast({
                title: err.message,
                icon: "none",
            });
            return Promise.reject(err);
        }
    }
)
export default fly;