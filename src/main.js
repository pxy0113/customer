import Vue from "vue";
import App from "./App.vue";
import { router } from './router'
import store from "./store";
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import '../public/js/global.js'
import xwTable from 'xw-table';
import lottie from 'vue-lottie'
import utils from './assets/util.js';
Vue.prototype.$utils = utils;//加密

Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(xwTable);
Vue.component('lottie',lottie)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
global.getLocalTime = (nS) => {//时间戳转字符到日期
	return new Date(parseInt(nS) * 1000).toLocaleString().replace(/\//g, "-").replace(/[上午|下午]([\d\:]*)/g, "");
}

global.getTimeMinute = (nS) => {//时间戳转字符到分
	return new Date(parseInt(nS) * 1000).toLocaleString('chinese', {hour12: false}).replace(/\//g, "-").replace(/(\:\d*)$/, "");
}
global.isEmpty = (obj) => {			//判断字符是否为空的方法
	if(typeof obj == "undefined" || obj == null || obj == "" || (obj.length>0 && obj.trim().length == 0)){
		return true;
	}else{
		return false;
	}
}
global.filterObj = (arr) => { //过滤为空的参数不传递
	let objAr = {};
	for (let i in arr) {
		let k = i;
		let value = arr[i];
		if (value instanceof Object || value instanceof Array) {
			if (value.length !== 0) {
				objAr[k] = value;
			}
		} else {
			if (!isEmpty(value)) {
				objAr[k] = value;
			}
		}
	}
	return objAr;
}
global.DataType = (tgt,type) =>{//判断类型
	const dataType = Object.prototype.toString.call(tgt).replace(/\[object /g, "").replace(/\]/g, "").toLowerCase();
    return type ? dataType === type : dataType;
}
global.isFull = (data) => { //判断是否是空的
	 if(DataType(data, "object")){//是对象
		 if(!Object.keys(data).length){
			 return true;
		 }else{
			 return false;
		 }	 
	 }else if(DataType(data, "array")){
		 if(Array.isArray(data)&&!data.length){
			 return true;
		 }else{
			return false;
		 }
	 }else 	if(typeof obj == "undefined" || obj == null || obj == "" || (obj.length>0 && obj.trim().length == 0)){
		return true;
	}else{
		return false;
	}
}
global.objRemove = (arr) => { //对象数组的去重
	let obj = {};				 
	arr = arr.reduce((cur, next) => {
		obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
		return cur;
	}, []);
	return arr;
}
global.strLen = (str) =>{ //判断字符串长度
    let len = 0;    
    for (let i=0; i<str.length; i++) {    
        if (str.charCodeAt(i)>127 || str.charCodeAt(i)==94) {    
             len += 2;    
         } else {    
             len ++;    
         }    
     }    
    return len;    

}
//数组去重    	let arr = [1,2,2,3,3,4,4,5,5];let array = new Set(arr);let newArr = Array.from(array);
//Math.round(new Date(this.prize.sign_end_time) / 1000) //日期转时间戳
//let parentArr = newArr.filter(l => l.fid == 0)  //过滤
global.transfer = (text) => { //字符的转义
      var s = ""; 
        if (text.length == 0) return ""; 
        s = text.replace(/&amp;/g, "&"); 
        s = s.replace(/&lt;/g, "<"); 
        s = s.replace(/&gt;/g, ">"); 
        s = s.replace(/&nbsp;/g, " "); 
        s = s.replace(/&#39;/g, "\'"); 
        s = s.replace(/&quot;/g, "\""); 
        s = s.replace(/<br\/>/g, "\n"); 
        return s; 
}

/* 数字转整数 如 100000 转为10万
         * @param {需要转化的数} num 
         * @param {需要保留的小数位数} point 
        */
		global.tranNumber = (num, point) => {
			let integer = parseInt(num);
            let numStr = integer.toString();
            if (numStr.length < 6) {//十万以内直接返回 
                return numStr + '元';
            }else if (numStr.length > 8) { //大于8位数是亿
                let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point);
                return parseFloat(parseInt(integer / 100000000) + '.' + decimal) + '亿';
            }else if (numStr.length > 5) {//大于6位数是十万 (以10W分割 10W以下全部显示)
                let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point)
                return parseFloat(parseInt(integer / 10000) + '.' + decimal) + '万';
            }
    	}
