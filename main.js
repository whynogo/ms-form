import Vue from 'vue'
import App from './App'
const Base64 = require("@/common/base64.js").Base64;
  
import uView from "uview-ui";
Vue.use(uView);

import hxNavbar from "./components/hx-navbar/hx-navbar"
Vue.component('hx-navbar',hxNavbar)


const dva = require("@/common/dva.js").dva;
Vue.config.productionTip = false
Vue.prototype.$dva = dva
Vue.prototype.$base64 = Base64
Vue.prototype.$host = 'https://unidemo.dcloud.net.cn/';


App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
