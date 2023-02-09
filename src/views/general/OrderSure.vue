<template>
    <div>
        <el-row>
            <el-col :span="7">
                <el-calendar>
                    <template
                            slot="dateCell"
                            slot-scope="{date, data}">
                        <div @click="search(data.day)">
                            {{  data.day.split('-').slice(2).join('-') }}
                        </div>
                    </template>
                </el-calendar>
            </el-col>
            <el-col :span="17">
                <el-row>
                    <el-col :span="5" align="left">
                        &nbsp;&nbsp;费用信息</el-col>
                    <el-col :span="11"><div>&nbsp;</div></el-col>
                    <el-col :span="8" align="right">
                        <el-button-group>
                            <el-button type="primary" @click="submit('提交')">提交</el-button>
                            <el-button type="warning" @click="dialogFormVisible = true">退回</el-button>
                        </el-button-group>
                    </el-col>
                </el-row>
                <el-descriptions :column="1" border style="margin-left: 10px;margin-top: 14px">
                    <el-descriptions-item label="日期"  >
                        {{date1}}
                    </el-descriptions-item>
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
            </el-col>
        </el-row>

        <el-table
                :data="Order"
                height="450"
                border
                show-summary
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
                    width="85"
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
                    label="申请日期"
                    :formatter="formatterTime"
                    sortable>
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
        <!--驳回意见弹出框-->
        <el-dialog title="驳回意见" :visible.sync="dialogFormVisible">
            <el-form :model="orderMap">
                <el-form-item label="意见" :label-width="formLabelWidth">
                    <el-input v-model="orderMap.rejection" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="sure">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "ReservationConfirmation",
        data() {
            return {
                dialogFormVisible:false,
                date1: this.getCurrentTime(),
                dname: sessionStorage.getItem("dname"),
                Order: [],
                uname: sessionStorage.getItem("uname"),
                query: {
                    date1: '',
                    date2: '',
                    uname: sessionStorage.getItem("uname"),
                    page: 1,
                    limit: 5,
                    role: sessionStorage.getItem("role")
                },
                ordermessage:{
                    count: 0,
                    totalprice: 0,
                    foodinfo:""
                },
                orderMap:{
                    role:sessionStorage.getItem("role"),
                    state:'',
                    orderArr:[],
                    rejection:""
                },
                total: 0,
                editableTabsValue: '2',
                tabIndex: 2,
                selectionItems:'',
                reservationnos:[]
            }
        },
        mounted() {
            // this.$refs.datePick.focus(); // 让日历组件默认触发焦点事件
        },
        methods: {
            async search(date) {
                this.date1=date
                this.ordermessage.count = 0
                this.ordermessage.totalprice = 0
                this.ordermessage.foodinfo = ""
                this.reservationnos=[]
                this.query.page = 1
                if (date != "" && date != null ) {
                    this.query.date1 = date + " " + "00:00:00"
                    this.query.date2 = date + " " + "23:59:59"
                } else{
                    this.query.date1 = ""
                    this.query.date2 = ""
                }
                //获得订单
                await this.$http.post("/getOrderList",this.query).then(res=> {
                    this.Order = res.data.data
                    for (let i = 0; i < this.Order.length; i++) {
                        this.reservationnos.push(this.Order[i].reservationno)
                    }
                    this.total = res.data.count
                    // console.log(this.reservationnos)
                }).catch(()=>{
                    this.$message.error("订餐信息查询失败，请联系管理员")
                })
                //获得餐品明细
                this.$http.post("/getOrderInfo",this.reservationnos).then(res=> {
                    console.log(res.data)
                    for (let i = 0; i < res.data.length ; i++) {
                        this.ordermessage.count = this.ordermessage.count + res.data[i].foodcount
                        this.ordermessage.totalprice = this.ordermessage.totalprice + res.data[i].totalprice
                        this.ordermessage.foodinfo = this.ordermessage.foodinfo + res.data[i].foodname + res.data[i].foodcount + "份；"
                    }
                    // this.Order = res.data.data
                    // for (let i = 0; i < this.Order.length; i++) {
                    //     this.reservationnos.push(this.Order[i].reservationno)
                    // }
                    // this.total = res.data.count
                }).catch(()=>{
                    this.$message.error("订餐汇总信息查询失败，请联系管理员")
                })
                // await this.getOrderList(date)
                // this.getOrderinfo()
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
                this.getEmpOrderList()
            },
            getCurrentTime() {
                var date = new Date();//当前时间
                var year = date.getFullYear() //返回指定日期的年份
                var month = date.getMonth() + 1;//月
                var day = date.getDate();//日
                //当前时间
                var curTime = year + "-" + month + "-" + day
                return curTime;
            },
            // 时间切割
            formatterTime(row,column){
                let data = row[column.property]
                return  /\d{4}-\d{1,2}-\d{1,2}/g.exec(data )
            },
            submit(status){
                if (status == '提交') {
                    if (this.orderMap.role == "部门经理") {
                        this.orderMap.state = "待管理员确认"
                    }
                    if (this.orderMap.role == "管理员") {
                        this.orderMap.state = "完成"
                    }
                } else {
                    this.orderMap.state = "被驳回"
                }
                let selection = this.selectionItems
                if (selection.length == 0){
                    this.$message.warning("请至少选择一条数据")
                    return
                }
                this.$confirm('确定吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let arr = []
                    for (let i = 0; i < selection.length; i++) {
                        arr.push(selection[i].reservationno)
                    }
                    this.orderMap.orderArr = arr
                    this.$http.post("/updOrderState", this.orderMap).then(res => {
                        if (res.data = "success") {
                            this.$message.success(status + "成功")
                            // this.search()
                            this.$store.commit("setClosePage", "关闭")
                            // 待续，跨页删除
                        } else {
                            this.$message.warning(status + "失败")
                        }
                    }).catch(() => {
                        this.$message.warning(status + "失败，联系管理员")
                    })
                })
            },
            sure(){
                this.submit("退回")
                this.dialogFormVisible = false
            }
        },
        created() {
            this.search(this.date1)
        }
    }
</script>

<style lang="css">
    .el-calendar__header {
        display: flex;
        padding: 0 !important;
        justify-content: space-between;
        border-bottom: 1px solid #EBEEF5;
    }
    .el-calendar-table .el-calendar-day {
        box-sizing: border-box;
        padding: 8px ;
        height: 28px!important;
    }
    .el-calendar__body {
        padding: 0 !important;
    }
</style>