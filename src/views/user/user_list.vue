<style lang="less">
    /*@import '../../../styles/loading.less';*/
</style>

<template>
    <div>
            <Card shadow>
            <Table :loading="loadings" highlight-row border :columns="historyColumns" :data="historyData"></Table>
            <div style="text-align: right">
                <Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage"></Page>
            </div>
        </Card>
        <Modal
                v-model="modal6"
                title="详情"
                @on-ok="ok"
                width="550"
                :loading="loading">
            <!--<div>-->
                <!--<span class="expand-key" style="font-weight: 700">微头像 : </span>-->
                <!--<img style="width: 100%;height: 250px;object-fit: cover" :src=comm_img alt="">-->
            <!--</div>-->
            <div >
                <div>
                    <span class="expand-key" style="font-weight: 700">姓名 : </span>
                    <span class="expand-value">{{ rows.name }}</span>

                    <span class="expand-key" style="font-weight: 700">性别 : </span>
                    <span class="expand-value">{{  rows.sex }}</span>

                    <span class="expand-key" style="font-weight: 700">星座 : </span>
                    <span class="expand-value">{{  rows.constellation }}</span>
                </div>
                <div>
                    <span class="expand-key" style="font-weight: 700">国家 : </span>
                    <span class="expand-value">{{ rows.country }}</span>

                    <span class="expand-key" style="font-weight: 700">城市 : </span>
                    <span class="expand-value">{{  rows.province }}</span>

                    <span class="expand-key" style="font-weight: 700">地区 : </span>
                    <span class="expand-value">{{ rows.city }}</span>(微信读取)
                </div>
                <div>
                    <span class="expand-key" style="font-weight: 700">身份证 : </span>
                    <img style="width: 100%;height: 250px;" :src=rows.id_card alt="">
                </div>

                <div style="display: flex;justify-content: space-between;">
                    <div style="width: 50%;">
                        <!--<span class="expand-key" style="font-weight: 700">自拍 : </span>-->
                        <div class="expand-key" >自拍 : </div>
                        <img style="width: 100%;height: 250px;" :src=rows.selfie alt="">
                    </div>
                    <div style="width: 48%;margin-top: 14px;">
                        <span class="expand-key" style="font-weight: 700">生日 : </span>
                        <span class="expand-value">{{ rows.birthday }}</span>
                        <div>
                            <span class="expand-key" style="font-weight: 700">爱好 : </span>
                            <span class="expand-value" v-for="item in rows.Hobbies">
                                <span>{{item}},</span>
                            </span>
                        </div>
                        <div>
                            <span class="expand-key" style="font-weight: 700">偏好 : </span>
                            <span class="expand-value" v-for="item in rows.Preferences">
                                <span>{{  item }},</span>
                            </span>
                        </div>

                        <div>
                            <span class="expand-key" style="font-weight: 700">星座 : </span>
                            <span class="expand-value" v-for="item in rows.Constellations">
                                <span>{{  item }},</span>
                            </span>
                        </div>
                        <div>
                            <span class="expand-key" style="font-weight: 700">标签 : </span>
                            <span class="expand-value" v-for="item in rows.Labels">
                                <span>{{  item }},</span>
                            </span>
                        </div>
                        <div>
                            <span class="expand-key" style="font-weight: 700">标签 : </span>
                            <span class="expand-value" v-for="item in rows.Preferences">
                                <span>{{  item }},</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
    // import tinymce from 'tinymce';
    // import Info from './info.vue';
    import $qs from 'qs';
    export default {
        name: 'text-editor',
        data () {
            return {
                num: [
                    'a',
                    'b'
                ],
                rows: {},
                recently: '', // 最低金额
                Optimal: '', // 优享金额
                type: '',
                car: {},
                comm_img: '',
                loading: true,
                // 表格lodding
                loadings: true,
                modal6: false,
                //
                //
                //    分页
                ajaxHistoryData: [],
                // 初始化信息总条数
                dataCount: 0,
                // 每页显示多少条
                pageSize: 5,
                historyColumns: [
                    {
                        title: '用户头像',
                        key: 'img',
                        width: 220,
                        render: (h, params) => {
                            return h('img', {
                                style: {
                                    width: '100%',
                                    height: '120px'
                                },
                                attrs: {
                                    src: params.row.avatarUrl, style: 'width: 250px;height: 100px;'
                                },
                                on: {
                                    click: () => {
                                        this.hangImg(1, params.row);
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: '用户名',
                        key: 'nickName'
                    },
                    {
                        title: '手机号',
                        key: 'phone'
                    },
                    {
                        title: '点数',
                        key: 'point'
                    },
                    {
                        title: '唯一标识',
                        key: 'id_string'
                    },
                    {
                        title: '认证状态',
                        algin: 'center',
                        width: 105,
                        key: 'authentication',
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    color: params.row.authentication === 1 ? 'green' : params.row.authentication === 2 ? 'orange' : ''
                                }
                            }, params.row.authentication === 1 ? '以认证' : params.row.authentication === 2 ? '未认证' : '');
                        }
                    },
                    {
                        title: '用户情况',
                        algin: 'center',
                        width: 105,
                        key: 'blacklist',
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    color: params.row.blacklist === 1 ? 'default' : params.row.blacklist === 2 ? 'green' : ''
                                }
                            }, params.row.blacklist === 1 ? '黑名单用户' : params.row.blacklist === 2 ? '正常用户' : '');
                        }
                    },
                    {
                        title: 'Action',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            let authentication = params.row.authentication;
                            if (authentication === 1) {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'info',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.hangInfo(params.row);
                                            }
                                        }
                                    }, '详细信息'),
                                    h('Button', {
                                        props: {
                                            type: params.row.blacklist === 1 ? 'success' : params.row.blacklist === 2 ? 'primary' : '',
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
                                    }, params.row.blacklist === 1 ? '取消黑名单' : params.row.blacklist === 2 ? '黑名单' : '')
                                ]);
                            } else {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: params.row.blacklist === 1 ? 'success' : params.row.blacklist === 2 ? 'primary' : '',
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
                                    }, params.row.blacklist === 1 ? '取消黑名单' : params.row.blacklist === 2 ? '黑名单' : '')
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
            hangInfo (row) {
                this.modal6 = true;
                this.comm_img = row.avatarUrl;
                this.rows = row;
            },
            ok () {
                this.modal6 = false;
            },
            hangImg (type, row) {
                this.type = type;
                this.modal6 = true;
                if (type === 1) {
                    this.car = row.car;
                    this.comm_img = row.img;
                } else if (type === 2) {
                    this.comm_img = row.Drive_img;
                } else if (type === 3) {
                    this.comm_img = row.travel_img;
                }
            },
            // 修改
            hangEdit (row) {
                this.axios({
                    url: 'https://www.mesonychid.com/taxi5/admin/user/blacklist',
                    method: 'post',
                    data: $qs.stringify({
                        id: row.id
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
                    url: 'https://www.mesonychid.com/taxi5/admin/user/show',
                    method: 'post'
                }).then(res => {
                    console.log(res);
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
