<template>

    <div>
        <div style="display: flex;margin: 10px;justify-content: space-around;align-items: center;">
            <Button @click="exportTable" type="primary">导出表格所有信息</Button>
            <Input search enter-button placeholder="输入发票抬头" @on-search="searchWord" style="width: 50%;" />
        </div>

        <Card dis-hover>
            <Table border :columns="columns" :data="list" ref="table" no-data-text="暂无数据"></Table>
            <div style="display: flex;margin: 10px;justify-content: center;align-items: center;">
                <Page :total="pagingData.total" @on-change="pageChange" show-total />
            </div>
        </Card>
        <Modal v-model="showDetail" footer-hide :mask-closable="false" title="回执信息">
            <Form :label-width="80" v-if="currentBill">
                <FormItem label="发票代码">
                    {{currentBill.bill_code}}
                </FormItem>
                <FormItem label="发票编号">
                    {{currentBill.bill_num}}
                </FormItem>
                <FormItem label="受理时间">
                    {{getTime(currentBill.addtime)}}
                </FormItem>
                <FormItem label="附件">
                    <viewer :images="currentBill.imgList"> 
                      <img
                            v-for="(src,index) in currentBill.imgList"
                            :src="'https://cocbs.cocmis.com:443/upload/'+src"
                            :key="index"
                            style="margin: 5px;max-width: 300px;max-height: 300px;cursor: pointer;"
                            :onerror="errorImg"
                          >
                    </viewer>

                </FormItem>
            </Form>

        </Modal>


    </div>

</template>


<script>
    import expand from '@/components/expand.vue'
    export default {
        name: 'invoiceList',
        components: { //组件模板
            expand
        },
        props: { //组件道具（参数）
            /* ****属性用法*****
             * 
             * 传递类型 type: Array | Number | String | Object
             * 为必传 required: true
             * 默认值 default: ''
             * 
             */
        },
        data() { //数据
            return {
                currentBill: null,
                company: '',
                pagingData: {
                    total: 0,
                    current_page: 1,
                    page_size: 10,
                },
                list: [],
                showDetail: false,
                currentImg: '',
                exportColumns: [{
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '发票抬头',
                        align: 'center',
                        key: 'company'
                    },
                    {
                        title: '识别号',
                        align: 'center',
                        key: 'sh'
                    },
                    {
                        title: '金额(元)',
                        align: 'center',
                        key: 'fee'
                    },
                    {
                        title: '时间',
                        align: 'center',
                        key: 'addtime'
                    },
                ],
                columns: [
                      {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expand, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                    {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '发票抬头',
                        align: 'center',
                        key: 'company'
                    },
                    {
                        title: '识别号',
                        align: 'center',
                        key: 'sh'
                    },
                    {
                        title: '金额(元)',
                        align: 'center',
                        render: (h, params) => {
                            let fee = params.row.fee;
                            return h('span', {
                                style: {
                                    color: 'red'
                                }
                            }, (fee / 100).toFixed(2))
                        }
                    },
                    {
                        title: '时间',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', getTimeMinute(params.row.addtime))
                        }
                    },
                    {
                        title: '图片',
                        align: 'center',
                        render: (h, params) => {
                            if (params.row.img !== '') {
                                 return h('viewer', [
                                    h('img', {
                                        attrs: {
                                            src: 'https://cocbs.cocmis.com:443/upload/' + params.row.img
                                        },
                                        style: {
                                            width: '100px',
                                            height: '100px',
                                            padding: '5px'
                                        }
                                    }),
                                ]);
                                
                            } else {
                                return h('span', '暂无图片');
                            }

                        }

                    },
                    {
                        title: '银行对账',
                        align: 'center',
                        render: (h, params) => {
                            let bill = params.row.bill_receipt;
                            return h('i-switch', {
                                props: {
                                    value: bill.isdz == 1 ? true : false,
                                    disabled: bill.bill_id ? false : true
                                },
                                on: {
                                    'on-change': (value) => {
                                        this.changeSwitch(value, params.row);
                                    }
                                }
                            })
                        }
                    }, {
                        title: '查看',
                        align: 'center',
                        render: (h, params) => {
                            if (params.row.bill_receipt.bill_id) {
                                return h('Button', {
                                    on: {
                                        click: () => {
                                            this.currentBill = null;
                                            this.showDetail = true;
                                            this.currentBill = params.row.bill_receipt;
                                            this.currentBill.imgList = this.getImg();
                                        }
                                    }
                                }, '回执信息');
                            } else {
                                return h('span', {
                                    style: {
                                        color: 'red'
                                    }
                                }, '等待受理');
                            }

                        }
                    }
                ],
            }
        },
        methods: { //方法
            errorImg() {
                console.log('图片加载错误')
            },
            getImg() {
                let img = [];
                img = this.currentBill.img.split(',');
                return img;
            },

            getTime(time) {
                return getTimeMinute(time);
            },
            getList() {
                $ax.getAjaxData('/ucenter/Kf/billAll', {
                    company: this.company,
                    cur_page: this.pagingData.current_page
                }, (res) => {
                    if (res.code == 0) {

                        let resData = res.data;
                        this.list = resData;
                        this.pagingData.total = Number(res.page.total);
                    } else {
                        this.$Message.error(res.msg);
                    }
                });
            },

            exportTable() {
                $ax.getAjaxData('/ucenter/Kf/billAll', {
                    page_size: 9999,
                    cur_page: 1,
                    company: this.company
                }, (res) => {
                    if (res.code == 0) {
                        let list = res.data;
                        list.forEach(item => {
                            item.fee = (item.fee / 100).toFixed(2);
                            item.sh = `'${item.sh}`;
                            item.addtime = getTimeMinute(item.addtime)
                        });
                        let date = new Date().toLocaleString().split('/').join('-');
                        this.$refs.table.exportCsv({
                            filename: `${date}统计开票`,
                            data: list,
                            columns: this.exportColumns
                        });

                    } else {
                        this.$Message.error(res.msg);
                    }
                });
            },

            changeSwitch(value, row) {

                row.bill_receipt.isdz = value ? 1 : 0;

                $ax.getAjaxData('/ucenter/Kf/billDz', {
                    id: row.bill_receipt.id,
                    isdz: value ? 1 : 0
                }, (res) => {
                    if (res.code == 0) {
                        this.$Message.success({
                            content: '提交成功！'
                        });
                        this.list.forEach(item => { //改变value
                            if (item.id == row.id) {
                                item.bill_receipt.isdz = value ? 1 : 0;
                            }
                        });
                    } else {
                        this.$Message.error({
                            content: '提交失败！'
                        });
                        row.bill_receipt.isdz = value ? 0 : 1;

                    }
                });

            },

            pageChange(page) {
                this.pagingData.current_page = page;
                this.getList();
            },
            searchWord(value) {
                this.company = value;
                this.pagingData.current_page = 1;
                this.getList();
            },

        },
        computed: { //计算属性

        },
        watch: { //监测数据变化

        },

        //===================组件钩子===========================

        created() { //实例被创建完毕之后执行

        },
        mounted() { //模板被渲染完毕之后执行
            this.getList();
        },
        destroyed() { //Vue 实例销毁后调用

        },
        //=================组件路由勾子==============================

        beforeRouteEnter(to, from, next) { //在组件创建之前调用（放置页面加载时请求的Ajax）

            (async () => { //执行异步函数

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

                } catch (err) {
                    console.log(err);
                    next();
                }

                next();

            })();

        },

    }
</script>

<style scoped lang="less">
    .ivu-form-item {
        margin-bottom: 8px;
        vertical-align: top;
        zoom: 1;
    }
</style>
