<template>
    <div class="body">
        <el-form ref="form" :rules="rules" :model="loginForm" class="loginContainer" label-width="80px">
            <h3 class="loginTitle">
                欢迎登录订餐系统
            </h3>
            <el-form-item label="用户名" prop="uname">
                <el-input v-model="loginForm.uname" placeholder="请输入用户名" show-name></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="loginForm.password" placeholder="请输入密码" show-password></el-input>
            </el-form-item>
            <el-button type="primary" @click="submitLogin">登录</el-button>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data(){
            return{
                loginForm:{
                    uname:"",
                    password:"",
                },
                rules:{
                    uname:[{required:true,message:"请输入用户名",trigger:"blur"},
                        { min: 2, max: 14, message: '长度在 2 到 14 个字符', trigger: 'blur' }
                    ],
                    password:[{required:true,message:"请输入密码",trigger:"blur"},
                        { min: 6,  message: '密码长度要大于6', trigger: 'blur' }],
                }
            }
        },
        methods:{
            submitLogin(){
                this.$refs["form"].validate((valid) => {
                    if (!valid){
                        return
                    }
                    this.$http.post("/login",this.loginForm).then((res)=>{
                        if (res.data != null && res.data !== ''){
                            //将用户名存储到session中
                            console.log(res.data)
                            sessionStorage.setItem("uname",this.loginForm.uname)
                            sessionStorage.setItem("role",res.data.role)
                            sessionStorage.setItem("password",res.data.password)
                            if (res.data.role == "员工") {
                                this.$router.push("/employeeHome")
                            }
                            if (res.data.role == "部门经理") {
                                this.$router.push("/managerHome")
                                console.log("部门经理")
                            }
                            if (res.data.role == "管理员") {
                                this.$router.push("/adminHome")
                            }

                        } else{
                            this.$message.error('账号或密码错误');
                        }
                    })
                });
            }
        }
    }
</script>

<style scoped>
    .loginContainer{
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background: aliceblue;
        border:1px solid blueviolet;
        box-shadow: 0 0 25px #f885ff;
    }
    .loginTitle{
        margin: 0px auto 48px auto;
        text-align: center;
        font-size: 40px;
    }
    .body{
        background-image: url("../assets/images/login.jpg");
        width:100%;
        height:100%;
        position:fixed;
        background-size:100% 100%;
    }
</style>