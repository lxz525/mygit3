<template>
    <div>
        <el-row>
            <el-col :span="10"><span class="demonstration">申请日期
                <el-date-picker
                        v-model="value1"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy年M月d日"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions">
                </el-date-picker>
            </span>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
            </el-col>
            <el-col :span="10" >
                <el-button type="primary" @click="getOrderinfo">查看</el-button>
                <el-button type="danger" @click="delOrder">删除</el-button>
            </el-col>
        </el-row>
        <el-table
                :data="empOrder"
                height="450"
                border
                style="width: 100%"
                @select="selectRow"
                @select-all="selectAll"
                :header-cell-style="{background: '#00A0FF',color: 'white'}">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    type="index"
                    label="序号">
            </el-table-column>
            <el-table-column
                    prop="reservationno"
                    label="申请编号">
            </el-table-column>
            <el-table-column
                    prop="dname"
                    label="费用部门">
            </el-table-column>
            <el-table-column
                    prop="applicationtime"
                    sortable
                    :formatter="formatterTime"
                    label="申请日期">
            </el-table-column>
            <el-table-column
                    prop="enames"
                    label="订餐人员">
            </el-table-column>
            <el-table-column
                    prop="orderedcount"
                    label="订餐数量">
            </el-table-column>
            <el-table-column
                    prop="type"
                    label="订餐类型">
            </el-table-column>
            <el-table-column
                    prop="total"
                    label="费用金额">
            </el-table-column>
            <el-table-column
                    prop="state"
                    label="当前状态">
            </el-table-column>
            <el-table-column
                    prop="remarks"
                    label="备注">
            </el-table-column>
            <el-table-column
                    prop="reject"
                    label="驳回意见">
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="query.page"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="query.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <el-dialog title="订单信息" :visible.sync="orderInfoVisible" width="30%">
            <el-descriptions :column="1" border style="margin-left: 10px;margin-top: 14px">
                <el-descriptions-item label="总订餐数量(份)" >
                    {{ordermessage.count}}
                </el-descriptions-item>
                <el-descriptions-item label="总订餐金额(元)">
                    {{ordermessage.totalprice}}
                </el-descriptions-item>
                <el-descriptions-item label="餐品明细数量(份)">
                    {{ordermessage.foodinfo}}
                </el-descriptions-item>
            </el-descriptions>
            <div slot="footer" class="dialog-footer">
                <el-button @click="orderInfoVisible = false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "IndividualReservation",
        data() {
            return {
                dname: sessionStorage.getItem("dname"),
                empOrder: [],
                uname: sessionStorage.getItem("uname"),
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                value1: '',
                query: {
                    date1: '',
                    date2: '',
                    uname: sessionStorage.getItem("uname"),
                    page: 1,
                    limit: 5,
                    role: "个人"
                },
                total: 0,
                editableTabsValue: '2',
                tabIndex: 2,
                selectionItems:[],
                ordermessage:{
                    count: 0,
                    totalprice: 0,
                    foodinfo:""
                },
                orderInfoVisible:false,
            }
        },
        methods: {
            getEmpOrderList() {
                if (this.value1 != "" && this.value1 != null) {
                    this.query.date1 = this.value1[0]
                    this.query.date2 = this.value1[1]
                } else {
                    this.query.date1 = ""
                    this.query.date2 = ""
                }
                this.$http.post("/getOrderList", this.query).then(res => {
                    this.empOrder = res.data.data
                    this.total = res.data.count
                }).catch(() => {
                    this.$message.error("个人订餐信息查询失败，请联系管理员")
                })
            },
            search() {
                this.query.page = 1
                this.getEmpOrderList()
            },
            selectRow(selection, row) {
                this.selectionItems = selection
            },
            //全选
            selectAll(selection) {
                this.selectionItems = selection
            },
            // 当每页多少条被改变时，val代表改变后的每页多少条
            handleSizeChange(val) {
                this.query.limit = val
                this.search()
            },
            // 当每页被改变时，val代表当前页
            handleCurrentChange(val) {
                this.query.page = val
                this.getEmpOrderList()
            },
            // 时间切割
            formatterTime(row, column) {
                let data = row[column.property]
                return /\d{4}-\d{1,2}-\d{1,2}/g.exec(data)
            },
            delOrder() {
                let selection = this.selectionItems
                //判断被选中的条数
                if (selection.length == 0) {
                    this.$message.warning("请至少选择一条数据")
                    return
                }
                //要求用户确认
                this.$confirm('确定删除所选订单吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let arr = []
                    for (let i = 0; i < selection.length; i++) {
                        if (selection[i].state == "待部门确认" || selection[i].state == "待管理员确认") {
                            this.$message.warning("审核中的订单不能删除")
                            this.search()
                            return
                        }
                        arr.push(selection[i].reservationno)
                    }
                    this.$http.post("/delOrderRecords", arr).then(res => {
                        if (res.data = "success") {
                            this.$message.success("删除成功")
                            this.search()
                        } else {
                            this.$message.warning("删除失败")
                        }
                        this.selectionItems = []
                    }).catch(() => {
                        this.$message.warning("删除失败，联系管理员")
                    })
                })
            },
            getOrderinfo(){
                if (this.selectionItems.length == 0) {
                    this.$message.warning("请选择数据")
                } else {
                    //获得餐品明细
                    this.ordermessage = {
                        count: 0,
                        totalprice: 0,
                        foodinfo:""
                    }
                    let reservationno = [];//定义数组，存储部门编号
                    //遍历选中的数据
                    for (let i = 0; i < this.selectionItems.length; i++) {
                        reservationno.push(this.selectionItems[i].reservationno);//将部门编号存入数组中
                    }
                    this.orderInfoVisible = true
                    this.$http.post("/getOrderInfo",reservationno).then(res=> {
                        console.log(res.data)
                        for (let i = 0; i < res.data.length ; i++) {
                            this.ordermessage.count = this.ordermessage.count + res.data[i].foodcount
                            this.ordermessage.totalprice = this.ordermessage.totalprice + res.data[i].totalprice
                            this.ordermessage.foodinfo = this.ordermessage.foodinfo + res.data[i].foodname + res.data[i].foodcount + "份；"
                        }
                    }).catch(()=>{
                        this.$message.error("订餐汇总信息查询失败，请联系管理员")
                    })
                }
            }
        },
        created() {
            this.search()
        }
    }
</script>

<style scoped>

</style>