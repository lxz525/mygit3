<template>
    <div>
        <div>


        </div>
        <el-form :inline="true" :model="query" class="demo-form-inline">
            <el-form-item label="申请日期">
                <el-date-picker
                        v-model="date"
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
            </el-form-item>
            <el-form-item label="订餐人">
                <el-input v-model="query.uname" clearable></el-input>
            </el-form-item>
            <el-form-item label="申请编号">
                <el-input v-model="query.reservationno" clearable></el-input>
            </el-form-item>
            <el-form-item label="当前状态">
                <el-input v-model="query.state"  clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" @click="getOrderinfo">查看</el-button>
            </el-form-item>
        </el-form>
        <el-table
                :data="orderList"
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
        name: "AllOrderRecords",
        data() {
            return {
                dname: sessionStorage.getItem("dname"),
                orderList: [],
                uname: sessionStorage.getItem("uname"),
                date: '',
                query: {
                    date1: '',
                    date2: '',
                    uname: "",
                    page: 1,
                    limit: 5,
                    role: "All",
                    state:"",
                    reservationno:''
                },
                selectionItems:[],
                ordermessage:{
                    count: 0,
                    totalprice: 0,
                    foodinfo:""
                },
                orderInfoVisible:false,
                total: 0,
            }
        },
        methods:{
            getAllOrderList(){
                if (this.date != "" && this.date != null ) {
                    this.query.date1 = this.date[0]
                    this.query.date2 = this.date[1]
                } else{
                    this.query.date1 = ""
                    this.query.date2 = ""
                }
                this.$http.post("/getOrderList",this.query).then(res=> {
                    this.orderList = res.data.data
                    this.total = res.data.count
                }).catch(()=>{
                    this.$message.error("订餐信息查询失败!")
                })
            },
            search() {
                this.query.page = 1
                this.getAllOrderList()
            },
            selectRow(selection,row) {
                this.selectionItems = selection
            },
            //全选
            selectAll(selection){
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
                this.getAllOrderList()
            },
            // 时间切割
            formatterTime(row,column){
                let data = row[column.property]
                return  /\d{4}-\d{1,2}-\d{1,2}/g.exec(data )
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