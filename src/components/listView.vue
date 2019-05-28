<template>
	
	<div>
		<p style="text-align: right;padding-bottom: 10px;">
			<Button @click="add=true" type="primary">添加成员</Button>
		</p>
		<Card dis-hover v-if="add">
				<Icon type="md-close" size="20" @click.native.stop="add= false"
				style="color: brown;margin-top: -20px;" 
				slot="extra"/>
				<br>
				<Input v-model="keyword" placeholder="请输入手机号码" style="width: 200px;"  search enter-button @on-search="selectUserList" />
				<div class="choiceStyle">
					<xw-table :tableColumns="personColumns" 
					:tableData="personList"
					:seekShow="false"
					:pageShow="false">
					</xw-table>
				</div>
				
		</Card>

		<xw-table :tableColumns="userColumns" 
		:tableData="userList"
		:seekShow="false"
		:pageShow="false"
		@on-btn-click="tableBtnClick">
		</xw-table>
	</div>
	
</template>

<script>

export default {
	name: '',
	components:{//组件模板
	},
	props:{//组件道具（参数）
		/* ****属性用法*****
		 * 
		 * 传递类型 type: Array | Number | String | Object
		 * 为必传 required: true
		 * 默认值 default: ''
		 * 
		 */
	},
    data () {//数据
        return {
			id:null,
			keyword:'',
			personList:[],//用户列表
			add:false,
        	userList:[],//角色列表
			personColumns:[
				{
					title:'id',
					align:'center',
					key:'id'
				},{
					title:'姓名',
					align:'center',
					render: (h, params) => {
						return h('span', params.row.name)
					}
				},{
					title:'电话',
					align:'center',
					key:'mobile'
				},{
					title:'操作',
					align:'center',
					render: (h, params) => {
						return h('div', [
							h('icon', {
								props: {
									type: 'md-add',
									size:'18'
								},
								style: {
									marginRight: '5px',
									background: '#ed4014',
									color: 'white'
								},
								on: {
									click: () => {
										this.addRoleUser(params.row);
									}
								}
							}, '添加')
						]);
						
					}
				}
			],
			userColumns:[
				{
					title:'id',
					align:'center',
					key:'id'
				},
				{
					title:'姓名',
					align:'center',
					render: (h, params) => {
						return h('span', params.row.user_info.name)
					}
				},
				{
					title:'添加时间',
					align:'center',
					render: (h, params) => {
						return h('span', this.getLocalTime(params.row.addtime))
					}
				},
				{
					title:'操作',
					align:'center',
					handle:[
						{
							name:'删除',
							key:'del'
						}
					]
				}
			]
        }
    },
    methods: {//方法
    	init(){
			console.log('list')
		},
		clearData(){
			this.id = null;
			this.userList = [];
			this.keyword = '';
			this.personList = [];
			this.add = false;
		},
		addRoleUser(data){//给角色添加人
			let list = {
				role_id:this.id,
				uid:data.id
			}
			$ax.getAjaxData('/ucenter/Rolemanage/addRoleUser', list, res => {
				if(res.code == 0){
					this.$Message.success('添加成功！');
					this.getRoleUser();
				}else{
					this.$Message.error(res.msg);
				}
			});
		},
		selectUserList(){		
			if(!isEmpty(this.keyword)){
				$ax.getAjaxData('/ucenter/Helper/userList', {keyword:this.keyword}, res => {
					if(res.code == 0){
						this.personList = res.data;
					}else{
						this.$Message.error(res.msg);
					}
				});
			}else{
				this.personList = [];
			}
		},
		tableBtnClick(val){
			if(val.key == 'del'){
				this.delRoleUser(val.params.row);
			}
		},
		delRoleUser(list){//删除角色的用户		
			$ax.getAjaxData('/ucenter/Rolemanage/delRoleUser', {id:list.id}, res => {
				if(res.code == 0){
					this.userList = this.userList.filter(l => l.id !== list.id); 
				}else{
					this.$Message.error(res.msg);
				}
			});
		},
		getRoleUser(){			
			if(!isEmpty(this.id)){
				$ax.getAjaxData('/ucenter/Rolemanage/allUser', {role_id:this.id}, res => {
					if(res.code == 0){
						this.userList = res.data;
					}else{
						this.$Message.error(res.msg);
					}
				});
			}
		},
		getLocalTime(time){
			return getLocalTime(time);
		}
    },
    computed: {//计算属性
        	
    },
    watch: {//监测数据变化

	},
    
    //===================组件钩子===========================
    
    created () {//实例被创建完毕之后执行
    	
	},
    mounted () {//模板被渲染完毕之后执行
    	
	},
	destroyed(){//Vue 实例销毁后调用
		
	},
	//=================组件路由勾子==============================
	
	beforeRouteEnter (to, from, next) {//在组件创建之前调用（放置页面加载时请求的Ajax）
		
		(async() => {//执行异步函数
			
			//async、await错误处理
			try {
				
				/*
				 * 
				 * ------串行执行---------
				 * console.log(await getAjaxData());
				 * ...
				 * 
				 * ---------并行：将多个promise直接发起请求（先执行async所在函数），然后再进行await操作。（执行效率高、快）----------
				 * let abc = getAjaxData();//先执行promise函数
				 * ...
				 * console.log(await abc);
				 * ...
				*/
				next(vm => {
					
				});
				
			} catch(err) {
				console.log(err);
				next();
			}
			
			next();
			
		})();
		
	},
	
}
</script>

<style scoped lang="less">
	.choiceStyle{
		height: 200px;
		overflow:auto;
		overflow-x:hidden;
	}
</style>
