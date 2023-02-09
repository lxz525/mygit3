<template>
    <div>
        <!--头部工具栏-->
        <el-row>
            <el-col :span="16">
                <el-form :inline="true" :model="queryMap" class="demo-form-inline">
                    <el-form-item label="餐品名称">
                        <el-input v-model="queryMap.foodname" clearable></el-input>
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
                    <el-button type="primary" icon="el-icon-delete" @click="delFood">删除</el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <!--餐品列表-->
        <el-table
                :data="foodList"
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
                    prop="foodno"
                    label="餐品编号"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="foodname"
                    label="餐品名称"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="price"
                    label="价格"
                    width="80">
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
        <!--新增餐品对话框-->
        <el-dialog title="新增餐品" :visible.sync="addFormVisible" width="30%">
            <el-form
                    :model="addForm"
                    :rules="rules1"
                    ref="addForm"
                    label-width="100px"
                    class="demo-ruleForm">
                <el-form-item label="餐品名称" prop="foodname">
                    <el-input v-model="addForm.foodname"></el-input>
                </el-form-item>
                <el-form-item label="餐品价格" prop="price">
                    <el-input v-model="addForm.price"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">关 闭</el-button>
                <el-button type="primary" @click="saveAdd">保 存</el-button>
            </div>
        </el-dialog>
        <!--修改餐品信息对话框-->
        <el-dialog title="修改餐品" :visible.sync="editFormVisible" width="30%">
            <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="餐品编号" prop="foodno" >
                    <!--:disabled="true"表示该输入框禁用-->
                    <el-input v-model="editForm.foodno" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="餐品名称" prop="foodname">
                    <el-input v-model="editForm.foodname" @change="foodname1"></el-input>
                </el-form-item>
                <el-form-item label="餐品价格" prop="price">
                    <el-input v-model="editForm.price"></el-input>
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
        name: "FoodList",
        data() {
            //自定义验证规则，用于验证部门名称是否重复
            var validateName = (rule, value, callback) => {
                this.$http.get("checkFoodname/" + value).then(res => {
                    if (res.data) {//返回true，表示重复
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
                    foodname: "",
                    page: 1,//页码
                    limit: 10//每页条数
                },
                //表格数据
                foodList:[],
                //总条数
                total: 0,
                //控制新增对话框的显隐，值为false表示隐藏
                addFormVisible: false,
                //绑定新增表单的数据
                addForm: {
                    foodname: "",
                    price: "",
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
                rules:{foodname: [
                        {required: true, message: '请输入餐品名称', trigger: 'blur'},
                    ],
                    price: [
                        {required: true, message: '请填写价格', trigger: 'change' }
                    ]},
                rules1: {
                    foodname: [
                        {required: true, message: '请输入餐品名称', trigger: 'blur'},
                        {validator: validateName, trigger: 'blur' }
                    ],
                    price: [
                        {required: true, message: '请填写价格', trigger: 'change' }
                    ]
                },
                rules2: {
                    foodname: [
                        {required: true, message: '请输入餐品名称', trigger: 'blur'},
                    ],
                    price: [
                        {required: true, message: '请填写价格', trigger: 'change' }
                    ]
                },
                //入职日期只能选择今天及今天之后的时间
                foodname:''
            }
        },
        computed: {
        },
        methods: {
            //获取员工信息
            getFoodList() {
                this.$http.post("/foodList2",this.queryMap).then(res => {
                    this.foodList = res.data.data;
                    this.total = res.data.count
                }).catch(() => {
                    this.$message.error("餐品信息获取失败，请联系管理员")
                })
            },
            //点击查询按钮
            search() {
                this.queryMap.page = 1;//页码设置为第一页
                this.getFoodList();
            },

            foodname1() {
                if (this.editForm.foodname != this.foodname) {
                    this.rules = this.rules1
                }
                if (this.editForm.foodname == this.foodname) {
                    this.rules = this.rules2
                }
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
                        this.$http.post("addFood",this.addForm).then(res => {
                            if (res.data) {//保存成功
                                this.$message.success("保存成功");
                                this.addFormVisible = false;//关闭对话框
                                this.queryMap.page = 1;//将页码设置为第一页
                                this.getFoodList();//刷新表格
                            } else {
                                this.$message.error("新增失败，请联系管理员")
                                this.search()
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
            delFood(){
                //判断是否勾选了数据
                if (this.multipleSelection.length == 0) {
                    this.$message.warning("请选中要删除的数据")
                    return;
                }
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let foodnos = [];
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        foodnos.push(this.multipleSelection[i].foodno);//将员工编号存入数组中
                    }
                    this.$http.post("/delFood",foodnos).then(res => {
                        if (res.data) {//删除成功
                            this.$message.success("删除成功")
                            this.search()
                        } else {
                            this.$message.error("删除失败，请联系管理员")
                        }
                    }).catch(() => {
                        this.$message.error("删除请求失败，请联系管理员")
                    })
                }).catch(() => {
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
                    let foodno = this.multipleSelection[0].foodno;
                    this.$http.get("getFoodOne/" + foodno).then(res => {
                        this.editForm = res.data;
                        this.foodname = this.editForm.foodname
                        //显示修改对话框
                        this.editFormVisible = true;
                        //重置表单
                        if (this.$refs["editForm"] != null) {
                            this.$refs["editForm"].resetFields();//重置表单
                        }
                    }).catch(() => {
                        this.$message.error("获取餐品信息失败，请联系管理员")
                    })
                }
            },
            //点击修改页面的保存按钮
            saveEdit() {
                this.$refs["editForm"].validate((valid) => {
                    if (valid) {
                        this.$http.post("/editFood",this.editForm).then(res => {
                            if (res.data) {//保存成功
                                this.$message.success("修改成功");
                                this.editFormVisible = false;//关闭对话框
                                this.queryMap.page = 1;//将页码设置为第一页
                                this.getFoodList();//刷新表格
                            } else {
                                this.$message.error("修改失败，请联系管理员")
                            }
                            this.foodname = ""
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
            this.getFoodList();
        }
    }
</script>

<style scoped>

</style>