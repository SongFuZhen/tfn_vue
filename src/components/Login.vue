<template>
    <div>
        <div class="loginDiv view" style="height: 925px;">
            <div class="wrap">
                <div class="left">
                    <h1>天福诺短信群发平台</h1>
                    <h2>链接世界的语言</h2>
                    <h3>三网合一,快速响应,7X24小时全天候服务保障</h3>
                </div>
                <div class="right">
                    <div class="right loginFrom">
                        <div class="title">用户登录</div>

                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                            <el-form-item label="" prop="userName">
                                <el-input v-model="ruleForm.userName" placeholder="请输入用户名"></el-input>
                            </el-form-item>
                            <el-form-item label="" prop="password">
                                <el-input v-model="ruleForm.password" placeholder="请输入密码"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" class="btn ivu-btn ivu-btn-primary" @click="submitForm('ruleForm')">登录</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
            <div class="coryRigth">
                <div>CopyRight 2018 天福诺网络科技有限公司 ALL Right Reserved. 沪ICP备18013034号</div>
            </div>
            <div class="contactWay">
                <div>邮箱：bd@tianfunuo.cn 电话：021-80183577</div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { Notification } from 'element-ui';
    import VueRouter from '../routes';

    export default {
        data() {
            return {
                ruleForm: {
                    userName: '',
                },
                rules: {
                    userName: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ],
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const userName = this.$refs[formName].model.userName
                        const password = this.$refs[formName].model.password

                        // var params = { 'userName': userName, 'password': password };
                        var params = { 'userName': '100011', 'password': 'BQI6ZJED7P' };
                        var instance = axios.create({
                            headers: { 'content-type': 'application/json' }
                        });
                        instance.post('http://47.96.119.87:9301/api/user/login', JSON.stringify(params)).then(function (res) {
                            var data = res.data;

                            if (data.code === 0) {
                                window.$cookies.set('tfn_cookies', data.data.token, "1d")

                                VueRouter.push('/send_message')
                            } else {
                                Notification({
                                    title: '登录失败',
                                    message: data.msg,
                                    duration: 4000
                                });
                            }
                        }).catch(function (err) {
                            Notification({
                                title: '错误',
                                message: err,
                                duration: 4000
                            });
                        });
                    } else {
                        return false;
                    }
                });
            },
        }
    }
</script>

<style>
    body {
        overflow: hidden;
    }

    .ivu-table-row-highlight td {
        background: none
    }

    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite
    }

    .xfg-table-footer-hidden .ivu-table-footer {
        height: 0
    }

    .xfg-table-footer-show .ivu-table-footer {
        line-height: 0
    }

    .loginDiv {
        background: url(../assets/timg.jpg) no-repeat 50% 50%;
        background-color: #1f2326
    }

    .loginDiv .wrap {
        width: 1060px;
        height: 500px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -530px;
        margin-top: -250px;
        overflow: hidden
    }

    .loginDiv .wrap .left {
        float: left;
        width: 429px;
        height: 132px;
        margin-left: 43px;
        margin-top: 131px
    }

    .loginDiv .wrap .left h1 {
        width: 100%;
        height: 37px;
        font-size: 37px;
        font-weight: 400;
        font-stretch: normal;
        line-height: 37px;
        letter-spacing: 4px;
        color: #fff;
        text-align: center
    }

    .loginDiv .wrap .left h2 {
        margin-top: 40px
    }

    .loginDiv .wrap .left h2,
    .loginDiv .wrap .left h3 {
        width: 100%;
        height: 36px;
        font-size: 20px;
        font-weight: 400;
        font-stretch: normal;
        line-height: 36px;
        letter-spacing: 0;
        color: #fff;
        text-align: center
    }

    .loginDiv .wrap .right {
        float: right;
        margin-right: 27px
    }

    .loginDiv .wrap .right .loginFrom {
        width: 340px;
        height: 300px;
        padding: 30px;
        background-color: #fff
    }

    .loginFrom input {
        height: 40px;
        font-size: 14px
    }

    .loginDiv .wrap .right .loginFrom .title {
        width: 100%;
        color: #353535;
        font-size: 18px;
        text-align: center;
        height: 80px;
        line-height: 80px
    }

    .loginDiv .wrap .right .loginFrom .verifi .veri-input {
        width: 170px;
        height: 40px
    }

    .loginDiv .wrap .right .loginFrom .verifi .veri-img {
        width: 116px;
        height: 40px;
        float: right;
        cursor: pointer
    }

    .loginDiv .wrap .right .loginFrom .btn {
        width: 100%;
        height: 44px;
        font-size: 16px;
        background-image: linear-gradient(0deg, #448aff, #2b6cff), linear-gradient(#1281e9, #1281e9);
        background-blend-mode: normal, normal;
        box-shadow: 0 3px 7px 0 rgba(56, 108, 192, .35);
        border-radius: 2px;
        margin-top: 20px
    }

    .loginDiv .coryRigth {
        position: absolute;
        left: 50%;
        margin-left: -367px;
        bottom: 6%;
        width: 734px;
        height: 14px;
        font-size: 14px;
        line-height: 28px;
        text-align: center;
        letter-spacing: 0;
        color: #fff
    }

    .contactWay {
        position: absolute;
        left: 50%;
        margin-left: -367px;
        bottom: 2%;
        width: 734px;
        height: 14px;
        font-size: 14px;
        line-height: 28px;
        letter-spacing: 0;
        text-align: center;
        color: #fff
    }

    #app {
        font-family: Helvetica, sans-serif;
        text-align: center;
    }
</style>