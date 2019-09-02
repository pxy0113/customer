<template>
	
	<div>

		 <Row class="expand-row">
            <Col span="8" v-if="row.address">
                <span class="expand-key">地址: </span>
                <span class="expand-value">{{ row.address }}</span>
            </Col>
            <Col span="8" v-if="row.touchman">
                <span class="expand-key">联系人: </span>
                <span class="expand-value">{{ row.touchman }}</span>
            </Col>
            <Col span="8" v-if="row.phone">
                <span class="expand-key">联系电话: </span>
                <span class="expand-value">{{ row.phone }}</span>
            </Col>
        </Row>
        <Row>
            <Col span="8" v-if="row.company">
                <span class="expand-key">单位: </span>
                <span class="expand-value">《{{ row.company }}》</span>
            </Col>
            <Col span="8" v-if="row.bak">
                <span class="expand-key">备注: </span>
                <span class="expand-value">{{ row.bak }}</span>
            </Col>
            <Col span="8" v-if="row.bank">
                <span class="expand-key">银行: </span>
                <span class="expand-value">{{ row.bank }}</span>
            </Col>
        </Row>
		
	</div>
	
</template>

<script>

export default {
	name: 'expand',
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
        row:{
            type:Object,
            default:() =>({})
        }
	},
    data () {//数据
        return {
        	
        }
    },
    methods: {//方法
    	
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

</style>
