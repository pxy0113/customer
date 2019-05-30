<template>
	
	<div>
		
		<!-- <Row type="flex" :class="[result.length>0?'hasTag':'noTag']" v-if="isNote">
			<Col :span="result.length>0?6:24" @click.stop.native="choice"  
			style="display: flex;justify-content: flex-start;align-items: center;">
				<Button type="primary">选择范围</Button>
			</Col>
			<Col span="18" v-if="result.length !==0">
				<div style="padding: 10px;">
					<Tag style="border: 1px solid skyblue;"  :name="res.id" v-for="(res,index) in result" :key="index" @on-close="closeTag(res,index)">{{res.name}}
					</Tag>
				</div>
			</Col>
		</Row> -->
		<Divider v-if="isNote"></Divider>
		<div style="display: flex;justify-content: flex-start;align-items: center;">
			<Input search enter-button 
			v-model="searchList.title"
			placeholder="关键词-搜索标题" 
			@on-search="searchTitle"
			style="width: 40%;margin-right: 20px;" />  
			<RadioGroup v-model="status" @on-change="changeStatus">
				<Radio label="0">未处理</Radio>
				<Radio label="1">通过</Radio>
				<Radio label="2">拒绝</Radio>
			</RadioGroup>
		</div>
		<xw-table :tableColumns="infoColumns" 
		:tableData="infoList"
		:seekShow="false"
		:pagingData="infoPageData"
		@on-btn-click="tableBtnClick"
		@on-page-change="infoChangePage"
		@on-page-size-change="infoChangePSize">
		</xw-table>
		
		<Drawer v-model="showImport"
		title="请选择商会" :width="800"
		>
			<xw-table :tableColumns="tableColumns" 
			ref="selectCham" 
			:tableData="tableData"
			:pagingData="pagingData"
			@on-page-change="changePage"
			@on-page-size-change="changePageSize"
			@on-search="searchName"
			@select-change="changeSelect">
			</xw-table>
		</Drawer>
		<Drawer slot="modalContent" title="详情" v-model="showDrawer" :width="800" @on-close="close">
			<slot name="info"></slot>
		</Drawer>
	</div>
	
</template>

<script>
import {bus} from '@/assets/bus.js'
export default {
	name: 'checkView',
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
		selectList:{
			type:Object,
			default: () => ({})
		},
		infoColumns:{
			type:Array,
			default: () => []
		}
	},
    data () {//数据
        return {
			isNote:true,//如果父组件是账户审核则false,账户审核不需要选择商会按钮
			showDrawer:false,
			status:'0',
			infoList:[],//审核资讯的列表	
        	result: [],//商会选择的结果
			showImport: false,
			tableData: [],
			tableColumns: [{
					type: 'selection',
					width: 80
				},
				{
					title: 'ID',
					key: 'id'
				},
				{
					title: '名称',
					key: 'name'
				}
			],
			infoPageData:{
				total: 0, current_page: 1, page_size: 10
			},
			pagingData:{
				total: 0, current_page: 1, page_size: 10
			},
			searchWord:'',
        }
    },
    methods: {//方法
		close(){ //关闭抽屉的时候直接清空详情
			bus.dataList = {};
		},
		tableBtnClick(val){
			if(val.key == 'details'){
				this.showDrawer = true;
				let data = Object.assign(val.params.row,{'listType':this.searchList.type});
				bus.$emit('lookDetail',data);
			}
		},
    	choice() { //new
    		this.showImport = true;
    		this.getAllOrg();
    	},
		searchTitle(name){
			this.infoPageData = {
				total: 0, current_page: 1, page_size: 10
			};
			this.getDataList();
		},
		getDataList(){
				let list = {				
					type:this.searchList.type,
					cur_page:this.infoPageData.current_page,
					page_size:this.infoPageData.page_size,
				}
				if(this.searchList.type == 3){
					list.name = this.searchList.title;
				}else{
					list.title = this.searchList.title;
				}
				let post = Object.assign({result:this.searchList.result},filterObj(list));
				$ax.getAjaxData('/ucenter/Kf/auditRSList', post, res => {
					if (res.code == 0) {
						this.infoList = res.data;
						this.infoPageData.total = Number(res.page.total);
					} else {
						this.$Message.error(res.msg)
					}
				});
			
		},
		changeStatus(name){
			this.searchList.result = name;
			this.infoPageData.current_page = 1;
			this.getDataList();
		},
		getAllOrg() {
			// this.chamType = '';
			let list = {
				name:this.searchWord,
				cur_page:this.pagingData.current_page,
				page_size:this.pagingData.page_size
			}
			list = filterObj(list);
			$ax.getAjaxData('/organize/user.User/allOrg', list, res => {
				if (res.code == 0) {
					this.tableData = res.data;
					this.pagingData.total = Number(res.page.total);
					for (let i = 0; i < this.result.length; i++) {
						this.tableData.forEach(item => {
							if (item.id === this.result[i].id) {
								this.$set(item, '_checked', true);
							}
						});
					}
		
				} else {
					this.$Message.error(res.msg)
				}
			});
		},
		searchName(value){ //搜索商会名称
		   this.searchWord = value;
		   this.pagingData = {total: 0, current_page: 1, page_size: 10};
		   this.getAllOrg();
		},
		infoChangePage(page){
			this.infoPageData.current_page = page;
			this.getDataList();
		},
		infoChangePSize(size){
			this.infoPageData.page_size = size;
			if(this.infoPageData.current_page == 1) {
				this.getDataList();
			}
			
		},
		changePage(page){ //商会选择表格页码改变
			this.pagingData.current_page = page;
			this.getAllOrg();
		},
		changePageSize(page_size){ //每页显示个数改变 现在改变页显示个数=》导致页码改变=》会自动回到第一页
		//如果每次改变size都调用getAllOrg的话  在不是第一页的时候改变size会调用两次getAllOrg() 因为page也变了
			this.pagingData.page_size = page_size;
			if(this.pagingData.current_page == 1) {
				this.getAllOrg();
			}		
		},
		changeSelect(checkedData) { //new
			 this.result = checkedData;
		},
    },
    computed: {//计算属性
        searchList(){
			return this.selectList;
		}
    },
    watch: {//监测数据变化

	},
    
    //===================组件钩子===========================
    
    created () {//实例被创建完毕之后执行
    	
	},
    mounted () {//模板被渲染完毕之后执行
    	 this.getDataList();
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
