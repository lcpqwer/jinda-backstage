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
                        title: '姓名',
                        key: 'name'
                    },
                    {
                        title: '手机号',
                        key: 'phone'
                    },
                    {
                        title: '邮箱',
                        key: 'email'
                    },
                    {
                        title: '预约时间',
                        key: 'Time'
                    },
                    {
                        title: '申请内容',
                        key: 'content'
                    },
                    {
                        title: '参访公司',
                        key: 'address'
                    },
                    {
                        title: '状态',
                        key: 'statue'
                    },
                    {
                        title: 'Action',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
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
                                            this.hangAudit(params.row);
                                        }
                                    }
                                }, '审核'),
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
            hangAudit (row) {
                this.axios({
                    url: 'Reference/Auditing',
                    method: 'post',
                    data: $qs.stringify({
                        Id: row.Id,
                        email: row.email
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
            // 多选删除
            handleSelectAll () {
                var isDelete = this.select.map(item => item.Id);
                this.axios({
                    url: 'Reference/aply_delete',
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
                    url: 'Reference/aply_delete',
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
                    url: 'Reference/aply_show',
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
                    url: 'Reference/aply_show',
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

<style>

</style>

<!--<style lang="less">-->
    <!--/*@import '../../../styles/loading.less';*/-->
<!--</style>-->

<!--<template>-->
    <!--<div>-->
        <!--<Card shadow>-->
            <!--<div style="margin-bottom: 10px;">-->
                <!--<Button type="info" @click="modal7 = true">新增</Button>-->
                <!--<Button @click="handleSelectAll" :disabled="this.select.length  === 0">全选删除</Button>-->
            <!--</div>-->
            <!--<Table highlight-row border :columns="historyColumns" :data="historyData" @on-selection-change="handleRowChange"></Table>-->
            <!--<div style="text-align: right">-->
                <!--<Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage"></Page>-->
            <!--</div>-->
        <!--</Card>-->
        <!--&lt;!&ndash; 修改弹窗&ndash;&gt;-->
        <!--<Modal-->
                <!--v-model="modal6"-->
                <!--title="修改"-->
                <!--:loading="loading"-->
                <!--@on-ok="asyncOK">-->
            <!--<Form :model="formItem" :label-width="80">-->
                <!--<FormItem label="Name">-->
                    <!--<Input v-model="formItem.input" placeholder=""></Input>-->
                <!--</FormItem>-->
            <!--</Form>-->
        <!--</Modal>-->
        <!--&lt;!&ndash; 新增弹窗&ndash;&gt;-->
        <!--<Modal-->
                <!--v-model="modal7"-->
                <!--title="新增"-->
                <!--@on-ok="hangNew">-->
            <!--<Form :model="formAdd" :label-width="80">-->
                <!--&lt;!&ndash;<FormItem label="Date">&ndash;&gt;-->
                <!--&lt;!&ndash;<DatePicker type="datetime" v-model="formItem.data" placeholder="Select date and time" style="width: 200px"></DatePicker>&ndash;&gt;-->
                <!--&lt;!&ndash;</FormItem>&ndash;&gt;-->
                <!--<FormItem label="Name">-->
                    <!--<Input v-model="formAdd.input" placeholder=""></Input>-->
                <!--</FormItem>-->
            <!--</Form>-->
        <!--</Modal>-->
    <!--</div>-->
<!--</template>-->

<!--<script>-->
    <!--// import tinymce from 'tinymce';-->
    <!--export default {-->
        <!--name: 'text-editor',-->
        <!--data () {-->
            <!--return {-->
                <!--modal6: false,-->
                <!--loading: false,-->
                <!--data6: [],-->
                <!--modal7: false,-->
                <!--formItem: {-->
                    <!--// data: '',-->
                    <!--input: ''-->
                <!--},-->
                <!--formAdd: {-->
                    <!--input: ''-->
                <!--},-->
                <!--select: [],-->
                <!--pageList: [],-->
                <!--//-->
                <!--//-->
                <!--//-->
                <!--//-->
                <!--//    分页-->
                <!--ajaxHistoryData: [],-->
                <!--// 初始化信息总条数-->
                <!--dataCount: 0,-->
                <!--// 每页显示多少条-->
                <!--pageSize: 10,-->
                <!--historyColumns: [-->
                    <!--{-->
                        <!--type: 'selection',-->
                        <!--width: 60,-->
                        <!--align: 'center'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '时间',-->
                        <!--key: 'createTime'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '姓名',-->
                        <!--key: 'name'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '手机号',-->
                        <!--key: 'phone'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '邮箱',-->
                        <!--key: 'email'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '预约时间',-->
                        <!--key: 'Time'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '申请内容',-->
                        <!--key: 'content'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '状态',-->
                        <!--key: 'statue'-->
                    <!--},-->
                    <!--{-->
                        <!--title: 'Action',-->
                        <!--key: 'action',-->
                        <!--width: 150,-->
                        <!--align: 'center',-->
                        <!--render: (h, params) => {-->
                            <!--return h('div', [-->
                                <!--h('Button', {-->
                                    <!--props: {-->
                                        <!--type: 'primary',-->
                                        <!--size: 'small'-->
                                    <!--},-->
                                    <!--style: {-->
                                        <!--marginRight: '5px'-->
                                    <!--},-->
                                    <!--on: {-->
                                        <!--click: () => {-->
                                            <!--this.hangEdit(params.row)-->
                                        <!--}-->
                                    <!--}-->
                                <!--}, '修改'),-->
                                <!--h('Button', {-->
                                    <!--props: {-->
                                        <!--type: 'error',-->
                                        <!--size: 'small'-->
                                    <!--},-->
                                    <!--on: {-->
                                        <!--click: () => {-->
                                            <!--this.hangRemove(params.row)-->
                                        <!--}-->
                                    <!--}-->
                                <!--}, '删除')-->
                            <!--]);-->
                        <!--}-->
                    <!--}-->
                <!--],-->
                <!--historyData: []-->
            <!--};-->
        <!--},-->
        <!--created () {-->
            <!--this.init();-->
            <!--this.handleListApproveHistory();-->
        <!--},-->
        <!--computed: {-->
        <!--},-->
        <!--methods: {-->
            <!--// 多选删除-->
            <!--handleSelectAll () {-->
                <!--var isDelete = this.select.map(item => item.Id)-->
                <!--console.log(isDelete)-->
                <!--this.axios.post('Reference/content_delete', {-->
                    <!--data: {-->
                        <!--Id: isDelete-->
                    <!--}-->
                <!--}).then(res => {-->
                    <!--if (res.data.code === 200) {-->
                        <!--this.init();-->
                        <!--this.handleListApproveHistory();-->
                        <!--this.$Message.success(res.data.msg);-->
                    <!--} else if (res.data.code === 400) {-->
                        <!--this.$Message.error(res.data.msg);-->
                    <!--}-->
                <!--}).catch(err => {-->
                    <!--// this.$Message.error('请求超时,请稍后再试...');-->
                    <!--this.$Message.error('请选择要删除的数据');-->
                <!--});-->
            <!--},-->
            <!--handleRowChange (currentRow, oldCurrentRow) {-->
                <!--this.select = currentRow;-->
            <!--},-->
            <!--// 新增功能-->
            <!--hangNew () {-->
                <!--this.axios.post('Reference/content_Add', {-->
                    <!--data: {-->
                        <!--name: this.formAdd.input-->
                    <!--}-->
                <!--}).then(res => {-->
                    <!--if (res.data.code === 200) {-->
                        <!--this.init();-->
                        <!--this.handleListApproveHistory();-->
                        <!--this.$Message.success(res.data.msg);-->
                        <!--this.formAdd.input = ''-->
                    <!--} else if (res.data.code === 400) {-->
                        <!--this.formAdd.input = ''-->
                        <!--this.$Message.error(res.data.msg);-->
                    <!--}-->
                <!--}).catch(err => {-->
                    <!--this.$Message.error('请求超时,请稍后再试...');-->
                <!--});-->
            <!--},-->
            <!--// 确认修改-->
            <!--asyncOK () {-->
                <!--// /Business/dupdate，-->
                <!--this.axios.post('Reference/content_update', {-->
                    <!--data: {-->
                        <!--Id: this.$route.query.id,-->
                        <!--name: this.formItem.input-->
                    <!--}-->
                <!--}).then(res => {-->
                    <!--if (res.data.code === 200) {-->
                        <!--this.init();-->
                        <!--this.handleListApproveHistory();-->
                        <!--this.$Message.success(res.data.msg);-->
                    <!--} else if (res.data.code === 400) {-->
                        <!--this.$Message.error(res.data.msg);-->
                    <!--}-->
                <!--}).catch(err => {-->
                    <!--this.$Message.error('请求超时,请稍后再试...');-->
                <!--});-->
            <!--},-->
            <!--hangEdit (row) {-->
                <!--this.modal6 = true;-->
                <!--this.$router.push({-->
                    <!--query: {-->
                        <!--id: row.Id-->
                    <!--}-->
                <!--});-->
                <!--this.axios.post('Reference/content_detail', {-->
                    <!--data: {-->
                        <!--Id: row.Id-->
                    <!--}-->
                <!--}).then(res => {-->
                    <!--this.formItem.input = res.data.table.name;-->
                <!--}).catch(err => {-->
                    <!--this.$Message.error('请求超时,请稍后再试...');-->
                <!--});-->
            <!--},-->
            <!--// 删除功能-->
            <!--hangRemove (row) {-->
                <!--this.axios.post('Reference/content_delete', {-->
                    <!--data: {-->
                        <!--Id: row.Id-->
                    <!--}-->
                <!--}).then(res => {-->
                    <!--if (res.data.code === 200) {-->
                        <!--this.init();-->
                        <!--this.handleListApproveHistory();-->
                        <!--this.$Message.success(res.data.msg);-->
                    <!--} else if (res.data.code === 400) {-->
                        <!--this.$Message.error(res.data.msg);-->
                    <!--}-->
                <!--}).catch(err => {-->
                    <!--this.$Message.error('请求超时,请稍后再试...');-->
                <!--});-->
            <!--},-->
            <!--init () {-->
                <!--this.axios.post('Reference/aply_show', {-->
                <!--}).then(res => {-->
                    <!--this.data6 = res.data.table;-->
                <!--}).catch(err => {-->
                    <!--this.$Message.error('请求超时,请稍后再试...');-->
                <!--});-->
            <!--},-->
            <!--// 分页-->
            <!--// 获取历史记录信息-->
            <!--handleListApproveHistory () {-->
                <!--this.axios.post('Reference/aply_show', {-->
                <!--}).then(res => {-->
                    <!--this.ajaxHistoryData = res.data.table;-->
                    <!--this.dataCount = res.data.table.length;-->
                    <!--// 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示-->
                    <!--if (res.data.table.length < this.pageSize) {-->
                        <!--this.historyData = this.ajaxHistoryData;-->
                    <!--} else {-->
                        <!--this.historyData = this.ajaxHistoryData.slice(0,this.pageSize);-->
                    <!--}-->
                    <!--// this.data6 = res.data.table;-->
                    <!--// console.log('123', this.data6)-->
                    <!--// testData.histories = res.data.table;-->
                <!--}).catch(err => {-->
                    <!--this.$Message.error('请求超时,请稍后再试...');-->
                <!--});-->
                <!--// 保存取到的所有数据-->

            <!--},-->
            <!--changepage (index) {-->
                <!--var _start = ( index - 1 ) * this.pageSize;-->
                <!--var _end = index * this.pageSize;-->
                <!--this.historyData = this.ajaxHistoryData.slice(_start, _end);-->
            <!--}-->
        <!--}-->
    <!--};-->
<!--</script>-->

<!--<style>-->

<!--</style>-->
