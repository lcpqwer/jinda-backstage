<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
    .home-main .ivu-card-body .ivu-table-cell {
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
</style>
<template>
    <div class="home-main">
        <Row :gutter="10">
            <Col :md="24" :lg="8">
                <Row class-name="home-page-row1" :gutter="10">
                    <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                        <Card>
                            <Row type="flex" class="user-infor">
                                <Col span="8">
                                    <Row class-name="made-child-con-middle" type="flex" align="middle">
                                        <img class="avator-img" :src="avatorPath" />
                                    </Row>
                                </Col>
                                <Col span="16" style="padding-left:6px;">
                                    <Row class-name="made-child-con-middle" type="flex" align="middle">
                                        <div>
                                            <b class="card-user-infor-name">Admin,欢迎登陆</b>
                                            <p>当前登录时间: {{Times}}</p>
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                            <!--<div class="line-gray"></div>-->
                            <!--<Row class="margin-top-8">-->
                                <!--<Col span="8"><p class="notwrap">上次登录时间:</p></Col>-->
                                <!--<Col span="16" class="padding-left-8">2017.09.12-13:32:20</Col>-->
                            <!--</Row>-->
                            <!--<Row class="margin-top-8">-->
                                <!--<Col span="8"><p class="notwrap">上次登录地点:</p></Col>-->
                                <!--<Col span="16" class="padding-left-8">北京</Col>-->
                            <!--</Row>-->
                        </Card>
                    </Col>
                    <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                        <Card>
                            <p slot="title" class="card-title">
                                <Icon type="android-checkbox-outline"></Icon>
                                访问记录
                            </p>
                            <!--<a type="text" slot="extra" @click.prevent="addNewToDoItem">-->
                                <!--<Icon type="plus-round"></Icon>-->
                            <!--</a>-->
                            <!--<Modal-->
                                <!--v-model="showAddNewTodo"-->
                                <!--title="添加新的待办事项"-->
                                <!--@on-ok="addNew"-->
                                <!--@on-cancel="cancelAdd">-->
                                <!--<Row type="flex" justify="center">-->
                                    <!--<Input v-model="newToDoItemValue" icon="compose" placeholder="请输入..." style="width: 300px" />-->
                                <!--</Row>-->
                                <!--<Row slot="footer">-->
                                    <!--<Button type="text" @click="cancelAdd">取消</Button>-->
                                    <!--<Button type="primary" @click="addNew">确定</Button>-->
                                <!--</Row>-->
                            <!--</Modal>-->
                            <!--<div class="to-do-list-con">-->
                                <!--<div v-for="(item, index) in toDoList" :key="index" class="to-do-item">-->
                                    <!--<to-do-list-item :content="item.title"></to-do-list-item>-->
                                <!--</div>-->
                                <Table :loading="loadings" highlight-row border :columns="columns3" :data="feedback3"></Table>
                            <!--</div>-->
                        </Card>
                    </Col>
                </Row>
            </Col>
            <Col :md="24" :lg="16">
                <Row :gutter="5">
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="user_created_count"
                            :end-val="count.createUser"
                            iconType="android-person-add"
                            color="#2d8cf0"
                            intro-text="总访问量"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="visit_count"
                            :end-val="count.visit"
                            iconType="ios-eye"
                            color="#64d572"
                            :iconSize="50"
                            intro-text="今日浏览量"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="collection_count"
                            :end-val="count.collection"
                            iconType="upload"
                            color="#ffd572"
                            intro-text="ip访问总数"
                        ></infor-card>
                    </Col>
                    <!--<Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">-->
                        <!--<infor-card-->
                            <!--id-name="transfer_count"-->
                            <!--:end-val="count.transfer"-->
                            <!--iconType="shuffle"-->
                            <!--color="#f25e43"-->
                            <!--intro-text="今日服务调用量"-->
                        <!--&gt;</infor-card>-->
                    <!--</Col>-->
                </Row>
                <Col :style="{marginBottom: '10px'}">
                    <Row>
                        <Card :padding="0">
                            <p slot="title" class="card-title">
                                <Icon type="map"></Icon>
                                用户反馈
                            </p>
                            <div class="map-con">
                                <Table :loading="loadings" highlight-row border :columns="columns1" :data="feedback1"></Table>
                            </div>
                        </Card>
                    </Row>
                </Col>
                <Row>
                    <Card :padding="0">
                        <p slot="title" class="card-title">
                            <Icon type="map"></Icon>
                            招募反馈
                        </p>
                        <div class="map-con">
                            <Table :loading="loadings" highlight-row border :columns="columns2" :data="feedback2"></Table>
                        </div>
                    </Card>
                </Row>
            </Col>
        </Row>
        <!-- <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-map"></Icon>
                        上周每日来访量统计
                    </p>
                    <div class="data-source-row">
                        <visite-volume></visite-volume>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-pulse-strong"></Icon>
                        数据来源统计
                    </p>
                    <div class="data-source-row">
                        <data-source-pie></data-source-pie>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="8">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-wifi"></Icon>
                        各类用户服务调用变化统计
                    </p>
                    <div class="data-source-row">
                        <user-flow></user-flow>
                    </div>
                </Card>
            </Col>
        </Row> -->
        <!-- <Row class="margin-top-10">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-shuffle-strong"></Icon>
                    上周每日服务调用量(万)
                </p>
                <div class="line-chart-con">
                    <service-requests></service-requests>
                </div>
            </Card>
        </Row> -->
        <!-- <Row class="margin-top-10">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-shuffle-strong"></Icon>
                    游戏内实时上升最快敏感词
                </p>
                <div class="treemap-con">
                    <tree-Map></tree-Map>
                </div>
            </Card>
        </Row> -->
    </div>
</template>

<script>
import $qs from 'qs';
import cityData from './map-data/get-city-value.js';
import homeMap from './components/map.vue';
import dataSourcePie from './components/dataSourcePie.vue';
import visiteVolume from './components/visiteVolume.vue';
import serviceRequests from './components/serviceRequests.vue';
import treeMap from './components/treeMap.vue';
import userFlow from './components/userFlow.vue';
import countUp from './components/countUp.vue';
import inforCard from './components/inforCard.vue';
import mapDataTable from './components/mapDataTable.vue';
import toDoListItem from './components/toDoListItem.vue';

export default {
    name: 'home',
    components: {
        homeMap,
        dataSourcePie,
        visiteVolume,
        serviceRequests,
        userFlow,
        countUp,
        inforCard,
        mapDataTable,
        toDoListItem,
        treeMap
    },
    data () {
        return {
            // 表格lodding
            loadings: true,
            toDoList: [
                {
                    title: '去iView官网学习完整的iView组件'
                },
                {
                    title: '去iView官网学习完整的iView组件'
                },
                {
                    title: '去iView官网学习完整的iView组件'
                },
                {
                    title: '去iView官网学习完整的iView组件'
                },
                {
                    title: '去iView官网学习完整的iView组件'
                }
            ],
            tables: {},
            count: {
                visit: 14,
                createUser: 12,
                collection: 15,
                transfer: 39503498
            },
            cityData: cityData,
            showAddNewTodo: false,
            newToDoItemValue: '',
            //
            //
            //
            //
            //
            //
            columns1: [
                {
                    title: 'Data',
                    key: 'createTime'
                },
                {
                    title: 'Name',
                    key: 'name'
                },
                {
                    title: 'Phone',
                    key: 'phone'
                },
                {
                    title: 'Content',
                    key: 'content'
                }
            ],
            columns2: [
                {
                    title: 'Data',
                    key: 'createTime'
                },
                {
                    title: 'Name',
                    key: 'name'
                },
                {
                    title: 'Phone',
                    key: 'phone'
                },
                {
                    title: 'Title',
                    key: 'title'
                }
            ],
            columns3: [
                {
                    title: 'Data',
                    key: 'Time'
                },
                {
                    title: 'Ip',
                    key: 'ip'
                }
            ],
            feedback1: [],
            feedback2: [],
            feedback3: [],
            Times: ''
        };
    },
    computed: {
        avatorPath () {
            return localStorage.avatorImgPath;
        }
    },
    methods: {
        addNewToDoItem () {
            this.showAddNewTodo = true;
        },
        // addNew () {
        //     if (this.newToDoItemValue.length !== 0) {
        //         this.toDoList.unshift({
        //             title: this.newToDoItemValue
        //         });
        //         setTimeout(() => {
        //             this.newToDoItemValue = '';
        //         }, 200);
        //         this.showAddNewTodo = false;
        //     } else {
        //         this.$Message.error('请输入待办事项内容');
        //     }
        // },
        // cancelAdd () {
        //     this.showAddNewTodo = false;
        //     this.newToDoItemValue = '';
        // },
        createUsers () {
            // http://192.168.8.100/jinda/public/admin/Index/show
            this.axios({
                url: 'Index/show',
                method: 'POST',
                data: $qs.stringify({
                })
            }).then(res => {
                this.loadings = false;
                this.tables = res.data.table;
                this.count.visit = res.data.table.Today_find;
                this.count.createUser = res.data.table.All_find;
                this.count.collection = res.data.table.Todayip_find;
                this.feedback1 = res.data.table.feedback;
                this.feedback2 = res.data.table.recruitment_feedback;
                this.feedback3 = res.data.table.ip_Record;
                this.Times = res.data.table.Times;
            }).catch(err => {
                this.$Message.error('请求超时,请稍后再试...');
            });
        }
    },
    mounted () {
        this.createUsers();
        // http://tongji.gouzao.tech/tongji/public/index/index/fastest_rise
    }
};
</script>
