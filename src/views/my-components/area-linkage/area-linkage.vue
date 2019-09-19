<style lang="less">
    @import '../../../styles/loading.less';
</style>

<template>
    <div>
        <Card shadow>
            <div style="margin-bottom: 10px;">
                <Button type="info" @click="modal7 = true">新增</Button>
                <Button @click="handleSelectAll" :disabled="this.select.length  === 0">全选删除</Button>
            </div>
            <Table :loading="loadings" highlight-row border :columns="historyColumns" :data="historyData" @on-selection-change="handleRowChange"></Table>
            <div style="text-align: right">
                <Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage"></Page>
            </div>
        </Card>
        <!-- 修改弹窗-->
        <Modal
                v-model="modal6"
                title="修改"
                :loading="loading"
                @on-ok="asyncOK">
            <Form :model="formItem" :label-width="80">
                <FormItem label="Name">
                    <Input v-model="formItem.input" placeholder=""></Input>
                </FormItem>
            </Form>
        </Modal>
        <!-- 新增弹窗-->
        <Modal
                v-model="modal7"
                title="新增"
                @on-ok="hangNew">
            <Form :model="formAdd" :label-width="80">
                <!--<FormItem label="Date">-->
                <!--<DatePicker type="datetime" v-model="formItem.data" placeholder="Select date and time" style="width: 200px"></DatePicker>-->
                <!--</FormItem>-->
                <FormItem label="Name">
                    <Input v-model="formAdd.input" placeholder=""></Input>
                </FormItem>
            </Form>
        </Modal>
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
                modal6: false,
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
                        title: 'Date',
                        key: 'createTime'
                    },
                    {
                        title: 'Name',
                        key: 'name'
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
                                            this.hangEdit(params.row);
                                        }
                                    }
                                }, '修改'),
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
                historyData: []
            };
        },
        created () {
            this.init();
            this.handleListApproveHistory();
        },
        computed: {
        },
        methods: {
            // 多选删除
            handleSelectAll () {
                var isDelete = this.select.map(item => item.Id);
                console.log(isDelete);
                this.axios({
                    url: 'Position/delete',
                    method: 'post',
                    data: $qs.stringify({
                        Id: isDelete
                    })
                }).then(res => {
                    if (res.data.code === 200) {
                        this.init();
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
            // 新增功能
            hangNew () {
                this.axios({
                    url: 'Position/Add',
                    method: 'post',
                    data: $qs.stringify({
                        name: this.formAdd.input
                    })
                }).then(res => {
                    if (res.data.code === 200) {
                        // this.init();
                        this.handleListApproveHistory();
                        this.$Message.success(res.data.msg);
                        this.formAdd.input = '';
                    } else if (res.data.code === 400) {
                        this.formAdd.input = '';
                        this.$Message.error(res.data.msg);
                    }
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            // 确认修改
            asyncOK () {
                // /Business/dupdate，
                this.axios({
                    url: 'Position/update',
                    method: 'post',
                    data: $qs.stringify({
                        Id: this.$route.query.id,
                        name: this.formItem.input
                    })
                }).then(res => {
                    if (res.data.code === 200) {
                        this.init();
                        this.handleListApproveHistory();
                        this.$Message.success(res.data.msg);
                    } else if (res.data.code === 400) {
                        this.$Message.error(res.data.msg);
                    }
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            // 修改前的数据渲染
            hangEdit (row) {
                this.modal6 = true;
                this.$router.push({
                    query: {
                        id: row.Id
                    }
                });
                this.axios({
                    url: 'Position/detail',
                    method: 'post',
                    data: $qs.stringify({
                        Id: row.Id
                    })
                }).then(res => {
                    this.formItem.input = res.data.table.name;
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            // 删除功能
            hangRemove (row) {
                this.axios({
                    url: 'Position/delete',
                    method: 'post',
                    data: $qs.stringify({
                        Id: row.Id
                    })
                }).then(res => {
                    if (res.data.code === 200) {
                        this.init();
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
                    url: 'Position/show',
                    method: 'post'
                }).then(res => {
                    this.loadings = false;
                    this.data6 = res.data.table;
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            // 分页
            // 获取历史记录信息
            handleListApproveHistory () {
                this.axios({
                    url: 'Position/show',
                    method: 'post'
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
                    // this.data6 = res.data.table;
                    // console.log('123', this.data6)
                    // testData.histories = res.data.table;
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
