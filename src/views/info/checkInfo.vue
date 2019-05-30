<template>
	
	<Card dis-hover style="width: 80%;">
		<check-view :selectList="list" :infoColumns="infoColumns" ref="checkV" @editCancel="editCancel">
			<div slot="info">
				<drawer-com @editSuccess="editOk" ref="tt"></drawer-com>
			</div>
		</check-view>
	</Card>
	
</template>

<script>
import drawerCom from '@/components/drawerCom.vue'
import checkView from '@/components/checkView.vue'
import { mapActions } from 'vuex';
export default {
	name: 'checkInfo',
	components:{//组件模板
		checkView,
		drawerCom
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
				type:2,
				title:''
			},
			infoColumns:[{
				title:'id',
				width:100,
				align:'center',
				key:'id'
			},{
				title:'新闻标题',
				align:'center',
				render: (h, params) => {
					return h('span', {
						style:{
							overflow: 'hidden',
							whiteSpace: 'nowrap',
							textOverflow: 'ellipsis'
						}
					},params.row.title)
				}
			},{
				title:'发布时间',
				align:'center',
				width:100,
				render: (h, params) => {
					return h('span', getLocalTime(params.row.addtime))
				}
			},{
				title:'原因',
				align:'center',
				width:200,
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
							res = '-';
						}
						return h('span',{
							style:{
								width:190,
								overflow: 'hidden',
								whiteSpace: 'nowrap',
								textOverflow: 'ellipsis'
							}

						},res);
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
				title:'审核人',
				align:'center',
				width:100,
				render: (h,params) => {
					return h ('span',params.row.audit_info?params.row.audit_info.audit_name:'-')
				}
			},{
				title:'操作',
				align:'center',
				width:200,
				handle: [
					{
						name:'详情',
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
		editCancel(){//子组件是抽屉 抽屉关闭时告诉父组件 把父组件的answer清空
			this.$refs.tt.answer = '';
		}
    },
    computed: {//计算属性
	   answerList(){
		   if(this.$store.state.refuseList.length == 0){
				this.getRefuse();
		   }else{
				let arr =[];
			   this.$store.state.refuseList.forEach(item =>{
					if(item.type == 2){
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
