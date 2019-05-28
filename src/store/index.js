import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        //数据
		routersList:[],
		menuList:[],
		refuseList:[]
    },
    mutations: {
        //事件集,mutation是同步的
		saveRouters(state, data) {
		    state.routersList = data;
		},
		getRefuseList(state){
			$ax.getAjaxData('/ucenter/Kf/refuesList', {}, res => {
			    if (res.code == 0) {
					state.refuseList = res.data;
			    } else {
					const vm = new Vue();
					vm.$Message.error(res.msg);
			    }
			});
		},
		setMenu(state,data){
			let list  = data.substr(1);
			let parent = list.split('/');
			parent[0] = parent[0] == 'checkInfo'?'home':parent[0];
				state.routersList.forEach(item =>{
					if(item.name == parent[0]){
						let childrenList = [];
						let data = item.children;
						data.forEach(d =>{
							let obj = {
								name:d.meta.title,
								path:d.name
							}
							childrenList.push(obj);							
						});
						state.menuList = childrenList;
					}
				});
		
		},
    },
    getters: {
        //计算属性
    },
    actions: {
        //专门放置异步交互代码,Action 是异步的
		getRefuse({ commit }) {
			commit('getRefuseList');
		}
    },
    modules: {
        //模板

    },
});
