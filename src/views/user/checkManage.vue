<template>
	
	<div>
		<Button type="primary" @click="show('add')">添加审核信息</Button>
		<xw-table :tableColumns="columns" 
		:tableData="refuseList"
		:seekShow="false"
		:pageShow="false"
		@on-btn-click="tableBtnClick"
		@on-editRow-save="editRefuse">
		</xw-table>
		<Modal v-model="modalShow" title="审核信息" footer-hide @on-cancel="clearItem">
			<Form :model="formItem" :label-width="80">
				<FormItem label="类型">
					<RadioGroup v-model="formItem.type">
						<Radio label="no">拒绝</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="场景">
					<RadioGroup v-model="formItem.place">
						<Radio label="1">资源管理</Radio>
						<Radio label="2">资讯管理</Radio>
						<Radio label="3">政府账户</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="描述">
					<textarea v-model="formItem.desc" cols="30" rows="4"></textarea>
				</FormItem>
				<Alert type="error" show-icon v-if="error!==''">{{error}}</Alert>
				<FormItem>
					<Button type="primary" @click="addAudit">提交</Button>
				</FormItem>
			</Form>
			
		</Modal>
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
			error:'',
			formItem:{
				desc:'',
				type:'no',
				place:'1'
			},
			modalShow:false,
			refuseList:[],
        	columns:[
				{
					title:'id',
					width:100,
					align:'center',
					key:'id'
				},
				{
					title:'类型',
					width:100,
					align:'center',
					render: (h, params) => {
						if(params.row.type == 1){
							return h('span',{
								style:{
									color:'green'
								}
							}, '资源')
						}else if(params.row.type ==2){
							return h('span',{
								style:{
									color:'orange'
								}
							}, '资讯')
						}else if(params.row.type ==3){
							return h('span',{
								style:{
									color:'blue'
								}
							}, '账户')
						}
						
					}
				},
				{
					title:'描述',
					align:'center',
					editable:true,
					key:'info'
				},
				{
					title:'操作',
					width:300,
					align:'center',
					handle:[
						{
							name:'编辑',
							key:'edit',
							rowEdit:true,
							editKeyArr:['id','info']
						},
						{
							name:'删除',
							key:'del'
						},
					]
				}
			]
        }
    },
    methods: {//方法
    	tableBtnClick(val){
			if(val.key == 'del'){
				this.$Modal.confirm({
                    title: '删除',
                    content: '<p>确定删除该原因吗？</p>',
                    onOk: () => {
                        this.delRefuse(val.params.row.id,val.params.index);
                    }
                });
				
			};
		},
		editRefuse(editSuccData){ //组件没办法确定为空时不给提交 只能自己判断 为空时显示session session在每次改变refuse都更新的
			if(!isEmpty(editSuccData.info)){
				$ax.getAjaxData('/ucenter/Rolemanage/editRefuse', editSuccData, res => {
					if(res.code == 0){
						this.$Message.success('编辑成功！');		
						this.refuseList.forEach(item =>{
							if(item.id == editSuccData.id){
								this.$set(item,'info',editSuccData.info)
							}
						});
					}else{
						this.$Message.error(res.msg);
					}
				});
			}else{
				 this.refuseList = this.$store.state.refuseList;
			}
		},
		delRefuse(id,index){		
			$ax.getAjaxData('/ucenter/Rolemanage/delRefues', {id:id}, res => {
				if(res.code == 0){
					this.$Message.success('删除成功！');
					this.refuseList.splice(index,1);
				}else{
					this.$Message.error(res.msg);
				}
			});
		},
		getRefuseList(){
			$ax.getAjaxData('/ucenter/Rolemanage/refuesList', {}, res => {
				if(res.code == 0){
					this.refuseList = res.data;
				}else{
					this.$Message.error(res.msg);
				}
			});
		},
		addAudit(){
			if(!isEmpty(this.formItem.desc)){
				let refuse = {
					type:this.formItem.place,
					info:this.formItem.desc
				}
				$ax.getAjaxData('/ucenter/Rolemanage/addRefuse', refuse, res => {
					if(res.code == 0){
						this.$Message.success('添加成功！');
						this.getRefuseList();
						this.modalShow = false;
					}else{
						this.$Message.error(res.msg);
					}
				});
			}
		},
		show(type){
			if(type == 'add'){
				this.modalShow = true;
			}
		},
		clearItem(){
			this.formItem = {
				desc:'',
				type:'no',
				place:'1'
			}
		}
    },
    computed: {//计算属性
        	
    },
    watch: {//监测数据变化
		 refuseList: {
			handler:function (newValue) {
				this.$store.state.refuseList = newValue;
			},
			deep: true
        }
	},
    
    //===================组件钩子===========================
    
    created () {//实例被创建完毕之后执行
    	
	},
    mounted () {//模板被渲染完毕之后执行
    	this.getRefuseList();
		
		$ax.getAjaxData('https://api.comments.hk/', {}, res => {
			console.log(res)
		});
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
