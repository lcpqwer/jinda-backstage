<style lang="less">
    #Feedback .ivu-card-body .ivu-table-cell {
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
</style>

<template>
    <div id="Feedback">
        <Card shadow>
            <div style="margin-bottom: 10px;">
                <Button @click="handleSelectAll" :disabled="this.select.length  === 0">全选删除</Button>
            </div>
            <Table :loading="loadings" highlight-row border :columns="historyColumns" :data="historyData" @on-selection-change="handleRowChange"></Table>
            <div style="text-align: right">
                <Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage"></Page>
            </div>
        </Card>
    </div>
</template>

<script>
    // import tinymce from 'tinymce';
    import expandRow from './table-expand.vue';
    import $qs from 'qs';

    export default {
        name: 'text-editor',
        components: { expandRow },
        data () {
            return {
                // 表格lodding
                loadings: true,
                loading: false,
                data6: [],
                modal7: false,
                formItem: {
                    // data: '',
                    input: ''
                },
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
                        type: 'expand',
                        // title: 'Content',
                        width: 80,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row
                                }
                            });
                        }
                    },
                    {
                        title: '时间',
                        key: 'createTime'
                    },
                    {
                        title: '名字',
                        key: 'name'
                    },
                    {
                        title: '岗位',
                        key: 'title'
                    },
                    {
                        title: '手机号',
                        key: 'phone'
                    },
                    {
                        title: '自我介绍',
                        key: 'content'
                    },
                    {
                        title: '简历附件',
                        key: 'img',
                        width: 120,
                        align: 'center',
                        render: (h, params) => {
                            return h('a', {
                                attrs: {
                                    href: params.row.resume, style: 'width: 250px;height: 100px;', download: 'w3logo'
                                }
                            }, '下载');
                        }
                    },
                    {
                        title: 'Action',
                        key: 'action',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.hangRemove(params.row);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                historyData: [],
                imgs: 'http://img4.imgtn.bdimg.com/it/u=967395617,3601302195&fm=26&gp=0.jpg',
                showCropedImage: false,
                cropper1: {}
            };
        },
        created () {
            this.handleListApproveHistory();
        },
        methods: {
            // 多选删除
            handleSelectAll () {
                var isDelete = this.select.map(item => item.Id);
                this.axios({
                    url: 'Recruitment/feedback_delete',
                    method: 'post',
                    data: $qs.stringify({
                        Id: isDelete
                    })
                }).then(res => {
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
            handleRowChange (currentRow, oldCurrentRow) {
                this.select = currentRow;
            },
            // 确认修改
            asyncOK () {
                // /Business/dupdate，
                this.axios({
                    url: 'Business/update',
                    method: 'post',
                    data: $qs.stringify({
                        Id: this.$route.query.id,
                        name: this.formItem.input
                    })
                }).then(res => {
                    if (res.data.code === 200) {
                        this.handleListApproveHistory();
                        this.$Message.success(res.data.msg);
                    } else if (res.data.code === 400) {
                        this.$Message.error(res.data.msg);
                    }
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            // 删除功能
            hangRemove (row) {
                this.axios({
                    url: 'Recruitment/feedback_delete',
                    method: 'post',
                    data: $qs.stringify({
                        Id: row.Id
                    })
                }).then(res => {
                    if (res.data.code === 200) {
                        this.handleListApproveHistory();
                        this.$Message.success(res.data.msg);
                    } else if (res.data.code === 400) {
                        this.$Message.error(res.data.msg);
                    }
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            init () {
                this.axios({
                    url: 'Recruitment/feedback_show',
                    method: 'post',
                    data: $qs.stringify({
                    })
                }).then(res => {
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            // 分页
            // 获取历史记录信息
            handleListApproveHistory () {
                this.axios({
                    url: 'Recruitment/feedback_show',
                    method: 'post',
                    data: $qs.stringify({
                    })
                }).then(res => {
                    this.loadings = false;
                    this.ajaxHistoryData = res.data.table;
                    this.dataCount = res.data.table.length;
                    // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
                    if (res.data.table.length < this.pageSize) {
                        this.historyData = this.ajaxHistoryData;
                    } else {
                        this.historyData = this.ajaxHistoryData.slice(0, this.pageSize);
                    }
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            changepage (index) {
                var _start = (index - 1) * this.pageSize;
                var _end = index * this.pageSize;
                this.historyData = this.ajaxHistoryData.slice(_start, _end);
            }
        },
        mounted () {
        }
    };
</script>

<!--<style>-->

<!--</style>-->
<!--<style lang="less">-->
    <!--@import './advanced-router.less';-->
<!--</style>-->

<!--<template>-->
    <!--<div>-->
        <!--<Row>-->
            <!--<Card>-->
                <!--<p slot="title">-->
                    <!--<Icon type="ios-list"></Icon>-->
                    <!--购物记录(传递参数123)-->
                <!--</p>-->
                <!--<Row type="flex" justify="center" align="middle" class="advanced-router">-->
                    <!--<Table :columns="shoppingColumns" :data="shoppingData" style="width: 100%;"></Table>-->
                <!--</Row>-->
            <!--</Card>-->
        <!--</Row>-->
    <!--</div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
    <!--name: 'argument-page',-->
    <!--data () {-->
        <!--return {-->
            <!--shoppingColumns: [-->
                <!--{-->
                    <!--type: 'index',-->
                    <!--title: '序号',-->
                    <!--width: 60-->
                <!--},-->
                <!--{-->
                    <!--title: '购物单号',-->
                    <!--key: 'shopping_id',-->
                    <!--align: 'center'-->
                <!--},-->
                <!--{-->
                    <!--title: '购买物品名称',-->
                    <!--key: 'name',-->
                    <!--align: 'center'-->
                <!--},-->
                <!--{-->
                    <!--title: '购买时间',-->
                    <!--key: 'time'-->
                <!--},-->
                <!--{-->
                    <!--title: '查看详情',-->
                    <!--key: 'show_more',-->
                    <!--align: 'center',-->
                    <!--render: (h, params) => {-->
                        <!--return h('Button', {-->
                            <!--props: {-->
                                <!--type: 'text',-->
                                <!--size: 'small'-->
                            <!--},-->
                            <!--on: {-->
                                <!--click: () => {-->
                                    <!--let query = {shopping_id: params.row.shopping_id};-->
                                    <!--this.$router.push({-->
                                        <!--name: 'shopping',-->
                                        <!--query: query-->
                                    <!--});-->
                                <!--}-->
                            <!--}-->
                        <!--}, '了解详情');-->
                    <!--}-->
                <!--}-->
            <!--],-->
            <!--shoppingData: [-->
                <!--{-->
                    <!--shopping_id: 100001,-->
                    <!--name: '《vue.js实战》',-->
                    <!--time: '2017年11月12日'-->
                <!--},-->
                <!--{-->
                    <!--shopping_id: 100002,-->
                    <!--name: '面包',-->
                    <!--time: '2017年11月5日'-->
                <!--},-->
                <!--{-->
                    <!--shopping_id: 100003,-->
                    <!--name: '咖啡',-->
                    <!--time: '2017年11月8日'-->
                <!--},-->
                <!--{-->
                    <!--shopping_id: 100004,-->
                    <!--name: '超级豪华土豪金牙签',-->
                    <!--time: '2017年11月9日'-->
                <!--}-->
            <!--]-->
        <!--};-->
    <!--}-->
<!--};-->
<!--</script>-->
