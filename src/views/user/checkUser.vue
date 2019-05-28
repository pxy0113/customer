<template>
	
	<div>
		<Button type="primary" @click="accessModal = true">新建角色</Button>
		<br>
		<xw-table :tableColumns="userColumns" 
		:tableData="userList"
		:seekShow="false"
		:pageShow="false"
		@on-btn-click="tableBtnClick">
		</xw-table>
		<Drawer  title="角色列表" v-model="showDrawer" :width="800" @on-close="closeDrawer">
			<list-view ref="listV"></list-view>
		</Drawer>
		<Modal v-model="accessModal" title="编辑" :width="400" footer-hide :mask-closable="false"
		@on-cancel="cancelAdd">
			<Input placeholder="请输入角色名" style="width: 300px;padding: 10px 0;" v-model="editUser.rolename" />
			<Alert type="error" show-icon v-if="error!==''" style="max-width: 300px;">{{error}}</Alert>
			<h3>设置权限：</h3>
				<div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
			    <Checkbox
			        :indeterminate="indeterminate"
			        :value="checkAll"
			        @click.prevent.native="handleCheckAll">全选</Checkbox>
				</div>
				<CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox label="1">审核资源</Checkbox>
					<Checkbox label="2">审核资讯</Checkbox>
					<Checkbox label="3">政府账号审核</Checkbox>
				</CheckboxGroup>
				<p><Button type="primary" @click="postEditAccess">提交</Button></p>
		</Modal>
	</div>
	
</template>

<script>
import listView from '@/components/listView.vue'
export default {
	name: 'checkUser',
	components: {//组件模板
		listView
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
			editUser:{},
			indeterminate: true,
			checkAll: false,
			checkAllGroup: [],
			accessModal:false,//权限编辑对话框
			showDrawer:false,//角色列表抽屉
			error:'',
			userList:[],//角色列表
			userColumns:[
				{
					title:'id',
					width:150,
					align:'center',
					render: (h, params) => {
						return h('span', params.row.id)
					}
				},
				{
					title:'角色',
					width:300,
					align:'center',
					render: (h, params) => {
						return h('span', params.row.rolename)
					}
				},
				{
					title:'权限',
					width:200,
					align:'center',
					render: (h, params) => {
						let permission = params.row.permission;
						let arr = [
							// h('Tag',{
							// 	props: {
							// 		color:'blue'
							// 	}
							// },'编辑')
						];
						if(permission.length>0){
							permission.forEach( a=>{
								if(a==1){
									arr.push(h('Tag',{
										props: {
											color:'skyblue'
										}
									},'资源'));
								}else if(a ==2){
									arr.push(h('Tag',{
										props: {
											color:'#19be6b'
										}
									},'资讯'));
								}else if(a==3){
									arr.push(h('Tag',{
										props: {
											color:'#ff9900'
										}
									},'账号'));
								}
								
							});
							return h('div', arr);
						}else{
							return h('span', '暂无');
						}
						
					}
				},
				{
					title:'操作',
					align:'center',
					handle: [
						{
							name:'删除',
							key:'del'
						},
						{
							name:'编辑',
							key:'accessEdit'
						},
						{
							name:'成员列表',
							key:'list'
						}
					],
				},
			]
        }
    },
    methods: {//方法
		getAllUser(){		
			$ax.getAjaxData('/ucenter/Rolemanage/all', {}, res => {
				if(res.code == 0){
					this.userList = res.data;
				}else{
					this.$Message.error(res.msg);
				}
			});
		},
		tableBtnClick(val){
			if(val.key == 'list'){
				this.$refs.listV.id= val.params.row.id;
				this.$refs.listV.getRoleUser();
				this.showDrawer = true;
			};
			if(val.key == 'accessEdit'){
				this.accessModal = true;
				this.editUser=JSON.parse(JSON.stringify(val.params.row)); //解决vue A对象赋值给B对象,修改B属性会影响到A的问题
				this.checkAllGroup = val.params.row.permission;
			};
			if(val.key == 'del'){
				this.delUser(val.params.row.id);
			}
		},
		handleCheckAll () {
			if (this.indeterminate) {
				this.checkAll = false;
			} else {
				this.checkAll = !this.checkAll;
			}
			this.indeterminate = false;
	
			if (this.checkAll) {
				this.checkAllGroup = ['1', '2', '3'];
			} else {
				this.checkAllGroup = [];
			}
		},
		checkAllGroupChange (data) {
			if (data.length === 3) {
				this.indeterminate = false;
				this.checkAll = true;
			} else if (data.length > 0) {
				this.indeterminate = true;
				this.checkAll = false;
			} else {
				this.indeterminate = false;
				this.checkAll = false;
			}
		},
		postEditAccess(){
			if(isEmpty(this.editUser.rolename)){
				this.error = '不可为空！';
			}else{
				let arr = [];
				this.checkAllGroup.forEach(item =>{
					arr.push(item);
				});
				let list = {
					rolename:this.editUser.rolename,
					id:this.editUser.id?this.editUser.id:null,
					permission:arr
				}
				$ax.getAjaxQsStringify('/ucenter/Rolemanage/addRole', filterObj(list), res => {
					if(res.code == 0){
						this.$Message.success('成功!');
						this.cancelAdd();
						this.getAllUser();
					}else{
						this.$Message.error(res.msg);
					}
				});
			}
			
		},
		cancelAdd(){
			this.accessModal = false;
			this.editUser = {};
			this.error = '';
			this.checkAllGroup = [];
		},
		delUser(id){
			this.$Modal.confirm({
				title: '删除角色',
				content: '<p>确定要删除吗？此操作无法撤销</p>',
				onOk: () => {
					$ax.getAjaxData('/ucenter/Rolemanage/delRole', {id:id}, res => {
						if(res.code == 0){
							this.$Message.success('删除成功!');
							this.userList.forEach((item,index) =>{
								if(item.id == id){
									this.userList.splice(index,1);
								}
							});
						}else{
							this.$Message.error(res.msg);
						}
					});
				}
			});
			
		},
		closeDrawer(){ //关闭抽屉的时候把抽屉里的数据清空
			this.$refs.listV.clearData();
		},
    },
    computed: {//计算属性

    },
    watch: {//监测数据变化
    	
	},
    
    //===================组件钩子===========================
    
    created () {//实例被创建完毕之后执行
    	
	},
    mounted () {//模板被渲染完毕之后执行
    	this.getAllUser();
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

</style>
