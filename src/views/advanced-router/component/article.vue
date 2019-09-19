<style lang="less">
    @import '../../../styles/common.less';
    @import './article-publish.less';
</style>

<template>
    <div>
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
        <Row>
            <Col span="18">
                <Card>
                    <!--<div>传过来的id: {{this.$route.query.id}}</div>-->
                    <Form :label-width="80">
                        <FormItem label="大标题" :error="articleError">
                            <Input v-model="articleTitle" @on-blur="handleArticletitleBlur" icon="android-list"/>
                        </FormItem>
                        <FormItem label="小标题" :error="articleError">
                            <Input v-model="subtitle" icon="android-list"/>
                        </FormItem>
                        <FormItem label="商品领域" :error="articleError">
                            <Select v-model="model1" multiple >
                                <Option v-for="item in cityList1" :value="item.Id" :key="item.Id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="关键字" :error="articleError">
                            <Select v-model="model2" multiple >
                                <Option v-for="item in cityList2" :value="item.Id" :key="item.Id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="位置" :error="articleError">
                            <Select v-model="model3" multiple>
                                <Option v-for="item in cityList3" :value="item.Id" :key="item.Id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Form>
                    <div class="margin-top-20">
                        <textarea id="articleEditor"></textarea>
                    </div>
                </Card>
            </Col>

            <Col span="6" class="padding-left-10">
                <Card>
                    <p slot="title">
                        <Icon type="paper-airplane"></Icon>
                        文章修改
                    </p>
                    <!--<p class="margin-top-10">-->
                        <!--<Icon type="android-time"></Icon>&nbsp;&nbsp;状&nbsp;&nbsp;&nbsp; 态：-->
                        <!--<Select size="small" style="width:90px" value="草稿">-->
                            <!--<Option v-for="item in articleStateList" :value="item.value" :key="item.value">{{ item.value }}</Option>-->
                        <!--</Select>-->
                    <!--</p>-->
                    <!--<p class="margin-top-10">-->
                        <!--<Icon type="eye"></Icon>&nbsp;&nbsp;公开度：&nbsp;<b>{{ Openness }}</b>-->
                        <!--<Button v-show="!editOpenness" size="small" @click="handleEditOpenness" type="text">修改</Button>-->
                        <!--<transition name="openness-con">-->
                            <!--<div v-show="editOpenness" class="openness-radio-con">-->
                                <!--<RadioGroup v-model="currentOpenness" vertical>-->
                                    <!--<Radio label="公开">-->
                                        <!--公开-->
                                        <!--<Checkbox v-show="currentOpenness === '公开'" v-model="topArticle">在首页置顶这篇文章</Checkbox>-->
                                    <!--</Radio>-->
                                    <!--<Radio label="密码">-->
                                        <!--密码-->
                                        <!--<Input v-show="currentOpenness === '密码'" style="width:120px" size="small" placeholder="请输入密码"/>-->
                                    <!--</Radio>-->
                                    <!--<Radio label="私密"></Radio>-->
                                <!--</RadioGroup>-->
                                <!--<div>-->
                                    <!--<Button type="primary" @click="handleSaveOpenness">确认</Button>-->
                                    <!--<Button type="ghost" @click="cancelEditOpenness">取消</Button>-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</transition>-->
                    <!--</p>-->
                    <!--<p class="margin-top-10">-->
                        <!--<Icon type="ios-calendar-outline"></Icon>&nbsp;&nbsp;-->
                        <!--<span v-if="publishTimeType === 'immediately'">立即发布</span><span v-else>定时：{{ publishTime }}</span>-->
                        <!--<Button v-show="!editPublishTime" size="small" @click="handleEditPublishTime" type="text">修改</Button>-->
                        <!--<transition name="publish-time">-->
                            <!--<div v-show="editPublishTime" class="publish-time-picker-con">-->
                                <!--<div class="margin-top-10">-->
                                    <!--<DatePicker @on-change="setPublishTime" type="datetime" style="width:200px;" placeholder="选择日期和时间" ></DatePicker>-->
                                <!--</div>-->
                                <!--<div class="margin-top-10">-->
                                    <!--<Button type="primary" @click="handleSavePublishTime">确认</Button>-->
                                    <!--<Button type="ghost" @click="cancelEditPublishTime">取消</Button>-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</transition>-->
                    <!--</p>-->
                    <Row class="margin-top-20" style="text-align: center;">
                        <!--<span class="publish-button">-->
                            <!--<Button @click="handlePreview">预览</Button>-->
                        <!--</span>-->
                        <!--<span class="publish-button">-->
                            <!--<Button @click="handleSaveDraft">保存草稿</Button>-->
                        <!--</span>-->
                        <!--<span class="publish-button">-->
                        <Button @click="handlePublish" :loading="publishLoading" icon="ios-checkmark" style="width:90px;" type="primary">发布</Button>
                        <!--</span>-->
                    </Row>
                </Card>
                <Input clearable placeholder="请输入关键字搜索"  v-model="searchName" style="width: 150px"/>
                <Button style="margin:5px 0px 5px 0px;width: 80px" type="info" @click="handSeek">搜索</Button>
                <Button style="margin:5px 0px 5px 5px;width: 100px;float: right" type="info" @click="add">新增</Button>
                <Table :columns="columns1" :data="data1"></Table>
                <!--//分页-->
                <div style="text-align: right">
                    <Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage"></Page>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
    import tinymce from 'tinymce';
    import $qs from 'qs';

    export default {
        name: 'artical-publish',
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
                file: null
            };
        },
        created () {
            this.tupian()
        },
        methods: {
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
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            //分页
            changepage (index) {
                var _start = (index - 1) * this.pageSize;
                var _end = index * this.pageSize;
                this.data1 = this.ajaxHistoryData.slice(_start, _end);
            },
            handleUpload (file) { // 上传文件前的事件钩子
                // 选择文件后 这里判断文件类型 保存文件 自定义一个keyid 值 方便后面删除操作
                let keyID = Math.random().toString().substr(2);
                file['keyID'] = keyID;
                // 保存文件到总展示文件数据里
                this.file.push(file);
                // 保存文件到需要上传的文件数组里
                this.uploadFile.push(file);
                // 返回 falsa 停止自动上传 我们需要手动上传
                return false;
            },
            delectFile (keyID) { // 删除文件
                // 删除总展示文件里的当前文件
                this.file = this.file.filter(item => {
                    return item.name != name;
                });
                // 删除需要上传文件数据里的当前文件
                this.uploadFile = this.uploadFile.filter(item => {
                    return item.KeyID != keyID;
                });
            },
            upload () { // 上传文件
                for (let i = 0; i < this.uploadFile.length; i++) {
                    let item = this.file[i];
                    this.$refs.upload.post(item);
                }
            },
            //
            //
            //
            //
            //
            //
            //
            //
            handleArticletitleBlur () {
                if (this.articleTitle.length !== 0) {
                    // this.articleError = '';
                    localStorage.articleTitle = this.articleTitle; // 本地存储文章标题
                    if (!this.articlePathHasEdited) {
                        let date = new Date();
                        let year = date.getFullYear();
                        let month = date.getMonth() + 1;
                        let day = date.getDate();
                        this.fixedLink = window.location.host + '/' + year + '/' + month + '/' + day + '/';
                        this.articlePath = this.articleTitle;
                        this.articlePathHasEdited = true;
                        this.showLink = true;
                    }
                } else {
                    // this.articleError = '文章标题不可为空哦';
                    this.$Message.error('文章标题不可为空哦');
                }
            },
            editArticlePath () {
                this.editLink = !this.editLink;
                this.editPathButtonType = this.editPathButtonType === 'ghost' ? 'success' : 'ghost';
                this.editPathButtonText = this.editPathButtonText === '编辑' ? '完成' : '编辑';
            },
            handleEditOpenness () {
                this.editOpenness = !this.editOpenness;
            },
            handleSaveOpenness () {
                this.Openness = this.currentOpenness;
                this.editOpenness = false;
            },
            cancelEditOpenness () {
                this.currentOpenness = this.Openness;
                this.editOpenness = false;
            },
            handleEditPublishTime () {
                this.editPublishTime = !this.editPublishTime;
            },
            handleSavePublishTime () {
                this.publishTimeType = 'timing';
                this.editPublishTime = false;
            },
            cancelEditPublishTime () {
                this.publishTimeType = 'immediately';
                this.editPublishTime = false;
            },
            setPublishTime (datetime) {
                this.publishTime = datetime;
            },
            setClassificationInAll (selectedArray) {
                this.classificationFinalSelected = selectedArray.map(item => {
                    return item.title;
                });
                localStorage.classificationSelected = JSON.stringify(this.classificationFinalSelected); // 本地存储所选目录列表
            },
            setClassificationInOffen (selectedArray) {
                this.classificationFinalSelected = selectedArray;
            },
            handleAddNewTag () {
                this.addingNewTag = !this.addingNewTag;
            },
            createNewTag () {
                if (this.newTagName.length !== 0) {
                    this.articleTagList.push({value: this.newTagName});
                    this.addingNewTag = false;
                    setTimeout(() => {
                        this.newTagName = '';
                    }, 200);
                } else {
                    this.$Message.error('请输入标签名');
                }
            },
            cancelCreateNewTag () {
                this.newTagName = '';
                this.addingNewTag = false;
            },
            canPublish () {
                if (this.articleTitle.length === 0) {
                    this.$Message.error('请输入文章标题');
                    return false;
                } else {
                    return true;
                }
            },
            handlePreview () {
                if (this.canPublish()) {
                    if (this.publishTimeType === 'immediately') {
                        let date = new Date();
                        let year = date.getFullYear();
                        let month = date.getMonth() + 1;
                        let day = date.getDate();
                        let hour = date.getHours();
                        let minute = date.getMinutes();
                        let second = date.getSeconds();
                        localStorage.publishTime = year + ' 年 ' + month + ' 月 ' + day + ' 日 -- ' + hour + ' : ' + minute + ' : ' + second;
                    } else {
                        localStorage.publishTime = this.publishTime; // 本地存储发布时间
                    }
                    localStorage.content = tinymce.activeEditor.getContent();
                    this.$router.push({
                        name: 'preview'
                    });
                }
            },
            handleSaveDraft () {
                if (!this.canPublish()) {
                    //
                }
            },
            handlePublish () {
                // Article/update
                this.axios({
                    url: 'Article/update',
                    method: 'post',
                    data: $qs.stringify({
                        Id: this.$route.query.id,
                        title: this.articleTitle,
                        subtitle: this.subtitle,
                        keywordId: this.model2,
                        businessId: this.model1,
                        positionId: this.model3,
                        content: tinymce.activeEditor.getContent()
                    })
                }).then(res => {
                    if (res.data.code === 200) {
                        this.$Message.success(res.data.msg);
                        if (this.canPublish()) {
                            this.publishLoading = true;
                            setTimeout(() => {
                                this.publishLoading = false;
                                this.$Notice.success({
                                    title: '保存成功',
                                    desc: '文章《' + this.articleTitle + '》保存成功'
                                });
                            }, 1000);
                        }
                        this.$Message.success(res.data.msg);
                        this.$router.push({
                            name: 'draggable-list'
                        });
                    } else if (res.data.code === 400) {
                        this.$Message.error(res.data.msg);
                    }
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            handleSelectTag () {
                localStorage.tagsList = JSON.stringify(this.articleTagSelected); // 本地存储文章标签列表
            },
            //  位置
            Article () {
                this.axios({
                    url: 'Position/show',
                    method: 'post',
                    data: $qs.stringify({
                    })
                }).then(res => {
                    this.cityList3 = res.data.table;
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            // 商品领域
            Business () {
                this.axios({
                    url: 'Business/show',
                    method: 'post'
                }).then(res => {
                    this.cityList1 = res.data.table;
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            // 关键字
            Keyword () {
                this.axios({
                    url: 'Keyword/show',
                    method: 'post'
                }).then(res => {
                    this.cityList2 = res.data.table;
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            init () {
                this.axios({
                    url: 'Article/detail',
                    method: 'post',
                    data: $qs.stringify({
                        Id: this.$route.query.id
                    })
                }).then(res => {
                    // console.log('大标题', this.articleTitle);
                    this.articleTitle = res.data.table.title;
                    this.subtitle = res.data.table.subtitle;
                    this.model1 = res.data.table.business;
                    this.model2 = res.data.table.keyword;
                    this.model3 = res.data.table.position;
                    tinyMCE.activeEditor.setContent(res.data.table.content);
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            }
        },
        computed: {
            completeUrl () {
                let finalUrl = this.fixedLink + this.articlePath;
                localStorage.finalUrl = finalUrl; // 本地存储完整文章路径
                return finalUrl;
            }
        },
        mounted () {
            this.init();
            this.Keyword();
            this.Business();
            this.Article();
            tinymce.init({
                selector: '#articleEditor',
                tinymceHtml: '请输入内容',
                branding: false,
                elementpath: false,
                height: 600,
                language: 'zh_CN.GB2312',
                menubar: 'edit insert view format table tools',
                theme: 'modern',
                plugins: [
                    'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
                    'searchreplace visualblocks visualchars code fullscreen fullpage',
                    'insertdatetime media nonbreaking save table contextmenu directionality',
                    'emoticons paste textcolor colorpicker textpattern imagetools codesample'
                ],
                toolbar1: ' newnote print fullscreen preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
                autosave_interval: '20s',
                image_advtab: true,
                table_default_styles: {
                    width: '100%',
                    borderCollapse: 'collapse'
                }
            });
        },
        destroyed () {
            tinymce.get('articleEditor').destroy();
        }
    };
</script>
