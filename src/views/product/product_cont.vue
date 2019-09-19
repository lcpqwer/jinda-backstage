<style lang="less">
    /*@import '../../../styles/loading.less';*/
</style>

<template>
    <div>
        <Card shadow>
            <div style="margin-bottom: 10px;">
                <Button type="info" @click="handAdd">新增</Button>
                <Button @click="handleSelectAll" :disabled="this.select.length  === 0">全选删除</Button>
                <Select v-model="formtype" style="width:200px" placeholder="请输入栏目名称" >
                    <Option v-for="item in cityLists" :value="item.name" :key="item.name">{{ item.name }}</Option>
                </Select>
                <Input v-model="values" placeholder="请输入图片名称" style="width: 300px" />
                <Button type="info" @click="handSeek">搜索</Button>
                <Button type="info" @click="handclick">返回</Button>
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
            <Form :model="formItem" :label-width="90">
                <FormItem label="负责人">
                    <Input v-model="formItem.Leader" placeholder=""></Input>
                </FormItem>
                <FormItem label="负责人手机号">
                    <Input v-model="formItem.phone" placeholder=""></Input>
                </FormItem>
                <FormItem label="公司名称">
                    <Input v-model="formItem.name" placeholder=""></Input>
                </FormItem>
                <FormItem label="固定电话">
                    <Input v-model="formItem.company_phone" placeholder=""></Input>
                </FormItem>
                <FormItem label="公司地址">
                    <Select v-model="formItem.shi_name" filterable placeholder="省" @on-change="hangsheng_edit">
                        <Option v-for="item in cityList_shi_edit" :value="item.shi_id" :key="item.shi_id">{{ item.shi_name }}</Option>
                    </Select>
                    <div style="margin-top: 10px;">
                        <Select v-model="formItem.city_name" filterable placeholder="市" @on-change="hangshi_edit">
                            <Option v-for="item in cityList_city_edit" :value="item.city_id" :key="item.city_id">{{ item.city_name }}</Option>
                        </Select>
                    </div>
                    <div style="margin-top: 10px;">
                        <Select v-model="formItem.dist_name" filterable placeholder="区">
                            <Option v-for="item in cityList_dist_edit" :value="item.dist_id" :key="item.dist_id">{{ item.dist_name }}</Option>
                        </Select>
                    </div>
                </FormItem>
                <FormItem label="详细地址">
                    <Input v-model="formItem.address" placeholder=""></Input>
                </FormItem>
                <FormItem label="地区">
                    <Select v-model="formItem.type">
                        <Option v-for="item in cityList" :value="item.Id" :key="item.Id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>
        <!-- 新增弹窗-->
        <Modal
                v-model="modal7"
                title="新增"
                @on-cancel="cancel"
                @on-ok="hangNew">
            <Form :model="formAdd" :label-width="90">
                <FormItem label="负责人">
                    <Input v-model="formAdd.Leader" placeholder=""></Input>
                </FormItem>
                <FormItem label="负责人手机号">
                    <Input v-model="formAdd.phone" placeholder=""></Input>
                </FormItem>
                <FormItem label="公司名称">
                    <Input v-model="formAdd.name" placeholder=""></Input>
                </FormItem>
                <FormItem label="固定电话">
                    <Input v-model="formAdd.company_phone" placeholder=""></Input>
                </FormItem>
                <FormItem label="公司地址">
                    <Select v-model="formAdd.shi_name" filterable placeholder="省" @on-change="hangsheng">
                        <Option v-for="item in cityList_shi" :value="item.shi_id" :key="item.shi_id">{{ item.shi_name }}</Option>
                    </Select>
                    <div style="margin-top: 10px;">
                        <Select v-model="formAdd.city_name" filterable placeholder="市" @on-change="hangshi">
                            <Option v-for="item in cityList_city" :value="item.city_id" :key="item.city_id">{{ item.city_name }}</Option>
                        </Select>
                    </div>
                    <div style="margin-top: 10px;">
                        <Select v-model="formAdd.dist_name" filterable placeholder="区">
                            <Option v-for="item in cityList_dist" :value="item.dist_id" :key="item.dist_id">{{ item.dist_name }}</Option>
                        </Select>
                    </div>
                </FormItem>
                <FormItem label="详细地址">
                    <Input v-model="formAdd.address" placeholder=""></Input>
                </FormItem>
                <FormItem label="地区">
                    <Select v-model="formAdd.type">
                        <Option v-for="item in cityList" :value="item.Id" :key="item.Id">{{ item.name }}</Option>
                    </Select>
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
                cityLists: [],
                values: '',
                formtype: '', // 搜索下拉
                // 表格lodding
                loadings: true,
                //
                model123: '',
                cityList123: [
                    {
                        value: '123',
                        label: 'New York'
                    }
                ],
                //
                modal6: false,
                loading: false,
                data6: [],
                modal7: false,
                formItem: {
                },
                // 新增
                formAdd: {
                },
                cityList: [],
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
                        title: '图片名称',
                        key: 'name'
                    },
                    {
                        title: '与栏目对应的TypeID',
                        key: 'type'
                    },
                    {
                        title: '栏目名称',
                        key: 'column'
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
                        title: '图片描述',
                        key: 'describe'
                    },
                    {
                        title: 'Action',
                        key: 'action',
                        width: 200,
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
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.hangImg(params.row);
                                        }
                                    }
                                }, '图片上传'),
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
                //     新增三级联动
                cityList_shi: [], // 市区
                cityList_city: [],
                cityList_dist: [],
                //     修改三级联动
                cityList_shi_edit: [], // 市区
                cityList_city_edit: [],
                cityList_dist_edit: []
            };
        },
        created () {
            this.initab();
            this.init();
            this.handleListApproveHistory();
            this.Get_shi(); // 新增省
            this.Get_shi_edit(); // 修改省

            // 直属分公司类别
            this.category();
        },
        computed: {
        },
        methods: {
            // 搜索
            handSeek () {
                this.handleListApproveHistory();
            },
            // 返回刷新
            handclick () {
                this.values = '',
                this.formtype = '',
                this.handleListApproveHistory();
            },
            // 新增价格表
            handAdd () {
                this.$router.push({
                    name: 'product_add'
                });
            },
            // 直属分公司类别
            category () {
                this.axios({
                    url: 'Reference/show',
                    method: 'post'
                }).then(res => {
                    this.cityList = res.data.table;
                    console.log(res, '1234');
                }).catch(err => {
                    // this.$Message.error('请求超时,请稍后再试...');
                });
            },
            // 修改三级联动
            hangsheng_edit () {
                this.Get_city_edit();
            },
            hangshi_edit () {
                this.Get_district_edit();
            },
            // 省
            Get_shi_edit () {
                this.axios({
                    url: 'Reference/get_shi',
                    method: 'post'
                }).then(res => {
                    this.cityList_shi_edit = res.data.table;
                    if (res.data.code === 200) {
                        this.$Message.success(res.data.msg);
                    } else if (res.data.code === 400) {
                        this.$Message.error(res.data.msg);
                    }
                }).catch(err => {
                    // this.$Message.error('请求超时,请稍后再试...');
                });
            },
            // 市
            Get_city_edit () {
                this.axios({
                    url: 'Reference/get_citys',
                    method: 'post',
                    data: $qs.stringify({
                        shi_id: this.formItem.shi_name
                    })
                }).then(res => {
                    this.cityList_city_edit = res.data.table;
                }).catch(err => {
                    // this.$Message.error('请求超时,请稍后再试...');
                });
            },
            // 区
            Get_district_edit () {
                this.axios({
                    url: 'Reference/get_district',
                    method: 'post',
                    data: $qs.stringify({
                        city_id: this.formItem.city_name
                    })
                }).then(res => {
                    this.cityList_dist_edit = res.data.table;
                }).catch(err => {
                    // this.$Message.error('请求超时,请稍后再试...');
                });
            },
            //
            //
            // 新增三级联动
            hangsheng () {
                this.Get_city();
            },
            hangshi () {
                this.Get_district();
            },
            // 省区
            Get_shi () {
                this.axios({
                    url: 'Reference/get_shi',
                    method: 'post'
                }).then(res => {
                    this.cityList_shi = res.data.table;
                    if (res.data.code === 200) {
                        this.$Message.success(res.data.msg);
                    } else if (res.data.code === 400) {
                        this.$Message.error(res.data.msg);
                    }
                }).catch(err => {
                    // this.$Message.error('请求超时,请稍后再试...');
                });
            },
            // 市区
            Get_city () {
                this.axios({
                    url: 'Reference/get_citys',
                    method: 'post',
                    data: $qs.stringify({
                        shi_id: this.formAdd.shi_name
                    })
                }).then(res => {
                    this.cityList_city = res.data.table;
                }).catch(err => {
                    // this.$Message.error('请求超时,请稍后再试...');
                });
            },
            // 县区
            Get_district () {
                this.axios({
                    url: 'Reference/get_district',
                    method: 'post',
                    data: $qs.stringify({
                        city_id: this.formAdd.city_name
                    })
                }).then(res => {
                    this.cityList_dist = res.data.table;
                }).catch(err => {
                    // this.$Message.error('请求超时,请稍后再试...');
                });
            },
            // 多选删除
            handleSelectAll () {
                var isDelete = this.select.map(item => item.Id);
                console.log(isDelete);
                this.axios({
                    url: 'Electric/Electric_delete',
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
                    url: 'Reference/directly_Add',
                    method: 'post',
                    data: $qs.stringify({
                        name: this.formAdd.name,
                        cid: this.formAdd.type,
                        phone: this.formAdd.phone,
                        company_phone: this.formAdd.company_phone,
                        shi_id: this.formAdd.shi_name,
                        city_id: this.formAdd.city_name,
                        dist_id: this.formAdd.dist_name,
                        Leader: this.formAdd.Leader,
                        address: this.formAdd.address
                    })
                }).then(res => {
                    if (res.data.code === 200) {
                        this.init();
                        this.handleListApproveHistory();
                        this.$Message.success(res.data.msg);
                        this.formAdd.name = '';
                        this.formAdd.type = '';
                        this.formAdd.phone = '';
                        this.formAdd.company_phone = '';
                        this.formAdd.shi_name = '';
                        this.formAdd.Leader = '';
                        this.formAdd.address = '';
                    } else if (res.data.code === 400) {
                        this.formAdd.input = '';
                        this.$Message.error(res.data.msg);
                    }
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            cancel () {
                this.formAdd.name = '';
                this.formAdd.type = '';
                this.formAdd.phone = '';
                this.formAdd.company_phone = '';
                this.formAdd.shi_name = '';
                this.formAdd.Leader = '';
                this.formAdd.address = '';
            },
            // 确认修改
            asyncOK () {
                // /Business/dupdate，
                this.axios({
                    url: 'Reference/directly_update',
                    method: 'post',
                    data: $qs.stringify({
                        Id: this.$route.query.id,
                        name: this.formItem.name,
                        cid: this.formItem.type,
                        phone: this.formItem.phone,
                        company_phone: this.formItem.company_phone,
                        shi_id: this.formItem.shi_name,
                        city_id: this.formItem.city_name,
                        dist_id: this.formItem.dist_name,
                        Leader: this.formItem.Leader,
                        address: this.formItem.address
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
            // 修改文字
            hangEdit (row) {
                this.$router.push({
                    name: 'product_edit',
                    query: {
                        id: row.Id
                    }
                });
            },
            // 修改图片
            hangImg (row) {
                this.$router.push({
                    name: 'product_edit_img',
                    query: {
                        id: row.Id
                    }
                });
            },
            // 删除功能
            hangRemove (row) {
                this.axios({
                    url: 'Electric/Electric_delete',
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
                    url: 'Electric/Electric_show',
                    method: 'post',
                    data: $qs.stringify({})
                }).then(res => {
                    this.loadings = false;
                    this.data6 = res.data.table;
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            initab () {
                // https://web.mobookapp.com/jinda/public/admin/Electric/show
                this.axios({
                    url: 'Electric/show',
                    method: 'post'
                }).then(res => {
                    this.cityLists = res.data.table;
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            // 分页
            // 获取历史记录信息
            handleListApproveHistory () {
                this.axios({
                    url: 'Electric/Electric_show',
                    method: 'post',
                    data: $qs.stringify({
                        name: this.values,
                        type_name: this.formtype
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
