<!--上传图片-->
<template>
  <div>
    <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
      <template v-if="item.status === 'finished'">
        <img :src="item.url">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
    </div>
    <Upload ref="upload"
            :show-upload-list="false"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="2000"
            :data="uploadparameter"
            :default-file-list="defaultList"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            type="drag"
            action="//package-9beats.oss-cn-zhangjiakou.aliyuncs.com/" style="display: inline-block;width:58px;">
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal :title="imgName" v-model="visible">
      <img :src="oss_cdn+'/' + imgName" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
    import axios from 'axios';
    export default {
        data () {
            return {
                oss_cdn: '',
                imgName: '',
                visible: false,
                uploadList: [],
                uploadparameter: { },
                upload: {
                    fileUrl: '',
                    file: ''
                },
                defaultList: [
                    {
                        'name': 'admim_store1/1539659928987.png',
                        'url': 'https://cdnninebeats.wedomusic.cn/admim_store1/1539659928987.png'
                    }
                ]
            };
        },
        created () {
            this.oss_aaa();
        },
        methods: {
            oss_aaa () {
                axios({
                    url: 'http://192.168.8.100/jinda/public/admin/Article/add',
                    method: 'post',
                    data: {
                        title: '名称',
                        token: 'eyJ0eXBlIjoiSldUIiwiYWxnIjoiSFMyNTYifQ==.eyJpc3MiOiJEbyIsImF1ZCI6IkFwaSIsIm1lY2hhbmlzbSI6MTEsInNjaG9vbCI6MCwiZXhwaXJlZCI6MTU0MjI1MTkwNSwidXNlciI6MX0=.764c6e06fdc79797f6c8fe2c0c37f30193a04182f437ae0ec2c485f2f486e5f5'
                    },
                    transformRequest: [function (data) {
                        let ret = '';
                        for (let it in data) {
                            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
                        }
                        return ret;
                    }]
                })
                    .then(res => {
                        this.oss_cdn = res.data.cdn;
                        this.uploadparameter.OSSAccessKeyId = res.data.accessid;
                        this.uploadparameter.policy = res.data.policy;
                        this.uploadparameter.signature = res.data.signature;
                        this.uploadparameter.success_action_status = 200;
                        this.uploadparameter.key = new Date().getTime();
                    });
            },

            handleView (name) {
                console.log(name, 'name');
                this.imgName = name;
                this.visible = true;
            },
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (res, file) {
                file.url = this.oss_cdn + '/' + file.name;
                file.name = file.name;
            },
            handleFormatError (file) {
                this.$Message.info('上传图片格式必须为jpg,jpeg,png');
            },
            handleMaxSize (file) {
                this.$Message.info('上传图片尺寸不大于2M');
            },
            handleBeforeUpload () {
                this.uploadparameter.key = event.name;
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Message.info('最多可上传5张图片');
                }
                return check;
            }
        },
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
        }
    };
</script>
<style>
  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>