<template>
    <div>
        <!--头部工具栏-->
        <el-row>
            <el-col :span="16">
                <el-form :inline="true" :model="queryMap" class="demo-form-inline">
                    <el-form-item label="员工姓名">
                        <el-input v-model="queryMap.ename" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="所属部门">
                        <el-select v-model="queryMap.deptno" clearable>
                            <el-option v-for="dept in deptList" :label="dept.dname" :value="dept.deptno"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>

            <el-col :span="8">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-plus" @click="openAdd">新增</el-button>
                    <el-button type="primary" icon="el-icon-edit" @click="openEdit">修改</el-button>
                    <el-button type="primary" icon="el-icon-delete" @click="delEmp">删除</el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <!--员工列表-->
        <el-table
                :data="empList"
                stripe
                empty-text="当前没有员工信息"
                height="559px"
                @selection-change="handleSelectionChange"
                style="width: 100%">
            <el-table-column
                    type="selection"
                    width="80"
                    align="center">
            </el-table-column>
            <el-table-column
                    type="index"
                    label="序号"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="empno"
                    label="员工编号"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="ename"
                    label="员工姓名"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="sex"
                    label="性别"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="tel"
                    label="联系方式"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="job"
                    label="工作"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="dname"
                    label="所属部门"
                    width="150">
            </el-table-column>
            <el-table-column
                    label="">
                <template slot-scope="scope">
                    <el-button @click="initPwd(scope.row)" type="text">重置密码</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryMap.page"
                :page-sizes="[5, 10, 20, 50]"
                :page-size="queryMap.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <!--新增员工对话框-->
        <el-dialog title="新增员工" :visible.sync="addFormVisible" width="30%">
            <el-form
                    :model="addForm"
                    :rules="rules"
                    ref="addForm"
                    label-width="100px"
                    class="demo-ruleForm">
                <el-form-item label="员工姓名" prop="ename">
                    <el-input v-model="addForm.ename" maxlength="20" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="addForm.sex">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="联系方式" prop="tel">
                    <el-input v-model="addForm.tel"></el-input>
                </el-form-item>
                <el-form-item label="所属部门" prop="deptno">
                    <el-select v-model="addForm.deptno" style="width: 100%;" clearable>
                        <el-option v-for="dept in deptList" :label="dept.dname" :value="dept.deptno"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工作" prop="job">
                    <el-input v-model="addForm.job"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-input v-model="addForm.role"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">关 闭</el-button>
                <el-button type="primary" @click="saveAdd">保 存</el-button>
            </div>
        </el-dialog>
        <!--修改员工信息对话框-->
        <el-dialog title="修改员工" :visible.sync="editFormVisible" width="30%">
            <el-form :model="editForm" :rules="rules2" ref="editForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="员工编号" prop="empno" >
                    <!--:disabled="true"表示该输入框禁用-->
                    <el-input v-model="editForm.empno" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="员工姓名" prop="ename">
                    <el-input v-model="editForm.ename" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="editForm.sex">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="联系方式" prop="tel">
                    <el-input v-model="editForm.tel"></el-input>
                </el-form-item>
                <el-form-item label="所属部门" prop="deptno">
                    <el-select v-model="editForm.deptno" style="width: 100%;" clearable>
                        <el-option v-for="dept in deptList" :label="dept.dname" :value="dept.deptno"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工作" prop="job">
                    <el-input v-model="editForm.job"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-input v-model="editForm.role"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">关 闭</el-button>
                <el-button type="primary" @click="saveEdit">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "EmpList",
        data() {
            //自定义验证规则，用于验证部门名称是否重复
            var validateName = (rule, value, callback) => {
                this.$http.get("checkEname/" + value).then(res => {
                    if (res.data) {//返回true，表示部门名称重复
                        callback(new Error("姓名重复"));
                    } else {
                        callback();
                    }
                }).catch(() => {
                    callback(new Error("姓名验证请求失败，请联系管理员"))
                })
            };
            return {
                //封装查询条件
                queryMap: {
                    ename: "",//员工姓名
                    deptno: "",//所属部门
                    page: 1,//页码
                    limit: 10//每页条数
                },
                //封装部门信息
                deptList: [],
                //表格数据，即员工信息
                empList:[],
                //总条数
                total: 0,
                //控制新增对话框的显隐，值为false表示隐藏
                addFormVisible: false,
                //绑定新增表单的数据
                addForm: {
                    ename: "",//员工姓名
                    sex: "男",//性别
                    tel: "",//联系方式
                    deptno: "", //所属部门
                    job: "",//工作
                    role:""
                },
                //控制修改对话框的显隐，值为false表示隐藏
                editFormVisible: false,
                //绑定修改表单的数据
                editForm: {
                    empno: "",//员工编号
                    ename: "",//员工姓名
                    sex: "",//性别
                    tel: "",//联系方式
                    deptno: "", //所属部门
                    job: "",//职位
                    role:""
                },
                //存储表格选中的数据
                multipleSelection: [],
                //新增和修改表单页面的验证规则
                rules: {
                    ename: [
                        {required: true, message: '请输入员工姓名', trigger: 'blur'},
                        {validator: validateName, trigger: 'blur' }
                    ],
                    sex: [
                        {required: true, message: '请选择性别', trigger: 'change' }
                    ],
                    tel: [
                        {required: true, message: '请输入联系方式', trigger: 'blur'},
                        {pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                            message: '请正确输入手机号', trigger: 'blur'}
                    ],
                    deptno: [
                        {required: true, message: '请选择所属部门', trigger: 'change' }
                    ],
                    job: [
                        {required: true, message: '请填写工作', trigger: 'change' }
                    ]
                },
                rules2: {
                    sex: [
                        {required: true, message: '请选择性别', trigger: 'change'}
                    ],
                    tel: [
                        {required: true, message: '请输入联系方式', trigger: 'blur'},
                        {
                            pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                            message: '请正确输入手机号', trigger: 'blur'
                        }
                    ],
                    deptno: [
                        {required: true, message: '请选择所属部门', trigger: 'change'}
                    ],
                    job: [
                        {required: true, message: '请填写工作', trigger: 'change'}
                    ]
                },
                //入职日期只能选择今天及今天之后的时间
                pickerOptions: {
                    disabledDate(time) {//传入time时间，返回该时间是否不可选择
                        return time.getTime() < Date.now() - 1000 * 60 * 60 * 24; //只能选择今天及今天之后的日期
                    }
                },
                //临时存放emp对象
                emp: {}
            }
        },
        computed: {
        },
        methods: {
            //获取部门信息
            getDeptList() {
                this.$http.get("/deptList2").then(res => {
                    this.deptList = res.data;
                }).catch(() => {
                    this.$message.error("部门信息获取失败，请联系管理员")
                })
            },
            //获取员工信息
            getEmpList() {
                this.$http.post("/empList",this.queryMap).then(res => {
                    this.empList = res.data.data;//员工信息
                    this.total = res.data.count
                }).catch(() => {
                    this.$message.error("员工信息获取失败，请联系管理员")
                })
            },
            //点击查询按钮
            search() {
                this.queryMap.page = 1;//页码设置为第一页
                this.getEmpList();
            },

            //每页条数改变时，参数val代表改变后的val
            handleSizeChange(val) {
                //console.log(`每页 ${val} 条`);
                this.queryMap.limit = val;
                this.getEmpList();
            },
            //页码改变时，参数val代表改变后的页码
            handleCurrentChange(val) {
                //console.log(`当前页: ${val}`);
                this.queryMap.page = val;
                this.getEmpList();
            },
            //点击新增按钮
            openAdd() {
                this.addFormVisible = true;//显示新增对话框
                this.$refs["addForm"].resetFields();//重置表单
            },
            //点击新增页面的保存按钮
            saveAdd() {
                this.$refs["addForm"].validate((valid) => {
                    if (valid) {
                        this.$http.post("addEmp",this.addForm).then(res => {
                            if (res.data) {//保存成功
                                //给用户提示
                                this.$message.success("保存成功");
                                this.addFormVisible = false;//关闭对话框
                                this.queryMap.page = 1;//将页码设置为第一页
                                this.getEmpList();//刷新表格
                            } else {
                                this.$message.error("新增失败，请联系管理员")
                            }
                        }).catch(() => {
                            this.$message.error("新增请求失败，请联系管理员")
                        })
                    } else {
                        return false;
                    }
                });
            },
            //表格复选框选中状态时触发的方法，val为选中的数据
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //点击删除按钮
            delEmp(){
                //判断是否勾选了数据
                if (this.multipleSelection.length == 0) {
                    this.$message.warning("请选中要删除的数据")
                    return;
                }
                //勾选了数据
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {//点击确定按钮后的回调函数
                    //遍历选中的数据，获取选中行的员工编号，存入数组中，传到后台进行删除
                    let enames = [];//定义数组，存储员工编号
                    //遍历选中的数据
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        enames.push(this.multipleSelection[i].ename);//将员工编号存入数组中
                    }
                    this.$http.post("delEmp",enames).then(res => {
                        if (res.data) {//删除成功
                            this.$message.success("删除成功")
                            this.search()
                        } else {
                            this.$message.error("删除失败，请联系管理员")
                        }
                    }).catch(() => {
                        this.$message.error("删除请求失败，请联系管理员")
                    })
                }).catch(() => {//点击取消按钮后的回调函数
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //点击修改按钮
            openEdit(){
                //判断是否勾选数据
                if (this.multipleSelection.length != 1) {
                    this.$message.warning("请选择一条数据")
                } else {
                    let ename = this.multipleSelection[0].ename;
                    this.$http.get("getEmpOne/" + ename).then(res => {
                        this.editForm = res.data;
                        //显示修改对话框
                        this.editFormVisible = true;
                        //重置表单
                        if (this.$refs["editForm"] != null) {
                            this.$refs["editForm"].resetFields();//重置表单
                        }
                    }).catch(() => {
                        this.$message.error("获取员工信息失败，请联系管理员")
                    })
                }
            },
            //点击修改页面的保存按钮
            saveEdit() {
                this.$refs["editForm"].validate((valid) => {
                    if (valid) {
                        this.$http.post("editEmp",this.editForm).then(res => {
                            if (res.data) {//保存成功
                                this.$message.success("修改成功");
                                this.editFormVisible = false;//关闭对话框
                                this.queryMap.page = 1;//将页码设置为第一页
                                this.getEmpList();//刷新表格
                            } else {
                                this.$message.error("修改失败，请联系管理员")
                            }
                        }).catch(() => {
                            this.$message.error("修改请求失败，请联系管理员")
                        })
                    } else {
                        return false;
                    }
                });
            },
            //重置密码
            initPwd(row) {
                this.$confirm('确定重置密码吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {//点击确定按钮后的回调函数
                    //获取当前行的员工信息
                    this.$http.get("updatePwd/" + row.ename).then(res => {
                            if (res.data) {//保存成功
                                //给用户提示
                                this.$message({
                                    type: "success",
                                    message: "重置密码成功"
                                });
                                this.search();//刷新表格
                            } else {
                                this.$message.error("重置密码失败，请联系管理员")
                            }
                        }).catch(() => {
                            this.$message.error("重置密码请求失败，请联系管理员")
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消重置密码'
                    });
                });
            }
        },
        created() {
            this.getDeptList();
            this.getEmpList();
        }
    }
</script>

<style scoped>

</style>