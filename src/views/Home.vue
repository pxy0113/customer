<template>
	<div style="height: 100%;">
		<Layout style="height: 100%;">
			<!--头部菜单-->
			<Header class="layout-header-bar">
				<Menu mode="horizontal" theme="dark" active-name="1">
					<div class="layout-logo">商会系统客服后台</div>
					<div class="layout-nav">
						<MenuItem :name="index" v-for="(item, index) in routerGroup" 
						@click.native.stop="clickMenu(item)"
						:class="[currentR == item.name? 'curR' : '']">
							<Icon :type="item.meta.icon"></Icon>
							{{ item.meta.title }}
						</MenuItem>
					</div>
					<div style="float: right;margin-right: 10px;"><Button @click="exit">退出登陆</Button></div>
				</Menu>
			</Header>
			<!--头部菜单-->

			<!--下侧-->
			<Layout style="overflow: hidden;height: 900px;">
				<!--菜单-->
				<Sider ref="siderInstance" hide-trigger collapsible :collapsed-width="64" 
				style="height: 100%;position: relative;background: #FFFFFF;">
					<div>
						<div v-for="(menu, index) in menuList" :name="menu.path" 
						:class="[activeName == menu.path ? 'act' : '', 'normalItem']"
						 @click="toR(menu.path)">
							{{ menu.name }}
						</div>
					</div>
					<div style="position:absolute;bottom: 20px;width: 100%;padding: 10px;">
						<p style="font-size: 12px;">客服电话:07712864221</p>
						<p style="margin-top: 6px;">Copyright © 广西南宁八阵图科技有限公司</p>
					</div>
				</Sider>
				<!--菜单-->

				<!--内容-->
				<Content style="position: relative;">
					<div class="main-content-box"><router-view /></div>
				</Content>
				<!--内容-->
			</Layout>
			<!--下侧-->
		</Layout>
	</div>
</template>

<script>
export default {
	name: 'Home',
	components: {
		//组件模板
	},
	props: {
		//组件道具（参数）
		/* ****属性用法*****
		 *
		 * 传递类型 type: Array | Number | String | Object
		 * 为必传 required: true
		 * 默认值 default: ''
		 *
		 */
	},
	data() {
		//数据
		return {
			access:'admin',
			currentR: '',
			activeName: ''
			// menuList:[],
		};
	},
	methods: {
		//方法
		toR(type) {
			this.activeName = type;
			this.$router.push({ name: type });
		},
		clickMenu(data) {
			let rt = this.routerGroup.filter(i =>i.name == data.name);
			this.$router.push({ name: rt[0].children[0].name});
		},
		exit(){
			$ax.getAjaxData('/ucenter/Login/logout',{}, (res) =>{
				if(res.code == 0){
					sessionStorage.clear();
					this.$router.replace({
						name:'mainLogin'
					});
				}else{
					this.$Message.error(res.msg);
				}
			});
		}
	},
	computed: {
		//计算属性
		menuList() {
			return this.$store.state.menuList;
		},
		routerGroup(){
			return this.$store.state.routersList;
		}
	},
	watch: {
		//监测数据变化
		$route(to, from) {
			this.activeName = this.$route.name;
			let path = this.$route.path.substr(1).split('/');
			this.currentR = path[0] == 'checkInfo'?'home':path[0];
		}
	},

	//===================组件钩子===========================

	created() {
		//实例被创建完毕之后执行
	},
	mounted() {
		//模板被渲染完毕之后执行
		this.activeName = this.$route.name;
		let path = this.$route.path.substr(1).split('/');
		this.currentR = path[0] == 'checkInfo'?'home':path[0];
		
	}
};
</script>
<style>
.layout-logo {
	color: white;
	font-weight: 700;
	font-size: 20px;
	border-radius: 3px;
	float: left;
	position: relative;
	left: 10px;
	margin: 0 30px 0 10px;
}
.layout {
	background: #f5f7f9;
	position: relative;
	overflow: hidden;
	height: 100vh;
}
.layout-nav {
	width: 900px;
	margin: 0 auto;
	margin-left: 20px;
}
/* .layout {
		background: #f5f7f9;
		position: relative;
		overflow: hidden;
		height: 100vh;
	} */
.layout-header-bar {
	position: relative;
	padding: 0 !important;
	height: auto !important;
	line-height: initial !important;
	background: #515a6e;
}
.main-content-box {
	width: 100%;
	height: 100%;
	padding: 30px 20px 300px;
	box-sizing: border-box;
	overflow: auto;
	position: absolute;
	top: 0;
	left: 0;
}
.rotate-icon {
	transform: rotate(-180deg);
}
.act {
	background: #f0faff;
	/* border-right: 2px solid #2d8cf0 !important; */
}
.normalItem {
	height: 50px;
	font-size: 14px;
	text-align: left;
	padding: 10px 3px;
	display: block;
	outline: 0;
	list-style: none;
	padding: 14px 24px;
	position: relative;
	cursor: pointer;
	z-index: 1;
	transition: all 0.2s ease-in-out;
}
.curR {
	background: #2d8cf0;
}
</style>
