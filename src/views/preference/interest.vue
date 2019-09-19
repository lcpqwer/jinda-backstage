<style lang="less">
</style>

<template>
    <div>
        <Card shadow>
            <div style="margin-bottom: 15px;">
                <span>车辆审核最低的金额为<Input type="number" @on-blur="HangRecently" v-model="recently" placeholder="输入最低金额..." style="width: 150px" />（万）</span>
            </div>
            <div style="margin-bottom: 10px;">
                <Button type="info" @click="modal7 = true">新增</Button>
                <Button @click="handleSelectAll" :disabled="this.select.length  === 0">全选删除</Button>
            </div>
            <Table :loading="loadings" highlight-row border :columns="historyColumns" :data="historyData" @on-selection-change="handleRowChange"></Table>
            <div style="text-align: right">
                <Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage"></Page>
            </div>
        </Card>
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
                recently: '',
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
                        title: 'Date',
                        key: 'time'
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
            this.handleListApproveHistory();
        },
        computed: {
        },
        methods: {
            // 修改
            HangRecently () {
                this.axios({
                    url: 'https://www.mesonychid.com/taxi5/admin/Setting/hobby',
                    method: 'post',
                    data: $qs.stringify({
                        hobby_type2: this.recently
                    })
                }).then(res => {
                    if (res.data.code === 200) {
                        this.handleListApproveHistory();
                        this.$Message.success(res.data.msg);
                    } else if (res.data.code === 400) {
                        this.$Message.success('未进行任何操作');
                    }
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            // 多选删除
            handleSelectAll () {
                var isDelete = this.select.map(item => item.Id);
                this.axios({
                    url: 'https://www.mesonychid.com/taxi5/admin/hobby/delete',
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
            // 新增功能
            hangNew () {
                this.axios({
                    url: 'https://www.mesonychid.com/taxi5/admin/hobby/add',
                    method: 'post',
                    data: $qs.stringify({
                        name: this.formAdd.input,
                        type: 2,
                        system: 1
                    })
                }).then(res => {
                    if (res.data.code === 200) {
                        this.handleListApproveHistory();
                        this.$Message.success(res.data.msg);
                        this.formAdd.input = '';
                        this.formAdd.type = '';
                    } else if (res.data.code === 400) {
                        this.formAdd.input = '';
                        this.formAdd.type = '';
                        this.$Message.error(res.data.msg);
                    }
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            // 删除功能
            hangRemove (row) {
                this.axios({
                    url: 'https://www.mesonychid.com/taxi5/admin/hobby/delete',
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
            // 分页
            // 获取历史记录信息
            handleListApproveHistory () {
                this.axios({
                    url: 'https://www.mesonychid.com/taxi5/admin/hobby/show',
                    method: 'post',
                    data: $qs.stringify({
                        system: 1,
                        type: 2
                    })
                }).then(res => {
                    this.loadings = false;
                    this.ajaxHistoryData = res.data.table;
                    this.dataCount = res.data.table.length;
                    this.recently = res.data.info.hobby_type2;
                    // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
                    if (res.data.table.length < this.pageSize) {
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
