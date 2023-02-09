<template>
    <div>
        <!--头部工具栏-->
        <el-row>
            <el-col :span="8">
                <el-form :inline="true" :model="queryMap" class="demo-form-inline">
                    <el-form-item label="部门名称">
                        <el-input v-model="queryMap.dname" clearable></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="4">
            <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
            </el-col>
            <el-col :span="12">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-plus" @click="openAdd">新增</el-button>
                    <el-button type="primary" icon="el-icon-edit" @click="openEdit">修改</el-button>
                    <el-button type="primary" icon="el-icon-delete" @click="delDept">删除</el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <!--部门列表-->
        <el-table
                :data="deptList"
                stripe
                empty-text="当前没有部门信息"
                height="559px"
                @selection-change="handleSelectionChange"
                style="width: 100%">
            <el-table-column
                    type="selection"
                    width="160"
                    align="center">
            </el-table-column>
            <el-table-column
                    type="index"
                    label="序号"
                    width="160">
            </el-table-column>
            <el-table-column
                    prop="deptno"
                    label="部门编号"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="dname"
                    label="部门名称">
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
        <!--新增对话框-->
        <el-dialog title="首页" :visible.sync="addFormVisible" width="30%">
            <el-form
                    :model="addForm"
                    :rules="rules1"
                    ref="addForm"
                    label-width="100px"
                    class="demo-ruleForm">
                <el-form-item label="部门名称" prop="dname">
                    <el-input v-model="addForm.dname" maxlength="20" show-word-limit></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">关 闭</el-button>
                <el-button type="primary" @click="saveAdd">保 存</el-button>
            </div>
        </el-dialog>
        <!--修改对话框-->
        <el-dialog title="修改部门" :visible.sync="editFormVisible" width="30%">
            <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="部门编号" >
                    <el-input v-model="editForm.deptno" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="部门名称" prop="dname">
                    <el-input v-model="editForm.dname" @change="dname1"></el-input>
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
        name: "DeptList",
        data() {
            //自定义验证规则，用于验证部门名称是否重复
            var validateName = (rule, value, callback) => {
                this.$http.get("checkDeptName/" + value).then(res => {
                    if (res.data) {//返回true，表示部门名称重复
                        callback(new Error("部门名称重复"));
                    } else {
                        callback();
                    }
                }).catch(() => {
                    callback(new Error("部门名称验证请求失败，请联系管理员"))
                })
            };
            return {
                //封装查询条件
                queryMap: {
                    dname: "",//部门名称
                    page: 1,//页码
                    limit: 10//每页条数
                },
                //部门信息
                deptList: [],
                //总条数
                total: 0,
                //控制新增对话框的显隐，值为false表示隐藏
                addFormVisible: false,
                //绑定新增表单的数据
                addForm: {
                    dname: "",//部门名称
                },
                //控制修改对话框的显隐，值为false表示隐藏
                editFormVisible: false,
                //绑定修改表单的数据
                editForm: {
                    deptno: "",//部门编号
                    dname: "",//部门名称
                },
                //存储表格选中的数据
                multipleSelection: [],
                //新增表单页面的验证规则
                rules: {
                    dname: [
                        {required: true, message: '请输入部门名称', trigger: 'blur'},
                    ]
                },
                rules1: {
                    dname: [
                        {required: true, message: '请输入部门名称', trigger: 'blur'},
                        {validator: validateName, trigger: 'blur' }
                    ]
                },
                rules2: {
                    dname: [
                        {required: true, message: '请输入部门名称', trigger: 'blur'},
                    ]
                },
                dname:''
            }
        },
        methods: {
            //获取部门信息
            getDeptList() {
                // console.log(this.queryMap)
                this.$http.post("/deptList", this.queryMap).then(res => {
                    this.deptList = res.data.data;
                    this.total = res.data.count
                }).catch(() => {
                    this.$message.error("部门信息获取失败，请联系管理员")
                })
            },
            //点击查询按钮
            search() {
                this.queryMap.page = 1;//页码设置为第一页
                this.getDeptList();
            },
            dname1() {
                if (this.editForm.dname != this.dname) {
                    this.rules = this.rules1
                }
                if (this.editForm.dname == this.dname) {
                    this.rules = this.rules2
                }
            },
            //每页条数改变时，参数val代表改变后的val
            handleSizeChange(val) {
                this.queryMap.limit = val;
                this.getDeptList();
            },
            //页码改变时，参数val代表改变后的页码
            handleCurrentChange(val) {
                this.queryMap.page = val;
                this.getDeptList();
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
                        this.$http.post("addDept",this.addForm).then(res => {
                            if (res.data) {//保存成功
                                //给用户提示
                                this.$message.success("新增成功");
                                this.addFormVisible = false;//关闭对话框
                                this.queryMap.pageIndex = 1;//将页码设置为第一页
                                this.getDeptList();//刷新表格
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
            delDept(){
                //判断是否勾选了数据
                if (this.multipleSelection.length == 0) {
                    this.$message({
                        type: "warning",
                        message: "请选中要删除的数据"
                    });
                    return;
                }
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {//点击确定按钮后的回调函数
                    //遍历选中的数据，获取选中行的部门编号，存入数组中，传到后台进行删除
                    let deptnos = [];//定义数组，存储部门编号
                    //遍历选中的数据
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        deptnos.push(this.multipleSelection[i].deptno);//将部门编号存入数组中
                    }
                    this.$http.post("getEmpByDeptnos", deptnos).then(res => {
                        console.log(res.data);
                        if (res.data.length == 0) {
                            this.$http.post("delDept",deptnos).then(res => {
                                if (res.data) {//删除成功
                                    //给用户提示
                                    this.$message.success("删除成功");
                                    this.queryMap.page = 1;//将页码设置为第一页
                                    this.getDeptList();//刷新表格
                                } else {
                                    this.$message.error("删除失败，请联系管理员")
                                }
                            }).catch(() => {
                                this.$message.error("删除请求失败，请联系管理员")
                            })
                        } else {
                            this.$message.warning( "部门编号为" + res.data + "的部门还有员工，无法删除")
                        }
                    }).catch(() => {
                        this.$message.error("删除验证请求失败，请联系管理员");
                    });
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
                    this.$message.warning("请选中一条要修改的数据")
                }  else {
                    //获取选中项主键
                    let deptno = this.multipleSelection[0].deptno;
                    //根据主键获取部门详细信息
                    this.$http.get("getDeptOne/" + deptno).then(res => {
                        //将获取到的部门信息展示在修改对话框中
                        this.editForm = res.data;
                        this.dname = this.editForm.dname
                        //显示修改对话框
                        this.editFormVisible = true;
                        //重置表单
                        if (this.$refs["editForm"] != null) {
                            this.$refs["editForm"].resetFields();//重置表单
                        }
                    }).catch(() => {
                        this.$message.error("获取部门信息失败，请联系管理员")
                    })
                }
            },
            //点击修改页面的保存按钮
            saveEdit() {
                this.$refs["editForm"].validate((valid) => {
                    if (valid) {
                        this.$http.post("editDept",this.editForm).then(res => {
                            if (res.data) {//保存成功
                                //给用户提示
                                this.$message.success("修改成功");
                                this.editFormVisible = false;//关闭对话框
                                this.queryMap.page = 1;//将页码设置为第一页
                                this.dname = ""
                                this.getDeptList();//刷新表格
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
        },
        created() {
            this.getDeptList();
        }
    }
</script>

<style scoped>

</style>