<style lang="less">
    @import '../../../styles/common.less';
    @import './image-editor.less';
</style>

<template>
    <div class="image-editor">
        <!--<div>-->
            <!--文章新增页面-->
            <!--<div>传过来的id: {{this.$route.query.id}}</div>-->
        <!--</div>-->
        <Row :gutter="10">
            <Col span="12">
                <Card>
                    <p slot="title">
                        <Icon type="qr-scanner"></Icon>
                        新增文章图片
                    </p>
                    <div style="margin-bottom: 15px">
                        <Button @click="hangshous">直接上传图片</Button>  <Button @click="hangishou">上传需要裁剪的图片</Button>
                    </div>
                    <div v-show="shous">
                        <Upload
                                action='https://www.jinda365.com/jinda/public/admin/Article/add_imgs'
                                :data=num
                                :on-success=hangsucceed>
                            <Button icon="ios-cloud-upload-outline">上传图片</Button>
                        </Upload>
                    </div>
                    <div  v-show="ishou">
                        <Row :gutter="10">
                            <Col span="14" class="image-editor-con1">
                                <div class="cropper">
                                    <img id="cropimg1" alt="" :src="imgs">
                                </div>
                            </Col>
                            <Col span="10" class="image-editor-con1">
                                <Row type="flex" justify="center" align="middle" class="image-editor-con1-preview-con">
                                    <div id="preview1"></div>
                                </Row>
                                <div class="image-editor-con1-btn-con margin-top-10">
                                    <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange1" id="fileinput1" class="fileinput" />
                                    <label class="filelabel" for="fileinput1"><Icon type="image"></Icon>&nbsp;选择图片</label>
                                    <span><Button @click="handlecrop1" type="primary" icon="crop">裁剪</Button></span>
                                </div>
                                <Modal
                                        @on-ok="hangImg"
                                        v-model="option1.showCropedImage">
                                    <p slot="header">预览裁剪之后的图片</p>
                                    <img :src="option1.cropedImg" alt="" v-if="option1.showCropedImage" style="width: 100%;">
                                </Modal>
                            </Col>
                        </Row>

                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import Cropper from 'cropperjs';
    import './cropper.min.css';
    import $qs from 'qs';

    export default {
        name: 'image-editor',
        data () {
            return {
                shous: false,
                ishou: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                cropper1: {},
                option1: {
                    showCropedImage: false,
                    cropedImg: ''
                },
                cropper2: {},
                cropdata2: {
                    x: '',
                    y: '',
                    w: '',
                    h: '',
                    deg: '',
                    scaleX: '',
                    scaleY: ''
                },
                cropper3: {},
                option3: {
                    showCropedImage: false,
                    cropedImg: ''
                },
                // imgs: 'http://img2.imgtn.bdimg.com/it/u=1220656001,756766299&fm=26&gp=0.jpg'
                imgs: '',
                num: {
                    Id: this.$route.query.id
                }
            };
        },
        computed: {
            urlss () {
                return this.$route.query.id;
            }
        },
        methods: {
            hangshous () {
                this.shous = true;
                this.ishou = false;
            },
            hangishou () {
                this.shous = false;
                this.ishou = true;
            },
            hangsucceed (response, file, fileList) {
                if (response.code === 200) {
                    this.$router.push({
                        name: 'draggable-list'
                    });
                }
            },
            hangImg () {
                let file = this.cropper1.getCroppedCanvas().toDataURL();
                this.option1.cropedImg = file;
                this.axios({
                    url: 'Article/add_img',
                    method: 'post',
                    data: $qs.stringify({
                        Id: this.$route.query.id,
                        img: file
                    })
                }).then(res => {
                    if (res.data.code === 200) {
                        this.$Message.success(res.data.msg);
                        this.$router.push({
                            name: 'draggable-list'
                        });
                    }
                }).catch(err => {
                    this.$Message.error('请求超时,请稍后再试...');
                });
            },
            handleChange1 (e) {
                let file = e.target.files[0];
                let reader = new FileReader();
                reader.onload = () => {
                    this.cropper1.replace(reader.result);
                    reader.onload = null;
                };
                reader.readAsDataURL(file);
            },
            handlecrop1 () {
                let file = this.cropper1.getCroppedCanvas().toDataURL();
                // console.log('123', file)
                this.option1.cropedImg = file;
                this.option1.showCropedImage = true;
            },
            handlerotatel () {
                if (document.getElementById('fileinput3').files[0]) {
                    this.cropper3.rotate(-30);
                }
            },
            handlerotater () {
                if (document.getElementById('fileinput3').files[0]) {
                    this.cropper3.rotate(90);
                }
            },
            handlezooml () {
                if (document.getElementById('fileinput3').files[0]) {
                    this.cropper3.zoom(0.1);
                }
            },
            handlezooms () {
                if (document.getElementById('fileinput3').files[0]) {
                    this.cropper3.zoom(-0.1);
                }
            },
            handlescalex () {
                if (document.getElementById('fileinput3').files[0]) {
                    this.cropper3.scaleX(-this.cropper3.getData().scaleX);
                }
            },
            handlescaley () {
                if (document.getElementById('fileinput3').files[0]) {
                    this.cropper3.scaleY(-this.cropper3.getData().scaleY);
                }
            },
            handleChange3 (e) {
                let file = e.target.files[0];
                let reader = new FileReader();
                reader.onload = () => {
                    this.cropper3.replace(reader.result, true); // 这里必须设置true这个参数，否则旋转会有bug
                    reader.onload = null;
                };
                reader.readAsDataURL(file);
            },
            handlemovel () {
                if (document.getElementById('fileinput3').files[0]) {
                    this.cropper3.move(-10, 0);
                }
            },
            handlemover () {
                if (document.getElementById('fileinput3').files[0]) {
                    this.cropper3.move(10, 0);
                }
            },
            handlemoveu () {
                if (document.getElementById('fileinput3').files[0]) {
                    this.cropper3.move(0, -10);
                }
            },
            handlemoved () {
                if (document.getElementById('fileinput3').files[0]) {
                    this.cropper3.move(0, 10);
                }
            },
            handlecrop3 () {
                let file = this.cropper3.getCroppedCanvas().toDataURL();
                this.option3.cropedImg = file;
                this.option3.showCropedImage = true;
            }
        },
        mounted () {
            console.log(this.$route.query.id);
            let img1 = document.getElementById('cropimg1');
            this.cropper1 = new Cropper(img1, {
                dragMode: 'move',
                preview: '#preview1',
                restore: false,
                center: false,
                highlight: false,
                cropBoxMovable: false,
                toggleDragModeOnDblclick: false
            });

            // let img2 = document.getElementById('cropimg2');
            // this.cropper2 = new Cropper(img2, {
            //     dragMode: 'move',
            //     restore: false,
            //     center: false,
            //     highlight: false,
            //     cropBoxMovable: false,
            //     toggleDragModeOnDblclick: false
            // });
            // img2.addEventListener('crop', (e) => {
            //     this.cropdata2.x = parseInt(e.detail.x);
            //     this.cropdata2.y = parseInt(e.detail.y);
            //     this.cropdata2.w = parseInt(e.detail.width);
            //     this.cropdata2.h = parseInt(e.detail.height);
            //     this.cropdata2.deg = parseInt(e.detail.rotate);
            //     this.cropdata2.scaleX = parseInt(e.detail.scaleX);
            //     this.cropdata2.scaleY = parseInt(e.detail.scaleY);
            // });

            // let img3 = document.getElementById('cropimg3');
            // this.cropper3 = new Cropper(img3, {
            //     dragMode: 'move',
            //     preview: '#preview3',
            //     restore: false,
            //     center: false,
            //     highlight: false,
            //     cropBoxMovable: false,
            //     toggleDragModeOnDblclick: false
            // });
        }
    };
</script>