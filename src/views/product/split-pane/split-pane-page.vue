<style lang="less">
    @import '../../../styles/loading.less';
</style>

<template>
    <div>
        <Card shadow>
            <div style="margin-bottom: 10px;">
                <Button type="info" @click="hangAdd">新增</Button>
                <!--<Button @click="handleSelectAll" :disabled="this.select.length  === 0">全选删除</Button>-->
            </div>
            <!--<Table highlight-row border :columns="historyColumns" :data="historyData" @on-selection-change="handleRowChange"></Table>-->
            <div style="text-align: right">
                <!--<Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage"></Page>-->
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
        <Col span="24">
            <div class="edittable-table-height-con">
                <can-edit-table
                        :loading="loadings"
                        refs="table4"
                        v-model="editInlineAndCellData"
                        @on-cell-change="handleCellChange"
                        @on-change="handleChange"
                        :editIncell="true"
                        :columns-list="editInlineAndCellColumn"
                ></can-edit-table>
                <div style="text-align: right;margin-top: 15px;">
                    <Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage"></Page>
                </div>
            </div>
        </Col>
    </div>
</template>

<script>
    // import tinymce from 'tinymce';
    import canEditTable from './split-pane/canEditTable.vue';
    import $qs from 'qs';

    export default {
        name: 'text-editor',
        components: {
            canEditTable
        },
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
                        title: '时间',
                        key: 'createTime'
                    },
                    {
                        title: '名字',
                        key: 'name'
                    },
                    {
                        title: '图片',
                        key: 'img',
                        width: 450,
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
                historyData: [],
                //
                //
                //
                editInlineAndCellData: [
                    {
                        name: 'Aresn',
                        sex: '男',
                        work: '前端开发'
                    },
                    {
                        name: 'Lison',
                        sex: '男',
                        work: '前端开发'
                    },
                    {
                        name: 'lisa',
                        sex: '女',
                        work: '程序员鼓励师'
                    },
                    {
                        name: '张三',
                        sex: '男',
                        work: '李四'
                    }
                ],
                editInlineAndCellColumn: [
                    {
                        title: '序号1',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '时间',
                        key: 'createTime'
                    },
                    {
                        title: '姓名',
                        align: 'center',
                        key: 'name',
                        editable: true
                    },
                    {
                        title: '图片',
                        key: 'img',
                        width: 450,
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
                                }, '修改图片'),
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
                ]
            };
        },
        created () {
            this.init();
            this.handleListApproveHistory();
        },
        computed: {
        },
        methods: {
            handleChange (val, index) {
                alert(2);
                this.$Message.success('修改了第' + (index + 1) + '行数据');
            },
            handleCellChange (val, index, key) {
                this.axios({
                    url: 'Price/update',
                    method: 'post',
                    data: $qs.stringify({
                        Id: val[index].Id,
                        name: val[index].name
                    })
                }).then(res => {
                    if (res.data.code === 200) {
                        this.$Message.success(res.data.msg);
                        this.handleListApproveHistory();
                    } else if (res.data.table === 400) {
                        this.$Message.error(res.data.msg);
                    }
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
                // console.log(val[index]);
                // console.log(index);
                // console.log(key);
                // this.$Message.success('修改了第 ' + (index + 1) + ' 行列名为 ' + key + ' 的数据');
            },
            // 新增价格表
            hangAdd () {
                this.$router.push({
                    name: 'price_add'
                });
            },
            // 多选删除
            handleSelectAll () {
                var isDelete = this.select.map(item => item.Id);
                this.axios({
                    url: 'Keyword/delete',
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
                    url: 'Keyword/Add',
                    method: 'post',
                    data: $qs.stringify({
                        name: this.formAdd.input
                    })
                }).then(res => {
                    if (res.data.code === 200) {
                        this.init();
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
                    url: 'Keyword/update',
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
            hangEdit (row) {
                this.$router.push({
                    name: 'price_edit_img',
                    query: {
                        id: row.Id
                    }
                });
            },
            // 删除功能
            hangRemove (row) {
                this.axios({
                    url: 'Price/delete',
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
                    url: 'Price/show',
                    method: 'post'
                }).then(res => {
                    this.data6 = res.data.table;
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            // 分页
            // 获取历史记录信息
            handleListApproveHistory () {
                this.axios({
                    url: 'Price/show',
                    method: 'post'
                }).then(res => {
                    this.loadings = false;
                    this.ajaxHistoryData = res.data.table;
                    this.dataCount = res.data.table.length;
                    // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
                    if (res.data.table.length < this.pageSize) {
                        this.editInlineAndCellData = this.ajaxHistoryData;
                    } else {
                        this.editInlineAndCellData = this.ajaxHistoryData.slice(0, this.pageSize);
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
                this.editInlineAndCellData = this.ajaxHistoryData.slice(_start, _end);
            }
        }
    };
</script>

<style>

</style>

<!--<template>-->
    <!--<div>-->
        <!--<Card :padding="0">-->
            <!--<div class="split-pane-con">-->
                <!--<split-pane :style="{height: '100%'}" :min="30" :max="80" @on-trigger-moving="handleMoving" direction="horizontal" v-model="triggerOffset">-->
                    <!--<div slot="left" style="height: 100%;">-->
                        <!--<split-pane :style="{height: '100%'}" direction="vertical" v-model="triggerOffsetV">-->
                            <!--<div class="introduce-left-con" slot="top" style="background: #EDE3A0;height: 100%;padding: 30px;">-->
                                <!--<h4>- 该组件可以拖动修改左右尺寸，还可以绑定v-model来设置，如设置v-model="40"即左侧40%，右侧60%</h4>-->
                                <!--<h4>- 可设置最小和最大距离，如:min="80"即向右拖动到80%处就不能再拖动</h4>-->
                                <!--<h4>- 可绑定事件@on-trigger-moving，回调函数的返回值是鼠标事件对象，同时该对象还包括两个我们自定义的变量，即atMax和atMin，即此时是否是在最大或最小距离处，类型是Boolean。来拖动右边的trigger看看吧。</h4>-->
                                <!--<h4 style="margin-bottom: 10px;">- 可使用slot="trigger"自定义拖动触发器，但有三个注意点:</h4>-->
                                <!--<h5>&#45;&#45; 样式需要设置position: absolute;</h5>-->
                                <!--<h5>&#45;&#45; 需要给trigger绑定mousedown事件，绑定的方法调用this.$refs.pane.handleMousedow(e)，e为mousedown事件的事件对象</h5>-->
                                <!--<h5>&#45;&#45; 给trigger添加:style="{width: offset + '%'}"，这里的offset是通过v-model给split-pane组件绑定的值</h5>-->
                                <!--<h4>- 其他api请看源码</h4>-->
                            <!--</div>-->
                            <!--<div slot="bottom" style="background: #A2EDB6;height: 100%;">-->
                                <!--<split-pane ref="pane" :style="{height: '100%'}" direction="horizontal" v-model="triggerOffsetMin">-->
                                    <!--<div slot="left" style="background: #EDACE2;height: 100%;"></div>-->
                                    <!--<div slot="trigger" -->
                                        <!--:style="{left: triggerOffsetMin + '%'}" -->
                                        <!--@mousedown="handleMousedown"-->
                                        <!--class="custom-trigger"></div>-->
                                    <!--<div slot="right" style="background: #A2EDB6;height: 100%;"></div>-->
                                <!--</split-pane>-->
                            <!--</div>-->
                        <!--</split-pane>-->
                    <!--</div>-->
                    <!--<div class="split-pane-right-con" slot="right" style="background: #8FB5ED;height: 100%;">-->
                        <!--<p>是否是在最小距离处： {{ atMin }}</p>-->
                        <!--<p>是否是在最大距离处： {{ atMax }}</p>-->
                    <!--</div>-->
                <!--</split-pane>-->
            <!--</div>-->
        <!--</Card>-->
    <!--</div>-->
<!--</template>-->
<!--<script>-->
<!--import splitPane from './split-pane';-->
<!--export default {-->
    <!--name: 'split-pane-page',-->
    <!--components: {-->
        <!--splitPane-->
    <!--},-->
    <!--data () {-->
        <!--return {-->
            <!--triggerOffset: 50,-->
            <!--triggerOffsetV: 70,-->
            <!--triggerOffsetMin: 40,-->
            <!--atMax: false,-->
            <!--atMin: false-->
        <!--};-->
    <!--},-->
    <!--methods: {-->
        <!--handleMousedown (e) {-->
            <!--this.$refs.pane.handleMousedown(e);-->
        <!--},-->
        <!--handleMoving (e) {-->
            <!--this.atMax = e.atMax;-->
            <!--this.atMin = e.atMin;-->
        <!--}-->
    <!--}-->
<!--};-->
<!--</script>-->
<!--<style lang="less" scoped>-->
<!--.split-pane-con{-->
    <!--width: 100%;-->
    <!--height: 89vh;-->
<!--}-->
<!--.custom-trigger{-->
    <!--position: absolute;-->
    <!--width: 40px;-->
    <!--height: 40px;-->
    <!--box-sizing: border-box;-->
    <!--top: 50%;-->
    <!--transform: translate(-50%, -50%);-->
    <!--background: white;-->
    <!--border-radius: 50%;-->
    <!--box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, .1) , 2px 2px 10px 2px rgba(0, 0, 0, .2) inset;-->
    <!--border: 1px solid #c3c3c3;-->
    <!--cursor: pointer;-->
<!--}-->
<!--.introduce-left-con h4{-->
    <!--margin-bottom: 20px;-->
<!--}-->
<!--.introduce-left-con h5{-->
    <!--margin-bottom: 10px;-->
    <!--margin-left: 20px;-->
<!--}-->
<!--.split-pane-right-con{-->
    <!--padding: 30px;-->
<!--}-->
<!--.split-pane-right-con p{-->
    <!--font-size: 26px;-->
    <!--font-weight: 700;-->
    <!--color: white;-->
<!--}-->
<!--</style>-->

