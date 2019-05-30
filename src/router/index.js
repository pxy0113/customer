import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index';
import routers from './router.js'; //调用路由表
import { checkRouter} from '@/toolBox'; //调用工具
import Utils from '@/assets/util.js'
Vue.use(Router);

//过滤掉没权限的路由



export const router = new Router({
	routes: routers,
	scrollBehavior (to, from, savedPosition) { //每次路由跳转都会回到顶部
		return new Promise((resolve, reject) => {
		  setTimeout(() => {
			resolve({ x: 0, y: 0 })
		  }, 0)
		})
	  }
});
router.beforeEach((to, from, next) => {//会在任意路由跳转前执行，next一定要记着执行，不然路由不能跳转了
	 router.app.$Loading.start();//加载进度条
	//检测用户中心登录
	if(!sessionStorage.login && to.name !== 'mainLogin'){//用户中心未登录
			next({
				replace:true,
				name:'mainLogin'
			});
		}else if(sessionStorage.login){
			let acc = Utils.decrypt(sessionStorage.login,window._HOST.KEY_STR);
			let fil = checkRouter(routers,acc);//调用方法获得有权限的路由
			store.commit('saveRouters',fil);
			if(to.meta.access){
				let is = false;
				JSON.parse(acc).forEach(item =>{
					to.meta.access.forEach(acs =>{
						if(acs == item)is = true;
					})
				});
				if(is){
					store.commit('setMenu',to.path);
					next();
				}else{ //权限不符合
					router.app.$Loading.finish();//加载进度条
					store.commit('setMenu',from.path);
					next({
						replace: true,
						name: 'error-401'
					});
				}
			}else{
				next();
			}
		}else{		
			next();
		}

	
});

router.afterEach((to, from) => {//会在任意路由跳转后执行
	 router.app.$Loading.finish();//加载进度条
});