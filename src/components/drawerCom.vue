<template>
	
	<div>
		<div v-if="itInfo!==null">
		<Card dis-hover style="margin: 15px;">
			<div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
				<h1 style="text-align: center;padding: 10px 5px;">
				{{itInfo.title}}
				</h1>
				<p class="line">
					<span>发布时间:{{getLocalTime(itInfo.addtime)}}</span>
					<span>发布人：{{itInfo.username}}</span>
					<span>点击量：{{itInfo.hit}}</span>
				</p>
			</div>
			<Divider />
			<p v-if="itInfo!==null" v-html="textBody" class="infoBody"></p> 
		</Card>
		<Card dis-hover style="display: inline-block;width:96%;height: 200px;margin: 15px;">
			<p class="flex" style="margin: auto;">
				<RadioGroup v-model="itInfo.status" @on-change="changeResult">
				    <Radio label="1">通过审核</Radio>
				    <Radio label="2">拒绝通过</Radio>
				</RadioGroup>
				  <Select v-model="answer" style="width:200px" v-if="itInfo.status==2">
				    <Option v-for="item in myRefuse" :value="item.id" :key="item.id">{{ item.info }}</Option>
				</Select>
				<Button type="primary" @click="postAudit" :disabled="itInfo.status=='0'||(itInfo.status ==2&&answer=='')">确定</Button>
			</p>
		</Card>
		
		</div>
	</div>
	
</template>

<script>
import {bus} from '@/assets/bus.js'
export default {
	name: 'drawerCom',
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
			textBody:'',
			answer:'',
			itInfo:null
        }
    },
    methods: {//方法
    	getLocalTime(time){
			return getLocalTime(time);
		},
		postAudit(){
			if(this.itInfo.audit_info){
				let list = {
					result:this.itInfo.status,
					id:this.itInfo.audit_info.id
				}
				if(this.itInfo.status == 2){
					list.info = this.answer;
				}
				this.postAuditFunc(list,'/ucenter/Kf/editAudit');
			}else{
				let list = {
					type:this.itInfo.listType,
					result:this.itInfo.status,
					itid:this.itInfo.id,
				}
				if(this.itInfo.status == 2){
					list.info = this.answer;
				}
				this.postAuditFunc(list,'/ucenter/Kf/addAudit')
			}
		},
		postAuditFunc(list,url){
			$ax.getAjaxData(url, list, res => {
				if (res.code == 0) {
					this.$Message.success('审核成功！');
					this.$emit('editSuccess');
				} else {
					this.$Message.error(res.msg)
				}
			});
		},
		changeResult(name){
			this.itInfo.status = name;
		}
    },
    computed: {//计算属性
        busData(){
			return bus.dataList;
		},
		myRefuse(){
			let arr = [];
			this.answerList.forEach(item =>{
				if(item.type == this.itInfo.listType){
					arr.push(item);
				}
			});
			return arr;
		},
		answerList(){
		   return this.$store.state.refuseList;
		} 
    },
    watch: {//监测数据变化
		busData(){
			if(!isFull(this.busData)){
				this.itInfo = JSON.parse(JSON.stringify(this.busData));
				 if(this.itInfo.audit_info){
					this.answer =this.itInfo.audit_info.info				
				 }
				this.textBody = transfer(this.itInfo.body);
			}
		}
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
	.flex{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.line{
		 display: flex;
		 justify-content: space-around;
		 align-items: center;
		 border-radius: 5px;
		 width:auto;
		 padding: 3px;		 
		 span{
			 padding: 3px;
		 }
	}
</style>
