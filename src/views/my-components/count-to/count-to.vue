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
                        title: '手机号',
                        key: 'phone'
                    },
                    {
                        title: '内容',
                        key: 'content'
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
                    url: 'Feedback/delete',
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
                    url: 'Feedback/delete',
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
                    url: 'Feedback/show',
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
                    url: 'Feedback/show',
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
        //     改到价格表了
        }
    };
</script>

<style>

</style>

<!--<style lang="less">-->
    <!--@import '../../../styles/common.less';-->
    <!--@import './count-to.less';-->
<!--</style>-->

<!--<template>-->
    <!--<div>-->
        <!--<Row>-->
            <!--<Col span="3">-->
                <!--<Card>-->
                    <!--<p slot="title">-->
                        <!--<Icon type="waterdrop"></Icon>-->
                        <!--CountTo组件基础用法-->
                    <!--</p>-->
                    <!--<Row type="flex" justify="center" align="middle" class="countto-page-row">-->
                        <!--<div class="count-to-con">-->
                            <!--<CountTo :endVal="2534"/>-->
                        <!--</div>-->
                    <!--</Row>-->
                <!--</Card>-->
            <!--</Col>-->
            <!--<Col span="5" class="padding-left-10">-->
                <!--<Card>-->
                    <!--<p slot="title">-->
                        <!--<Icon type="code"></Icon>-->
                        <!--可添加左右文字-->
                    <!--</p>-->
                    <!--<Row type="flex" justify="center" align="middle" class="countto-page-row">-->
                        <!--<div class="count-to-con">-->
                            <!--<CountTo :endVal="2534">-->
                                <!--<span slot="leftText">Total:&nbsp;</span>-->
                                <!--<span slot="rightText">&nbsp;times</span>-->
                            <!--</CountTo>-->
                        <!--</div>-->
                    <!--</Row>-->
                <!--</Card>-->
            <!--</Col>-->
            <!--<Col span="8" class="padding-left-10">-->
                <!--<Card>-->
                    <!--<p slot="title">-->
                        <!--<Icon type="paintbucket"></Icon>-->
                        <!--自定义样式-->
                    <!--</p>-->
                    <!--<Row type="flex" justify="center" align="middle" class="countto-page-row">-->
                        <!--<div class="count-to-con">-->
                            <!--<CountTo :endVal="2534" :mainStyle="mainStyle" :countStyle="countStyle">-->
                                <!--<span slot="leftText">Total:&nbsp;</span>-->
                                <!--<span slot="rightText">&nbsp;times</span>-->
                            <!--</CountTo>-->
                        <!--</div>-->
                    <!--</Row>-->
                <!--</Card>-->
            <!--</Col>-->
            <!--<Col span="8" class="padding-left-10">-->
                <!--<Card>-->
                    <!--<p slot="title">-->
                        <!--<Icon type="settings"></Icon>-->
                        <!--设置数据格式-->
                    <!--</p>-->
                    <!--<Row type="flex" justify="center" align="middle" class="countto-page-row">-->
                        <!--<div class="count-to-con">-->
                            <!--<CountTo :endVal="2534" :mainStyle="mainStyle" :countStyle="countStyle" :decimals="2">-->
                                <!--<span slot="leftText">Total:&nbsp;</span>-->
                                <!--<span slot="rightText">&nbsp;times</span>-->
                            <!--</CountTo>-->
                        <!--</div>-->
                    <!--</Row>-->
                <!--</Card>-->
            <!--</Col>-->
        <!--</Row>-->
        <!--<Row class="margin-top-10">-->
            <!--<Col span="8">-->
                <!--<Card>-->
                    <!--<p slot="title">-->
                        <!--<Icon type="ios-color-wand"></Icon>-->
                        <!--转换单位简化数据-->
                    <!--</p>-->
                    <!--<Row type="flex" justify="center" align="middle" class="countto-page-row">-->
                        <!--<div class="count-to-con">-->
                            <!--<CountTo :simplify="true" :endVal="2534" :mainStyle="mainStyle" :countStyle="countStyle">-->
                                <!--<span slot="leftText">Total:&nbsp;</span>-->
                                <!--<span slot="rightText">&nbsp;times</span>-->
                            <!--</CountTo>-->
                        <!--</div>-->
                    <!--</Row>-->
                <!--</Card>-->
            <!--</Col>-->
            <!--<Col span="8" class="padding-left-10">-->
                <!--<Card>-->
                    <!--<p slot="title">-->
                        <!--<Icon type="ios-shuffle-strong"></Icon>-->
                        <!--自定义单位-->
                    <!--</p>-->
                    <!--<Row type="flex" justify="center" align="middle" class="countto-page-row">-->
                        <!--<div class="count-to-con">-->
                            <!--<CountTo :simplify="true" :unit="unit" :endVal="253" :mainStyle="mainStyle2" :countStyle="countStyle2">-->
                                <!--<span slot="leftText">原始数据：253&nbsp;=>&nbsp;</span>-->
                            <!--</CountTo>-->
                            <!--<CountTo :simplify="true" :unit="unit" :endVal="2534" :mainStyle="mainStyle2" :countStyle="countStyle2">-->
                                <!--<span slot="leftText">原始数据：2534&nbsp;=>&nbsp;</span>-->
                            <!--</CountTo>-->
                            <!--<CountTo :simplify="true" :unit="unit" :endVal="257678" :mainStyle="mainStyle2" :countStyle="countStyle2">-->
                                <!--<span slot="leftText">原始数据：257678&nbsp;=>&nbsp;</span>-->
                            <!--</CountTo>-->
                        <!--</div>-->
                    <!--</Row>-->
                <!--</Card>-->
            <!--</Col>-->
            <!--<Col span="8" class="padding-left-10">-->
                <!--<Card>-->
                    <!--<p slot="title">-->
                        <!--<Icon type="android-stopwatch"></Icon>-->
                        <!--可异步更新数据-->
                    <!--</p>-->
                    <!--<Row type="flex" justify="center" align="middle" class="countto-page-row">-->
                        <!--<div class="count-to-con">-->
                            <!--<CountTo :endVal="asynEndVal" :mainStyle="mainStyle" :countStyle="countStyle">-->
                                <!--<span slot="leftText">Total:&nbsp;</span>-->
                                <!--<span slot="rightText">&nbsp;times</span>-->
                            <!--</CountTo>-->
                        <!--</div>-->
                    <!--</Row>-->
                <!--</Card>-->
            <!--</Col>-->
        <!--</Row>-->
        <!--<Row class="margin-top-10">-->
            <!--<Card>-->
                <!--<p slot="title">-->
                    <!--<Icon type="ios-analytics"></Icon>-->
                    <!--综合实例-->
                <!--</p>-->
                <!--<Row type="flex" justify="center" align="middle" class="countto-page-row">-->
                    <!--<div class="count-to-con">-->
                        <!--<CountTo :delay="500" :simplify="true" :unit="unit2" :endVal="integratedEndVal" :mainStyle="mainStyle" :countStyle="countStyle">-->
                            <!--<span slot="leftText">原始数据:&nbsp;{{ integratedEndVal }}&nbsp;=>&nbsp;</span>-->
                            <!--<span slot="rightText">&nbsp;times</span>-->
                        <!--</CountTo>-->
                    <!--</div>-->
                <!--</Row>-->
            <!--</Card>-->
        <!--</Row>-->
    <!--</div>-->
<!--</template>-->

<!--<script>-->
<!--import CountTo from './CountTo.vue';-->
<!--export default {-->
    <!--name: 'count-to',-->
    <!--components: {-->
        <!--CountTo-->
    <!--},-->
    <!--data () {-->
        <!--return {-->
            <!--endVal: 0,-->
            <!--mainStyle: {-->
                <!--fontSize: '30px'-->
            <!--},-->
            <!--countStyle: {-->
                <!--fontSize: '50px',-->
                <!--color: '#dc9387'-->
            <!--},-->
            <!--mainStyle2: {-->
                <!--fontSize: '22px'-->
            <!--},-->
            <!--countStyle2: {-->
                <!--fontSize: '30px',-->
                <!--color: '#dc9387'-->
            <!--},-->
            <!--unit: [[3, '千多'], [4, '万多'], [5, '十万多']],-->
            <!--unit2: [[1, '十多'], [2, '百多'], [3, '千多'], [4, '万多'], [5, '十万多'], [6, '百万多'], [7, '千万多'], [8, '亿多']],-->
            <!--asynEndVal: 487,-->
            <!--integratedEndVal: 3-->
        <!--};-->
    <!--},-->
    <!--methods: {-->
        <!--init () {-->
            <!--setInterval(() => {-->
                <!--this.asynEndVal += parseInt(Math.random() * 20);-->
                <!--this.integratedEndVal += parseInt(Math.random() * 30);-->
            <!--}, 2000);-->
        <!--}-->
    <!--},-->
    <!--mounted () {-->
        <!--this.init();-->
    <!--}-->
<!--};-->
<!--</script>-->
