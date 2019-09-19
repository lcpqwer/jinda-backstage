<style scoped>

</style>



<style lang="less">
</style>

<template>
    <div>
        <Card shadow>
            <div style="margin-bottom: 10px;">
<!--                <Button type="info" @click="modal7 = true">新增</Button>-->
                <Button @click="handleSelectAll" :disabled="this.select.length  === 0">全选删除</Button>
                <Button @click="unorder">按时间正序</Button>
                <Button @click="order">按时间倒序</Button>
            </div>
            <Table :loading="loadings" highlight-row border :columns="historyColumns" :data="historyData" @on-selection-change="handleRowChange"></Table>
            <div style="text-align: right">
                <Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage"></Page>
            </div>
        </Card>
        <!-- 新增弹窗-->
<!--        <Modal-->
<!--                v-model="modal7"-->
<!--                title="新增"-->
<!--                @on-ok="hangNew">-->
<!--            <Form :model="formAdd" :label-width="80">-->
<!--                &lt;!&ndash;<FormItem label="Date">&ndash;&gt;-->
<!--                &lt;!&ndash;<DatePicker type="datetime" v-model="formItem.data" placeholder="Select date and time" style="width: 200px"></DatePicker>&ndash;&gt;-->
<!--                &lt;!&ndash;</FormItem>&ndash;&gt;-->
<!--                <FormItem label="Name">-->
<!--                    <Input v-model="formAdd.input" placeholder=""></Input>-->
<!--                </FormItem>-->
<!--            </Form>-->
<!--        </Modal>-->
    </div>
</template>

<script>
    // import tinymce from 'tinymce';
    import $qs from 'qs';

    export default {
        name: 'text-editor',
        data () {
            return {
                // 表格lodding
                loadings: true,
                loading: false,
                modal7: false,
                formAdd: {
                    input: ''
                },
                select: [],
                pageList: [],
                //
                //
                //
                //
                //    分页
                ajaxHistoryData: [],
                // 初始化信息总条数
                dataCount: 0,
                // 每页显示多少条
                pageSize: 10,
                historyColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '品牌名称',
                        key: 'order_actname'
                    },
                    {
                        title: '产品类型',
                        key: 'order_activity'
                    },
                    {
                        title: '客户姓名',
                        key: 'order_username'
                    },
                    {
                        title: '客户电话',
                        key: 'order_phone'
                    },
                    {
                        title: '预约日期',
                        key: 'order_order_date'
                    },
                    {
                        title: '预约时间',
                        key: 'order_time'
                    },
                    {
                        title: '美容师',
                        key: 'order_waitername'
                    },
                    {
                        title: '客户留言',
                        key: 'order_order_liuyan'
                    },
                    {
                        title: '服务状态',
                        algin: 'center',
                        width: 105,
                        key: 'state',
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    color: params.row.order_flag === 0 ? 'red' : params.row.order_flag === 1 ? 'green' : ''
                                }
                            }, params.row.order_flag === 0 ? '未完成' : params.row.order_flag === 1 ? '已经完成' : '');
                        }
                    },
                    {
                        title: '修改服务状态',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            let state = params.row.state;
                            if (state === 1) {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.hangEdit(params.row);
                                            }
                                        }
                                    }, '修改')
                                ]);
                            } else {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.hangEdit(params.row);
                                            }
                                        }
                                    }, '修改')
                                ]);
                            }
                        }
                    },
                    {
                        title: '回访状态',
                        algin: 'center',
                        width: 105,
                        key: 'state',
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    color: params.row.order_iscallback === 0 ? 'red' : params.row.order_iscallback === 1 ? 'green' : ''
                                }
                            }, params.row.order_iscallback === 0 ? '未回访' : params.row.order_iscallback === 1 ? '已经回访' : '');
                        }
                    },
                    {
                        title: '修改回访状态',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            let state = params.row.state;
                            if (state === 1) {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.hangWdit(params.row);
                                            }
                                        }
                                    }, '修改')
                                ]);
                            } else {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.hangWdit(params.row);
                                            }
                                        }
                                    }, '修改')
                                ]);
                            }
                        }
                    }
                ],
                historyData: []
            };
        },
        created () {
            this.handleListApproveHistory();
        },
        computed: {
        },
        methods: {
            // 多选删除
            handleSelectAll () {
                var isDelete = this.select.map(item => item.order_id);
                console.log(isDelete, 'sqwdwdwdwdwdwdwdwd');
                this.axios({
                    url: 'https://www.jinda365.com/jinda/public/admin/skin.gouzao.tech/delorder',
                    method: 'post',
                    data: $qs.stringify({
                        order_id: isDelete[0]
                    })
                }).then(res => {
                    console.log(res, 'ssssssss');
                    if (res.data.code === 200) {
                        this.handleListApproveHistory();
                        this.$Message.success(res.data.msg);
                    } else if (res.data.code === 400) {
                        this.$Message.error(res.data.msg);
                    }
                }).catch(err => {
                    // this.$Message.error('请求超时,请稍后再试...');
                    this.$Message.error('请选择要删除的数据');
                });
            },
            // 正顺序排列
            unorder () {
                var shop = sessionStorage.getItem('shopid');
                this.axios({
                    url: 'https://www.jinda365.com/jinda/public/admin/skin.gouzao.tech/shopallorders',
                    method: 'post',
                    data: $qs.stringify({
                        shopid: shop,
                        orderby: 1
                    })
                }).then(res => {
                    console.log(res.data);
                    console.log(res.data.length);
                    this.loadings = false;

                    this.ajaxHistoryData = res.data;
                    console.log('返回的数据', this.ajaxHistoryData);
                    this.dataCount = res.data.length;
                    // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
                    if (res.data.length < this.pageSize) {
                        this.historyData = this.ajaxHistoryData;
                    } else {
                        this.historyData = this.ajaxHistoryData.slice(0, this.pageSize);
                    }
                }).catch(err => {
                    // this.$Message.error('请求超时,请稍后再试...');
                    this.$Message.error('请选择要删除的数据');
                });
            },
            // 倒序排列
            order () {
                var shop = sessionStorage.getItem('shopid');
                this.axios({
                    url: 'https://www.jinda365.com/jinda/public/admin/skin.gouzao.tech/shopallorders',
                    method: 'post',
                    data: $qs.stringify({
                        shopid: shop,
                        orderby: 0
                    })
                }).then(res => {
                    console.log(res.data);
                    console.log(res.data.length);
                    this.loadings = false;

                    this.ajaxHistoryData = res.data;
                    console.log('返回的数据', this.ajaxHistoryData);
                    this.dataCount = res.data.length;
                    // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
                    if (res.data.length < this.pageSize) {
                        this.historyData = this.ajaxHistoryData;
                    } else {
                        this.historyData = this.ajaxHistoryData.slice(0, this.pageSize);
                    }
                }).catch(err => {
                    // this.$Message.error('请求超时,请稍后再试...');
                    this.$Message.error('请选择要删除的数据');
                });
            },
            handleRowChange (currentRow, oldCurrentRow) {
                this.select = currentRow;
            },
            // 新增功能
            // hangNew () {
            //     this.axios({
            //         url: 'https://www.mesonychid.com/taxi5/admin/hobby/add',
            //         method: 'post',
            //         data: $qs.stringify({
            //             name: this.formAdd.input,
            //             type: 4,
            //             system: 1
            //         })
            //     }).then(res => {
            //         if (res.data.code === 200) {
            //             this.handleListApproveHistory();
            //             this.$Message.success(res.data.msg);
            //             this.formAdd.input = '';
            //             this.formAdd.type = '';
            //         } else if (res.data.code === 400) {
            //             this.formAdd.input = '';
            //             this.formAdd.type = '';
            //             this.$Message.error(res.data.msg);
            //         }
            //     }).catch(err => {
            //         this.$Message.error('请求超时,请稍后再试...');
            //     });
            // },
            // 修改服务状态
            hangEdit (row) {
                var oid = row.order_id;
                var zt = row.order_flag;
                if (zt == 0) {
                    this.axios({
                        url: 'https://www.jinda365.com/jinda/public/admin/skin.gouzao.tech/isfinish',
                        method: 'post',
                        data: $qs.stringify({
                            order_id: oid
                        })
                    }).then(res => {
                        this.$Message.success(res.data.msg);
                        this.handleListApproveHistory();
                        console.log('未完成改成完成');
                    });
                } else if (zt == 1) {
                    this.axios({
                        url: 'https://www.jinda365.com/jinda/public/admin/skin.gouzao.tech/isnotfinish',
                        method: 'post',
                        data: $qs.stringify({
                            order_id: oid
                        })
                    }).then(res => {
                        this.$Message.success(res.data.msg);
                        this.handleListApproveHistory();
                        console.log('完成改成未完成');
                    });
                }
                //    this.$router.params.Id
            },
            // 修改回访状态
            hangWdit (row) {
                var oid = row.order_id;
                var zts = row.order_iscallback;
                if (zts == 0) {
                    this.axios({
                        url: 'https://www.jinda365.com/jinda/public/admin/skin.gouzao.tech/iscallback',
                        method: 'post',
                        data: $qs.stringify({
                            order_id: oid
                        })
                    }).then(res => {
                        this.$Message.success(res.data.msg);
                        this.handleListApproveHistory();
                        console.log('未完成改成完成');
                    });
                } else if (zts == 1) {
                    this.axios({
                        url: 'https://www.jinda365.com/jinda/public/admin/skin.gouzao.tech/isnotcallback ',
                        method: 'post',
                        data: $qs.stringify({
                            order_id: oid
                        })
                    }).then(res => {
                        this.$Message.success(res.data.msg);
                        this.handleListApproveHistory();
                        console.log('完成改成未完成');
                    });
                }
                //    this.$router.params.Id
            },
            // 分页
            // 获取历史记录信息
            handleListApproveHistory () {
                var shop = sessionStorage.getItem('shopid');
                this.axios({
                    url: 'https://www.jinda365.com/jinda/public/admin/skin.gouzao.tech/shopallorders',
                    method: 'post',
                    data: $qs.stringify({
                        shopid: shop
                    })
                }).then(res => {
                    console.log(res.data);
                    console.log(res.data.length);
                    this.loadings = false;

                    this.ajaxHistoryData = res.data;
                    console.log('返回的数据', this.ajaxHistoryData);
                    this.dataCount = res.data.length;
                    // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
                    if (res.data.length < this.pageSize) {
                        this.historyData = this.ajaxHistoryData;
                    } else {
                        this.historyData = this.ajaxHistoryData.slice(0, this.pageSize);
                    }
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
                // 保存取到的所有数据
            },
            changepage (index) {
                var _start = (index - 1) * this.pageSize;
                var _end = index * this.pageSize;
                this.historyData = this.ajaxHistoryData.slice(_start, _end);
            }
        }
    };
</script>

<style>

</style>
