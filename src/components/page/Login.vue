<template>
    <el-col class="login-wrap">
        <el-col class="ms-login">
            <el-col class="ms-title">数据统计展示系统</el-col>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p class="login-tips">Tips : 用户名和密码随便填。</p>
            </el-form>
        </el-col>
    </el-col>
</template>

<script>
    import {mapActions} from 'vuex'
    import items from '../common/items'
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: 'yangyichao',
                    password: 'eWFuZ3lpY2hhbw=='
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },

                loading: false
            }
        },
        methods: {
            ...mapActions({add_Routes: 'add_Routes'}),
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$api.FINANCE_DEVELOPER_API.get('LOGIN', this.ruleForm).then((res) => {
                            if (res.code === 0) {
                                // 将路由信息，菜单信息，用户信息存到sessionStorage里
                                if (!localStorage.getItem('routes')) {
                                    localStorage.setItem('routes', JSON.stringify(items))
                                }
                                this.add_Routes(items) //触发vuex里的增加路由
                                this.$router.push('/dashboard')
                            } else {
                                this.$message.error("用户名或密码错误！")
                            }
                        })
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #6f7180;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>