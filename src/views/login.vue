<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import $qs from 'qs';

export default {
    data () {
        return {
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    // login/login
                    this.axios({
                        url: 'https://www.jinda365.com/jinda/public/admin/login/login',
                        method: 'post',
                        data: $qs.stringify({
                            username: this.form.userName,
                            password: this.form.password
                        })
                    }).then(res => {
                        console.log(res);
                        if (res.data.code === 200) {
                            this.$Message.success(res.data.msg);
                            Cookies.set('user', this.form.userName);
                            Cookies.set('password', this.form.password);
                            sessionStorage.setItem('shopid', res.data.shop);
                            // this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                            // if (this.form.userName === this.form.userName) {
                            //     Cookies.set('access', 0);
                            // } else {
                            //     Cookies.set('access', 1);
                            // }
                            this.$router.push({
                                name: 'home_index'
                            });
                            // this.$router.push({
                            //     name: 'user'
                            // });
                        } else if (res.data.code === 400) {
                            this.$Message.error(res.data.msg);
                        }
                    }).catch(err => {
                        this.$Message.error('请求超时,请稍后再试...');
                    });
                }
            });
        }
    }
};
</script>

<style>

</style>
