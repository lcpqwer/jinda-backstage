k74
<style lang="less">
</style>

<template>
    <div>
        <Card shadow>
            <div style="margin-bottom: 10px;">
                <Button type="info" @click="hangAdd">新增</Button>
                <Button @click="handleSelectAll" :disabled="this.select.length  === 0">全选删除</Button>
                <DatePicker type="daterange" format="yyyy-MM-dd" v-model="valueTime" @on-change="handleChange" split-panels placeholder="Select date" style="width: 200px"></DatePicker>
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
    import $qs from 'qs';

    export default {
        name: 'text-editor',
        data () {
            return {
                // 表格lodding
                loadings: true,
                valueTime: null,
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
                        title: '时间',
                        align: 'center',
                        key: 'createTime'
                    },
                    {
                        title: '大标题',
                        align: 'center',
                        key: 'title'
                    },
                    {
                        title: '小标题',
                        align: 'center',
                        key: 'subtitle'
                    },
                    {
                        title: '图片',
                        key: 'img',
                        width: 300,
                        align: 'center',
                        render: (h, params) => {
                            return h('img', {
                                attrs: {
                                    src: params.row.img, style: 'width: 250px;height: 100px;'
                                }
                            });
                        }
                    },
                    {
                        title: '状态',
                        align: 'center',
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'info',
                                    size: 'small'
                                },
                                style: {
                                    display: (params.row.state === true) ? 'inline-block' : 'none'
                                }
                            }, '首页展示中');
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
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
                                            this.handlecrop(params.row);
                                        }
                                    }
                                }, '上传图片'),
                                h('Button', {
                                    props: {
                                        type: params.row.state === true ? 'error' : 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.handState(params.row);
                                        }
                                    }
                                }, params.row.state === true ? '取消展示' : '点击展示'),
                                // h('Button', {
                                //     props: {
                                //         type: 'primary',
                                //         size: 'small'
                                //     },
                                //     style: {
                                //         marginRight: '5px'
                                //     },
                                //     on: {
                                //         click: () => {
                                //             this.handarticle(params.row);
                                //         }
                                //     }
                                // }, '编辑图片'),
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
                                }, '文章编辑'),
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
            // 编辑状态
            handState (row) {
                this.axios({
                    url: 'Article/banner',
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
                    // this.$Message.error('请求超时,请稍后再试...');
                    this.$Message.error('请选择要删除的数据');
                });
            },
            // 编辑图片
            // handarticle (row) {
            //     this.$router.push(
            //         {
            //             path: '/article_edit_img',
            //             query: {
            //                 id: row.Id
            //             }
            //         }
            //     );
            // },
            // 上传图片
            handlecrop (row) {
                this.$router.push(
                    {
                        path: '/article_add_img',
                        query: {
                            id: row.Id
                        }
                    }
                );
            },
            // 新增文章 跳转页面
            hangAdd () {
                this.$router.push(
                    {
                        // path: '/form/artical-publish'
                        path: '/article_add'
                    }
                );
            },
            handleChange (daterange) {
                this.valueTime = daterange;
                this.handleListApproveHistory();
            },
            // 多选删除
            handleSelectAll () {
                var isDelete = this.select.map(item => item.Id);
                this.axios({
                    url: 'Article/delete',
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
                    url: 'Business/Add',
                    method: 'post',
                    data: $qs.stringify({
                        name: this.formAdd.input
                    })
                }).then(res => {
                    if (res.data.code === 200) {
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
            //  编辑页面跳转
            hangEdit (row) {
                this.$router.push(
                    {
                        path: '/article',
                        query: {
                            id: row.Id
                        }
                    }
                );
            },
            // 删除功能
            hangRemove (row) {
                this.axios({
                    url: 'Article/delete',
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
                    url: 'Article/show',
                    method: 'post',
                    data: $qs.stringify({
                        time: this.valueTime
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
                    url: 'Article/show',
                    method: 'post',
                    data: $qs.stringify({
                        time: this.valueTime
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
