<template>
    <div>
        <el-form :model="empForm" ref="empForm" :rules="rules1" style="width: 40%">
            <el-form-item style="width: 400px" label="员工编号" :label-width="formLabelWidth" prop="empno">
                <el-input v-model="empForm.empno" autocomplete="off" readonly></el-input>
            </el-form-item>
            <el-form-item  style="width: 400px" label="姓名" :label-width="formLabelWidth" prop="ename">
                <el-input v-model="empForm.ename" autocomplete="off" readonly></el-input>
            </el-form-item>
            <el-form-item style="width: 400px" label="性别" :label-width="formLabelWidth"  prop="sex">
                <el-input v-model="empForm.sex" autocomplete="off" readonly></el-input>
            </el-form-item>
            <el-form-item style="width: 400px" label="电话" :label-width="formLabelWidth" prop="tel">
                <el-input v-model="empForm.tel" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item style="width: 400px" label="工作" :label-width="formLabelWidth" prop="job">
                <el-input v-model="empForm.job" autocomplete="off" readonly></el-input>
            </el-form-item>
            <el-form-item  style="width: 400px" label="部门" :label-width="formLabelWidth" prop="deptno">
                <el-input v-model="empForm.dname" autocomplete="off" readonly></el-input>
            </el-form-item>
            <el-form-item  style="width: 400px" >
                <el-button type="primary" @click="saveEmp">保存</el-button>
                <el-button type="primary" @click="dialogFormVisible = true">修改密码</el-button>
            </el-form-item>
        </el-form>
        <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="旧密码" prop="oldpass">
                    <el-input type="password" v-model="ruleForm.oldpass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="pass">
                    <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="updatePwd('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Index",
        data(){
            var checkOldPass = (rule, value, callback) => {
                if (value !== sessionStorage.getItem("password")) {
                    callback(new Error('旧密码不正确'));
                } else {
                    callback();
                }
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            return{
                dialogFormVisible:false,
                uname: sessionStorage.getItem("uname"),
                deptList: [],
                empForm:{
                    empno:"",
                    ename: "",
                    sex: "",
                    tel: "",
                    job: "",
                    dname:"",
                    oldPwd: sessionStorage.getItem("password"),
                    newPwd:""
                },
                ruleForm: {
                    oldpass: '',
                    pass: '',
                    checkPass: '',
                },
                rules: {
                    oldpass: [
                        { validator: checkOldPass, trigger: 'blur' }
                    ],
                    pass: [
                        { validator: validatePass, trigger: 'blur' },
                        { min: 6,  message: '密码长度要大于6', trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],

                },
                rules1: {
                    tel: [
                        {required: true, message: '请输入联系方式', trigger: 'blur'},
                        {pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                            message: '请正确输入手机号', trigger: 'blur'}
                    ],
                },
                formLabelWidth: '120px',
            }
        },
        methods: {
            //获取员工信息
            getEmp() {
                this.$http.get("/getEmp",{
                        params: {
                            uname: this.uname
                        }
                    }).then(res=>{
                    this.empForm = res.data
                    sessionStorage.setItem("dname",this.empForm.dname)
                    sessionStorage.setItem("empno",this.empForm.empno)
                }).catch(()=>{
                    this.$message.error("获取个人信息失败,请联系管理员")
                })
            },
            saveEmp() {
                this.$refs["empForm"].validate((valid) => {
                    if (valid) {
                        this.$http.post("/updateEmp", this.empForm).then(res => {
                            // console.log(res)
                            if (res.data == "success") {
                                this.$message.success("修改个人信息成功")
                                this.getEmp()
                            } else {
                                this.$message.error("修改个人信息失败,请联系管理员")
                            }
                        }).catch(() => {
                            this.$message.error("修改个人信息失败,请联系管理员")
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            updatePwd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.empForm.newPwd = this.ruleForm.pass
                        this.$http.post("/updateEmpPwd",this.empForm).then(res=>{
                            if (res.data == "success") {
                                this.$message.success("修改密码成功，请重新登录")
                                sessionStorage.removeItem("uname")
                                this.$router.push("/login")
                            } else {
                                this.$message.error("修改密码失败,请联系管理员")
                            }
                        }).catch(()=>{
                            this.$message.error("修改密码失败,请联系管理员")
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }

        },
        created() {
            this.getEmp()
        }
    }
</script>

<style scoped>

</style>