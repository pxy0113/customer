<template>
	<Card dis-hover style="width: 80%;">
		<check-view :selectList="list" :infoColumns="infoColumns" ref="checkV">
			<div slot="info">
				<look-account @editSuccess="editOk" ref="tt"></look-account>
			</div>
		</check-view>
	</Card>
</template>

<script>
import lookAccount from '@/components/lookAccount.vue'
import checkView from '@/components/checkView.vue'
import { mapActions } from 'vuex';
export default {
	name: '',
	components:{//组件模板
		lookAccount,
		checkView
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
        	list:{
        		result:0,
        		type:3,
        		title:''
        	},
			infoColumns:[{
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
				title:'单位',
				align:'center',
				render: (h,params) => {
					return h('span',params.row.department)
				}
			},{
				title:'职务',
				align:'center',
				render: (h,params) => {
					return h('span',params.row.zw)
				}
			},{
				title:'状态',
				align:'center',
				render: (h, params) => {
					if(params.row.status == 0){
						return h('span',{
							style:{
								color:'orange'
							}
						} ,'待处理')
					}else{
						return h('span',{
							style:{
								color:params.row.status==1?'green':'red'
							}
						} ,params.row.status==1?'通过':'被拒')
					}
				}
			},{	
				title:'原因',
				align:'center',
				width:300,
				render: (h, params) => {
						let list = params.row;
						let res = '';
						if(list.audit_info){
							if(list.audit_info.info == 0){
								res = '-';
							}else{
								this.answerList.forEach(item =>{
									if(item.id == list.audit_info.info){
										res = item.info;
									}
								});
							}
							
						}else{
							res = '未处理';
						}
						return h('span',res);
				}

			},{
				title:'审核时间',
				align:'center',
				width:100,
				render: (h, params) => {
					return h('span',{
						style:{
							color:'red'
						}
					}, params.row.audit_info?getLocalTime(params.row.audit_info.addtime):'未审核')
				}
			},{
				title:'操作',
				align:'center',
				handle: [
					{
						name:'查看',
						key:'details'
					}
				],
			}],
        }
    },
    methods: {//方法
		...mapActions([
			'getRefuse'
		]),
    	editOk(){
    		this.$refs.checkV.showDrawer= false;
    		this.$refs.checkV.getDataList();
    	},
    },
    computed: {//计算属性
         answerList(){
		   if(this.$store.state.refuseList.length == 0){
				this.getRefuse();
		   }else{
				let arr =[];
			   this.$store.state.refuseList.forEach(item =>{
					if(item.type == 3){
						arr.push(item)
					}
				});
				return arr;
		   }
         } 	
    },
    watch: {//监测数据变化
    	
	},
    
    //===================组件钩子===========================
    
    created () {//实例被创建完毕之后执行
    	
	},
    mounted () {//模板被渲染完毕之后执行
    	if(this.$store.state.refuseList.length == 0){
    		this.getRefuse();
    	}
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
