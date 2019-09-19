<template>
    <div>
        <Input clearable placeholder="请输入关键字搜索"  v-model="searchName" style="width: 200px"/>
        <Button style="margin:5px 0px 5px 0px;width: 80px" type="info" @click="handSeek">搜索</Button>
        <Button style="margin:5px 0px 5px 5px;width: 100px" type="info" @click="add">新增</Button>
        <Table :columns="columns1" :data="data1"></Table>
        <!--//分页-->
        <div style="text-align: right">
            <Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage"></Page>
        </div>
        <Modal
                v-model="modal10"
                title="新增"
                @on-ok="ok"
                :show-upload-list="false"
                @on-cancel="cancel"
                :loading="loading1">
            <Form :model="img" :label-width="80">
                <FormItem label="照片">
                    <Upload
                            action="https://www.jinda365.com/jinda/public/admin/oss/insert"
                            :data="img"
                            ref="upload"
                            :multiple="multiple"
                            :format="['jpg','jpeg','png']"
                            :show-upload-list="false"
                            :before-upload="handleBeforUpload1"
                            :on-success="handleSuccess1">
                        <Button icon="ios-cloud-upload-outline">点击上传</Button>
                    </Upload>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import $qs from 'qs';
    export default {
        data () {
            return {
                //    分页
                ajaxHistoryData: [],
                // 初始化信息总条数
                dataCount: 0,
                // 每页显示多少条
                pageSize: 10,
                searchName:'',
                multiple: true,
                modal10:false,
                loading1: true,
                img: {
                    image:[]
                },
                columns1: [
                    {
                        title: '图片',
                        key: 'img',
                        render: (h, params) => {
                            // console.log(params.row)
                            return h('img', {
                                style: {
                                    width: '100px'
                                },
                                attrs: {
                                    src: params.row.img, style: 'width: 100px;height: 100px'
                                }
                            });
                        }
                    },
                    {
                        title: '图片名称',
                        key: 'name',
                        width: 150
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        marginBottom: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.delete(params.row);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                data1: [],
                imgs:[],
                htmls: '',
                articleTitle: '',
                articleError: '',
                showLink: false,
                fixedLink: '',
                articlePath: '',
                articlePathHasEdited: false,
                editLink: false,
                editPathButtonType: 'ghost',
                editPathButtonText: '编辑',
                articleStateList: [{value: '草稿'}, {value: '等待复审'}],
                editOpenness: false,
                Openness: '公开',
                currentOpenness: '公开',
                topArticle: false,
                publishTime: '',
                publishTimeType: 'immediately',
                editPublishTime: false, // 是否正在编辑发布时间
                articleTagSelected: [], // 文章选中的标签
                articleTagList: [], // 所有标签列表
                classificationList: [],
                classificationSelected: [], // 在所有分类目录中选中的目录数组
                offenUsedClass: [],
                offenUsedClassSelected: [], // 常用目录选中的目录
                classificationFinalSelected: [], // 最后实际选择的目录
                publishLoading: false,
                addingNewTag: false, // 添加新标签
                newTagName: '', // 新建标签名
                //
                //
                //
                //
                //
                cityList1: [],
                cityList2: [],
                cityList3: [],
                subtitle: '',
                model1: [],
                model2: [],
                model3: [],
                //
                //
                //
                //
                //    上传图片
                file: null,
            };
        },
        created () {
            this.tupian()
        },
        methods:{
            handSeek(){
                this.tupian()
            },
            add () {
                this.modal10 = true
            },
            handleBeforUpload1 (file) {
                console.log(file)
                this.img.image = file
                this.modal10=false
                this.tupian()
            },
            handleSuccess1(response){
                console.log(response.url)
                if(response.code===200){
                    this.tupian()
                }
                // this.url1 = response.url
            },
            ok () {
                this.modal10=false
                this.tupian()
            },
            cancel () {
                this.modal10=false
            },
            tupian () {
                this.axios({
                    url: 'https://www.jinda365.com/jinda/public/admin/oss/show',
                    method: 'post',
                    data: $qs.stringify({
                        name: this.searchName
                    })
                }).then(res => {
                    // console.log(res,'3212334')
                    this.ajaxHistoryData = res.data.url;
                    this.dataCount = res.data.url.length;
                    // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
                    if (res.data.url.length < this.pageSize) {
                        // this.historyData = this.ajaxHistoryData;
                        // console.log(res.data.url,'3212334')
                        this.data1 = res.data.url;
                    } else {
                        this.data1 = this.ajaxHistoryData.slice(0, this.pageSize);
                    }
                    // this.data1=res.data.url
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            delete(row){
                console.log(row,'12345')
                this.axios({
                    url: 'https://www.jinda365.com/jinda/public/admin/oss/delete',
                    method: 'post',
                    data: $qs.stringify({
                        Id: row.Id
                    })
                }).then(res => {
                    // console.log(res,'3212334')
                    this.tupian()
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            //分页
            changepage (index) {
                var _start = (index - 1) * this.pageSize;
                var _end = index * this.pageSize;
                this.data1 = this.ajaxHistoryData.slice(_start, _end);
            }
        }
    }
</script>

<style scoped>

</style>