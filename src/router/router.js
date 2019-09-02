// import Main from '@/views/main/main.vue';


/**
 * meta属性:
 * 
 * @param {Boolean : false} hideMenu 设置不在左侧菜单显示的路由
 * @param {Array} access 设置路由权限[1,2,3...] 或 ['admin','user'...]
 * @param {Boolean : false} showAlways 设置路由永远显示为二级菜单
 * @param {Boolean : false} hideBreadcrumb 设置不显示在面包屑导航中
 * @param {String : '定向到xxx路由的name'} highlightName 点击该路由后在菜单中高亮重定向
 * 
 */
import Main from "@/views/Home.vue";
export default [
	{
		path:'/mainLogin',
		name:'mainLogin',
		meta:{
			title:'登陆',
			hideMenu:true
		},
		component: () => import('@/views/login/mainLogin.vue')
	},
	{
		path: '/',
		name:'home',
	    redirect: '/checkInfo',
	    meta: {//里面的参数用来做各种显示效果的判断（关键字段）
	    	title: '资讯管理',
			access:['news'],
			//url:'checkInfo'
	    },
	    component: Main,
	    children: [
		    {
		    	path: 'checkInfo',
		    	name: 'checkInfo',
	            meta: {
	            	title: '资讯管理',
	            	icon: 'ios-paper',
					access:['news']
			    },
	            component: () => import('@/views/info/checkInfo.vue')
		    }
		]
	},
	{
		path: '/res',
		name: 'res',
		meta:{
			title:'资源管理',
			access:['rs','gov'],
		},
		component: Main,
		children: [
			{
				path: 'checkRes',
				name: 'checkRes',
				meta: {
					title: '资源审核',
					icon: 'ios-more',
					access:['rs']
					
				},
				component: () => import('@/views/res/checkRes.vue')
			},
			{
				path: 'checkAccount',
				name: 'checkAccount',
				meta: {
					title: '账户审核',
					icon: 'ios-more',
					access:['gov']
				},
				component: () => import('@/views/res/checkAccount.vue')
			},
		]
	},
	{
		path: '/user',
		name: 'user',
		meta:{
			title:'系统设置',
			access:['super'],
		},
		component: Main,
		children: [
			{
				path: 'checkUser',
				name: 'checkUser',
				meta: {
					title: '角色管理',
					icon: 'ios-more',
					access:['super']
				},
				component: () => import('@/views/user/checkUser.vue')
			},
			{
				path: 'checkManage',
				name: 'checkManage',
				meta: {
					title: '审核管理',
					icon: 'ios-more',
					access:['super','normal']
				},
				component: () => import('@/views/user/checkManage.vue')
			},
		]
	},
	{	
		path:'/invoice',
		name:'invoice',
		meta:{
			title:'开票列表'
		},
		component: Main,
		children: [
			{
				path: 'invoiceList',
				name: 'invoiceList',
				meta: {
					title: '开票列表',
					icon: 'ios-more'
				},
				component: () => import('@/views/invoice/invoiceList.vue')
			}
		]
	},
	{
	    path: '/401',
	    name: 'error-401',
	    meta: {
	      hideMenu: true,
	    },
	    component: () => import('@/views/error-page/401.vue')
	},
	{
	    path: '/403',
	    name: 'error-403',
	    meta: {
	      hideMenu: true,
	    },
	    component: () => import('@/views/error-page/401.vue')
	},
	{
	    path: '*',
	    name: 'error-404',
	    meta: {
	      hideMenu: true,
	    },
	    component: () => import('@/views/error-page/404.vue')
	}
]