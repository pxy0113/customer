<template>
	
	<div  style="display:inline-flex;height: 100vh;width: 100vw;">
			<lottie v-if="spinShow"
			style="margin: auto;"
			:options="defaultOptions" 
			:height="200" :width="200" 
			v-on:animCreated="handleAnimation" />
		<Card  dis-hover style="margin: auto;padding: 10px;text-align: center;border: none;" v-if="!spinShow">
				<h2>欢迎进入商会管理系统</h2>
				<h2>微信扫码/授权登陆进入本系统</h2>
				<div @click="changeCode($event)" ref="codeDiv" class="code" >点击获取登陆二维码</div>
				<Button @click="refreshCode" style="margin: 5px 0;" type="primary">点击刷新</Button>
		</Card>
		<Modal
			v-model="twoModal"
			title="提示"
			@on-ok="updateWx">
			<p>二维码已过期！是否刷新</p>
		</Modal>
	</div>
	
</template>

<script>
import * as animationData from '@/assets/lottie/935-loading.json'
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
			twoModal:false,
			defaultOptions: { animationData: animationData.default },
			animationSpeed: 1,
			anim: {},
			
			ws:null,			
        	spinShow: true,
			rand:'',
			inter:null,
			num:0
        	
        }
    },
    methods: {//方法
		handleAnimation(anim) {
			this.anim = anim;
		},
	
    	refresh(){
    		window.location.reload();
    	},		
		changeCode(ev){ //改变图形验证码
			this.num = 0;
			let el = ev.target;
			$ax.getAjaxData('/ucenter/Login/createRand',{}, (res) =>{
				if(res.code == 0){
					this.rand = res.data.rand;
					this.listen(this.rand);
					el.style.backgroundImage = "url("+window._HOST.BASE_URL+"/ucenter/Login/registerCodeShow/"+this.rand+")";
					el.innerHTML = '';
					el.innerText = '';
				}else{
					this.$Message.error(res.msg);
				}
			});
		},
		listen(rand){
			var wsl= 'wss://cocbs.cocmis.com/websocket';
			
			let type = 3;  ////推送类型  1,登录扫码。2，签到推送。3，抽奖推送
			
				this.ws = new WebSocket(wsl);
				this.ws.onopen = this.open;
				this.ws.onmessage = this.getMessage;
				this.ws.onerror = this.error;
				this.ws.onclose = this.close;
		},
		open(){
			console.log('链接成功!');
			this.send();
		},
		send(){
			let json = '{"type":1,"unique_code":"'+this.rand+'"}';
			this.ws.send(json);
		},
		error(err){
			console.log(err)
		},
		close(){
			console.log('断开链接');
		},
		getMessage(evt){
			let result = JSON.parse(evt.data);
			console.log(result);
			if(result.step == 'login'&&result.code ==0){
				this.checkAuth();
			}
		},
		checkAuth(){
			$ax.getAjaxData('/ucenter/Login/isOauth',{rand:this.rand}, (res) =>{
				if(res.code == 0){			  		
					clearInterval(this.inter);
					this.$Message.success('授权登陆成功');
					this.towModal = false;
					this.getMyInfo();
				}else{
					this.$Message.error(res.msg);
				}
			});
		},
		refreshCode(ev){ //刷新图形验证码
				this.$refs.codeDiv.click();
		},
		updateWx(){
			this.autoClick();
			this.$Message.info('刷新成功');
		},
		getMyInfo(){			
			$ax.getAjaxData('/ucenter/User/myAudit',{}, res => {
				if (res.code == 0) {
					
					let arr = [];
					for(let i in res.data){
						if(res.data[i]){
							arr.push(i)
						}
					}
					// sessionStorage.login = JSON.stringify(arr);
					sessionStorage.login = this.$utils.encrypt(JSON.stringify(arr),window._HOST.KEY_STR);;
					if(arr.indexOf('super')>-1){
						this.$router.replace({name:'checkManage'});
					}else if(arr.indexOf('news')>-1){
						this.$router.replace({name:'checkInfo'});
					}else if(arr.indexOf('rs')>-1){
						this.$router.replace({name:'checkRes'});
					}else if(arr.indexOf('gov')>-1){
						this.$router.replace({name:'checkAccount'});
					}else{
						 this.$Modal.info({
                            title: '提示',
                            content: '<p>您没有权限，无法进入，请联系超级管理员！</p>'
                        });
						this.spinShow = false;
						this.autoClick();
					}
					
				} else {
					console.log(res.msg);
					this.spinShow = false;
					this.autoClick();
				}
			});
		},
		autoClick(){
			 this.$nextTick(function () {
			  this.$refs.codeDiv.click();
			});
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
	destroyed(){
		//this.ws.close();
	},
	//=================组件路由勾子==============================
	
	beforeRouteEnter (to, from, next) {//在组件创建之前调用（放置页面加载时请求的Ajax）
		
		(async () => { //执行异步函数
			
			try{
				next(vm =>{
					vm.getMyInfo();
				})
				
			}catch (err) {
				console.log(err);
				next(vm => {
	    			vm.spinShow = false;
	    		});
			}
			
			next();

		})();
		
		

			    
	},
	
}
</script>

<style scoped lang="less">
	.demo-spin-col{
        height: 100%;

        position: relative;
    }
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    .error{
    	text-align: center;
    	position: absolute;
    	width: 100%;
    	height: 100%;
    	left: 0;
    	right: 0;
    	top: 0;
    	bottom: 0;
    	display: flex;
    	align-content: center;
    	flex-wrap: wrap;
    }
	.code{
		width: 300px;height: 300px;background-size: cover;

	}
</style>