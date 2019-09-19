<template>
    <Card shadow>
        <Form ref="formValidate" enctype="multipart/form-data" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="产品名字">
                <Input v-model="formValidate.list1" placeholder="请填写品牌名字"></Input>
            </FormItem>
            <FormItem label="产品内容">
                <Input v-model="formValidate.list2" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请填写品牌内容"></Input>
            </FormItem>
            <FormItem label="图片上传">
                <div style="display: flex;align-items: end;">
                    <Upload
                            ref="upload"
                            :multiple="isfalse"
                            :show-upload-list="false"
                            :before-upload="handleUpload"
                                    :on-success="uploadSuccess"
                            :data="upLoadData"
                            action="http://skin.gouzao.tech/newpro">
                        <Button type="ghost" icon="ios-cloud-upload-outline">浏览</Button>
                    </Upload>
                    <img  :src='uploadImg.url' alt="" style="width: auto;height: 150px;margin-left: 10px;">
                </div>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="HangRecall">返回</Button>
                <Button type="primary" @click="HangImg">确认增加</Button>
            </FormItem>
        </Form>
    </Card>
</template>
<script>
    import Cookies from 'js-cookie';
    import $qs from 'qs';

    export default {
        data () {
            return {
                formValidate: {
                    list1: '',
                    list2: '',
                    list3: null
                },
                ruleValidate: {},
                file: null,
                isfalse: false,
                uploadImg: {
                    url: this.$route.query.img
                },
                //
                //
                cityList: [],
                uploadList: []
            };
        },
        computed: {
            upLoadData () {
                return {
                    pro_name: this.formValidate.list1,
                    pro_info: this.formValidate.list2
                    // pro_img  : this.formValidate.list3
                };
            }
        },
        methods: {
            // 提交
            HangImg () {
                this.$refs.upload.post(this.file);

                // if (this.formValidate.list3 === null) {
                //     this.$Message.error('请选择车型');
                // } else {
                //     if (this.file === null) {
                //         this.$Message.error('请选择要修改的车辆图片');
                //     } else {
                //         this.$refs.upload.post(this.file);
                //         this.$router.push({
                //             path: '/info/info_list'
                //         });
                //     }
                // }
            },
            HangRecall () {
                this.$router.push({
                    path: '/info/info_list'
                });
            },
            handleUpload (file) { // 保存需要上传的文件
                this.file = file;
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    this.uploadImg = {
                        url: reader.result,
                        file
                    };
                };
                return false;
            },
            uploadSuccess (response, file, fileList) { // 文件上传回调 上传成功后删除待上传文件
                console.log('后端返回数据', response); // 后端返回数据
                console.log('当前上传文件', file); // 当前上传文件
                console.log('整个input file 里的文件数组', fileList); // 整个input file 里的文件数组
            }
        },
        mounted () {
        }
    };
</script>