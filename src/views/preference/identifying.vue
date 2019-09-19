<style lang="less">
</style>

<template>
    <div>
        <Card shadow>
            <div style="margin-bottom: 10px;">
                <Button type="info" @click="modal7 = true">新增</Button>
                <Button @click="add">123123</Button>
<!--                <Button @click="handleSelectAll" :disabled="this.select.length  === 0">全选删除</Button>-->
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
            <Form ref="formValidate" :model="formAdd" :rules="ruleValidate" :label-width="80" enctype="multipart/form-data">
                <FormItem label="产品名字" prop="input">
                    <Input v-model="formAdd.input" placeholder="请填写品牌名字"></Input>
                </FormItem>
                <FormItem label="产品内容" prop="con">
                    <Input v-model="formAdd.con" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请填写品牌内容"></Input>
                </FormItem>
                <FormItem label="产品图片" prop="img">
                    <Input v-model="formAdd.img" type="file" placeholder="请上传品牌图片"></Input>
                </FormItem>
            </Form>
<!--            <Form :model="formAdd" :label-width="100" :rules="ruleValidate">-->
<!--                &lt;!&ndash;<FormItem label="Date">&ndash;&gt;-->
<!--                &lt;!&ndash;<DatePicker type="datetime" v-model="formItem.data" placeholder="Select date and time" style="width: 200px"></DatePicker>&ndash;&gt;-->
<!--                &lt;!&ndash;</FormItem>&ndash;&gt;-->
<!--                <FormItem label="产品名字">-->
<!--                    <Input v-model="formAdd.input" placeholder=""></Input>-->
<!--                </FormItem>-->
<!--                <FormItem label="产品名字">-->
<!--                    <Input v-model="formAdd.con" type="textarea" placeholder="Enter something..."></Input>-->
<!--                </FormItem>-->
<!--                <FormItem label="产品图片">-->
<!--                    <Input v-model="formAdd.img" type="file"></Input>-->
<!--                </FormItem>-->
<!--                <FormItem label="Name" prop="name">-->
<!--                    <Input v-model="formAdd.con" placeholder="Enter your name"></Input>-->
<!--                </FormItem>-->
<!--            </Form>-->
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
                    input: '',
                    con: '',
                    img: ''
                },
                ruleValidate: {
                    input: [
                        { required: true, message: '品牌名字不能为空', trigger: 'blur' }
                    ],
                    con: [
                        { required: true, message: '品牌内容不能为空', trigger: 'blur' }
                    ],
                    img: [
                        { required: true, message: '品牌图片不能为空', trigger: 'blur' }
                    ]
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
                        title: '产品名字',
                        key: 'proname'
                    },
                    {
                        title: '产品内容',
                        key: 'content'
                    },
                    {
                        title: '产品图片',
                        key: 'aimg',
                        width: 220,
                        render: (h, params) => {
                            return h('img', {
                                style: {
                                    width: '100%',
                                    height: '120px'
                                },
                                attrs: {
                                    src: 'http://skin.gouzao.tech' + params.row.aimg, style: 'width: 250px;height: 100px;'
                                },
                                on: {
                                    click: () => {
                                        this.hangImg(1, params.row);
                                    }
                                }
                            });
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
            add () {
                this.$router.push({
                    path: '/info_list',
                    query: {
                    }
                });
            },
            // 修改
            HangRecently () {
                this.axios({
                    url: 'https://www.mesonychid.com/taxi5/admin/Setting/hobby',
                    method: 'post',
                    data: $qs.stringify({
                        hobby_type4: this.recently
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
                    url: 'http://skin.gouzao.tech/newpro',
                    method: 'post',
                    data: $qs.stringify({
                        pro_name: this.formAdd.input,
                        pro_info: this.formAdd.con,
                        pro_img: this.formAdd.img
                    })
                }).then(res => {
                    console.log('ssssssscddddd');
                    // if (res.data.code === 200) {
                    //     this.handleListApproveHistory();
                    //     this.$Message.success(res.data.msg);
                    //     this.formAdd.input = '';
                    //     this.formAdd.type = '';
                    // } else if (res.data.code === 400) {
                    //     this.formAdd.input = '';
                    //     this.formAdd.type = '';
                    //     this.$Message.error(res.data.msg);
                    // }
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
                    url: 'http://skin.gouzao.tech/prolist',
                    method: 'post'
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
