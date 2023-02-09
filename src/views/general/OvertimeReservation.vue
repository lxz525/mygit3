<template>
    <div>
        <el-row>
            <div align="left">
                <span>加班订餐申请</span>
                <div style="display: inline;float: right">
                    <el-button type="primary" size="small" @click="saveOrder('提交')">提交</el-button>
                    <el-button type="primary" size="small" @click="saveOrder('保存')">保存</el-button>
                </div>
            </div>
            <el-divider></el-divider>
            <!--订餐信息-->
            <div class = "apply" >
                <h3 style="text-align: left">订餐信息:</h3>
                <el-form :model="orderFoodForm" :rules="orderrule" ref="orderFoodForm" label-width="100px" class="demo-ruleForm" size="mini">
                    <el-row>
                        <el-col span="8">
                            <el-form-item label="申请编号" prop="reservationno">
                                <el-input v-model="orderFoodForm.reservationno" readonly></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col span="8">
                            <el-form-item label="申请人" prop="ename">
                                <el-input v-model="orderFoodForm.ename" readonly></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col span="8">
                            <el-form-item label="申请时间" prop="applicationtime">
                                <el-input v-model="orderFoodForm.applicationtime" readonly></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col span="8">
                            <el-form-item label="订餐人员" prop="enames">
                                <el-input v-model="orderFoodForm.enames" readonly>
                                    <el-button slot="suffix" type="text" icon="el-icon-user" @click="selectEnames"></el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col span="8">
                            <el-form-item label="订餐数量" prop="ordercount">
                                <el-input v-model="orderFoodForm.ordercount" readonly></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col span="8">
                            <el-form-item label="订餐类型" prop="type">
                                <el-radio-group v-model="orderFoodForm.type">
                                    <el-radio :label="1"  disabled>午餐</el-radio>
                                    <el-radio :label="2"  disabled>晚餐</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col span="8">
                            <el-form-item label="总价" prop="total">
                                <el-input v-model="orderFoodForm.total" readonly=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col span="8">
                            <el-form-item label="费用部门" prop="dname">
                                <el-input v-model="orderFoodForm.dname" readonly></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col span="8">
                            <el-form-item label="备注" prop="remarks">
                                <el-input v-model="orderFoodForm.remarks"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form></div>
            <!--订餐人员弹出层-->
            <!--<OrderEnames></OrderEnames>-->
            <el-dialog width="60%" :title="title" :visible.sync="dialogFormVisible">
                <h3>人员选择</h3>
                <div style="text-align: center">
                    <el-transfer
                            style="text-align: left; display: inline-block"
                            v-model="value"
                            :titles="[dname, '已选择']"
                            filterable
                            @change="handleChange"
                            :button-texts="['删除', '新增']"
                            :data="data" >
                    </el-transfer>
                </div>
                <div>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit">提 交</el-button>
                </div>
            </el-dialog>
            <!--餐品种类-->
            <div class = "apply" >
                <h3 style="text-align: left">餐品种类:</h3>
                <div style="float: right">
                    <el-button  type="primary" @click="addFood" :disabled="addfood">新增</el-button>
                </div>
                <el-table
                        :data="foodTable"
                        height="250"
                        border
                        style="width: 100%"
                >
                    <el-table-column
                            type="index"
                            label="序号"
                            width="50">
                    </el-table-column>
                    <el-table-column
                            prop="foodType"
                            label="餐品种类"
                            width="150"

                    >
                        <template slot-scope="scope">
                            <el-select placeholder="请选择餐品种类" v-model="scope.row.foodType" @change="getPrice(scope.row.foodType,scope.$index)" clearable>
                                <el-option v-for="food in foodList" :label="food.foodname" :value="food.foodno" :disabled="food.disabled"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="foodCount"
                            label="数量"
                            width="80">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.foodCount" @change="orderCount" ></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="price"
                            label="价格"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="remarks"
                            label="备注">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remarks"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="120">
                        <template slot-scope="scope">
                            <el-button
                                    @click.native.prevent="deleteRow(scope.$index, foodTable)"
                                    type="text"
                                    size="small">
                                移除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "OvertimeReservation",
        data() {
            const generateData = _ => {
                const data = [];
                this.$http.get("/getEmpsByDname",{
                    params: {
                        dname: sessionStorage.getItem("dname")
                    }
                }).then(res => {
                    for (let i = 0; i < res.data.length; i++) {
                        let empno = res.data[i].empno
                        let ename = res.data[i].ename
                        data.push({
                            key: [empno,ename],
                            label: `${ename}`,
                        });
                    }
                })
                return data;
            };
            return {
                dialogFormVisible: false,
                data: generateData(),
                value: [],
                dname: sessionStorage.getItem("dname"),
                emps:[],
                uname: sessionStorage.getItem("uname"),
                deptList: [],
                orderFoodForm: {
                    reservationno: '',
                    ename: sessionStorage.getItem("uname"),
                    empno: sessionStorage.getItem("empno"),
                    applicationtime: '',
                    enames: [],
                    empnos:[],
                    total: 0,
                    type: '',
                    ordercount: 0,
                    state: '',
                    dname: sessionStorage.getItem("dname"),
                    remarks:'',
                    orderfoodinfo:[],
                    role:"个人"
                },
                orderempnos: {
                    dname: sessionStorage.getItem("dname"),
                    type:'',
                    date1:'',
                    date2:''
                },
                valid: false,
                repeatEmpnos:[],
                foodList:[],
                foodTable:[],
                orderrule:{
                    enames: [
                        {required: true, message: "请选择订餐人", trigger: "change"}
                    ],
                    ordercount: [
                        // {required: true, message: "请选择餐品类别及数量", trigger: "change"},
                        {required: true, pattern: /^\+?[1-9]\d*$/, message: '请检查餐品类别及数量'},
                    ]
                },
                addfood: true //是否可以新增餐品
            }
        },
        components: {

        },
        methods:{
            deleteRow(index, rows) {
                rows.splice(index, 1);
                this.orderCount(index)
            },
            async saveOrder(status) {
                this.$refs["orderFoodForm"].validate(valid => {
                    // console.log(valid)
                    this.valid = valid
                })
                if (this.valid) {
                    this.orderFoodForm.orderfoodinfo = this.foodTable
                    this.orderFoodForm.applicationtime = this.getCurrentTime()
                    this.judgeTime()
                    if (this.orderFoodForm.type == 1) {
                        this.orderFoodForm.type = "午餐"
                    } else {
                        this.orderFoodForm.type = "晚餐"
                    }
                    this.orderempnos.type = this.orderFoodForm.type
                    this.orderempnos.date1 =  this.getCurrentTime2() +  " " + "00:00:00"
                    this.orderempnos.date2 = this.getCurrentTime2() + " " + "23:59:59"
                    if (status == '提交') {
                        this.orderFoodForm.state = "待部门确认"
                        await this.$http.post("/getOrderEmpnos", this.orderempnos).then(res => {
                            // console.log('res')
                            // console.log(res)
                            var hasOrderedFoodEmpnos = res.data
                            // var repeatEmpnos = []
                            for (let i = 0; i < hasOrderedFoodEmpnos.length; i++) {
                                for (let j = 0; j < this.emps.length; j++) {
                                    if (this.emps[j][0] == hasOrderedFoodEmpnos[i]) {
                                        this.repeatEmpnos.push(this.emps[j][1])
                                    }
                                }
                            }
                        }).catch(() => {
                            this.$message.error("获取重复订餐人员失败,请联系管理员")
                        })
                        if (this.repeatEmpnos.length != 0) {
                            // console.log("1")

                            alert(this.repeatEmpnos + "已被订餐！")
                            this.repeatEmpnos = []
                            console.log(this.repeatEmpnos)
                            return
                        }
                    } else {
                        this.orderFoodForm.state = "未提交"
                    }
                    this.$http.post("/insertOrder",this.orderFoodForm).then(res => {
                        // console.log(res.data)
                        if (res.data == "fail") {
                            this.$message.error( status + "失败!")
                        } else {
                            this.orderFoodForm.reservationno = res.data
                            this.judgeTime()
                            this.$message.success( status + "成功!")
                            if (status == "保存") {
                                sessionStorage.setItem("orderFoodForm",JSON.stringify(this.orderFoodForm))
                                sessionStorage.setItem("foodTable",JSON.stringify(this.foodTable))
                                sessionStorage.setItem("emps",JSON.stringify(this.emps))
                            } else {
                                sessionStorage.removeItem("orderFoodForm")
                                sessionStorage.removeItem("foodTable")
                                sessionStorage.removeItem("emps")
                                // sessionStorage.setItem("closePage","5")
                                this.$store.commit("setClosePage", "关闭")
                                // console.log(this.$store.state.closePage)
                                // this.$parent.removeremoveTab("")
                            }
                        }
                        // this.foodList = res.data
                        // console.log(this.foodList)
                    }).catch(()=> {
                        this.$message.error(status + "失败，请联系管理员")
                    })
                } else {
                    this.$message.error("请完善订单信息")
                }
            },
            //选择订餐人员弹出框显隐
            selectEnames() {
                this.dialogFormVisible = true
            },
            //订餐人员赋值
            handleChange(value, direction, movedKeys) {
                this.emps = value
                // console.log(value, direction, movedKeys)
            },
            //新增餐品信息
            addFood() {
                this.foodTable.push({foodType: "", foodCount: "",price:"",remarks:""})                                                                      //show和tx用于判断选项和选项描述是 否显示逻辑
            },
            //查询所有餐品种类
            getAllFood() {
                this.$http.post("/foodList").then(res => {
                    // console.log(res.data)
                    this.foodList = res.data
                    for (let i = 0; i < this.foodList.length; i++) {
                        this.foodList[i].disabled = false
                    }
                    // console.log(this.foodList)
                }).catch(()=> {
                    this.$message.error("获取餐品信息失败，请联系管理员")
                })
            },
            //获得餐品价格
            getPrice(foodNo,index) {
                // console.log(foodNo,index)
                for (let j = 0; j < this.foodList.length ; j++) {
                    if (foodNo == this.foodList[j].foodno) {
                        this.foodList[j].disabled = true
                        for (let i = 0; i < this.foodTable.length; i++) {
                            if (i != index && this.foodList[j].foodno == this.foodTable[i].foodType) {
                                this.$message.error("该餐品已存在！")
                                this.foodList[j].disabled = true
                                this.foodTable[index].foodType = ""
                                return
                            }
                        }
                    } else{
                        this.foodList[j].disabled = false
                    }


                }
                for (let i = 0; i < this.foodList.length; i++) {
                    if (foodNo  == this.foodList[i].foodno) {
                        this.foodTable[index].price= this.foodList[i].price
                    }
                }
                this.orderCount()
            },
            //订餐数量和总价计算
            orderCount() {
                var sum = 0;
                var total = 0;
                for (let i = 0; i < this.foodTable.length; i++) {
                    if (this.foodTable[i].price == "" || this.foodTable[i].foodType == "") {
                        this.orderFoodForm.ordercount = ""
                        return
                    } else {
                        sum += Number(this.foodTable[i].foodCount)
                        total += Number(this.foodTable[i].price) * Number(this.foodTable[i].foodCount)
                        if(sum > this.orderFoodForm.enames.length) {
                            alert("订餐数量不能超过订餐人员！")
                            this.orderFoodForm.ordercount = ""
                            return
                        }
                    }
                }
                this.orderFoodForm.ordercount = sum
                this.orderFoodForm.total = total
                // console.log(this.orderFoodForm.ordercount)

            },
            //订餐人员提交
            submit() {
                this.orderFoodForm.enames = []
                this.orderFoodForm.empnos = []
                for (let i = 0; i < this.emps.length; i++) {
                    // console.log(this.emps[i][1])
                    this.orderFoodForm.enames.push(this.emps[i][1])
                    this.orderFoodForm.empnos.push(this.emps[i][0])
                }
                if(this.orderFoodForm.enames.length != 0) {
                    this.addfood = false
                } else{
                    this.foodTable = []
                    this.addfood = true
                }
                this.dialogFormVisible = false
                this.orderCount()
            },
            //获取系统时间
            getCurrentTime() {
                var date = new Date();//当前时间
                var year = date.getFullYear() //返回指定日期的年份
                var month = date.getMonth() + 1;//月
                var day = date.getDate();//日
                var hour = date.getHours();//时
                var minute = date.getMinutes();//分
                var second = date.getSeconds();//秒
                //当前时间
                var curTime = year + "-" + month + "-" + day
                    + " " + hour + ":" + minute + ":" + second;
                return curTime;
            },
            getCurrentTime2() {
                var date = new Date();//当前时间
                var year = date.getFullYear() //返回指定日期的年份
                var month = date.getMonth() + 1;//月
                var day = date.getDate();//日
                //当前时间
                var curTime = year + "-" + month + "-" + day
                return curTime;
            },
            judgeTime() {
                var date = new Date();//当前时间
                var hour = parseFloat(date.getHours());//时
                var minute = parseFloat(date.getMinutes())/60;//分
                let time = 10;
                if (time <= 10.5){
                    this.orderFoodForm.type = 1
                } else if(time >= 13.5 && time <= 16.5){
                    this.orderFoodForm.type = 2
                } else {
                    alert("订餐时间已过！午餐请在10：30之前预定，晚餐在13：00-16：30预定")
                    this.$store.commit("setClosePage", "关闭")
                }
            },
            //获取重复的订餐员工
            getRepeatEmpnos(){
                this.orderempnos.type = this.orderFoodForm.type
                this.orderempnos.date1 =  this.getCurrentTime2() +  " " + "00:00:00"
                this.orderempnos.date2 = this.getCurrentTime2() + " " + "23:59:59"
                // console.log(this.orderempnos.date1)
                this.$http.post("/getOrderEmpnos", this.orderempnos).then(res => {
                    // console.log('res')
                    // console.log(res)
                    var hasOrderedFoodEmpnos = res.data
                    // var repeatEmpnos = []
                    for (let i = 0; i < hasOrderedFoodEmpnos.length; i++) {
                        for (let j = 0; j < this.emps.length; j++) {
                            if (this.emps[j][0] == hasOrderedFoodEmpnos[i]) {
                                this.repeatEmpnos.push(this.emps[j][1])
                            }
                        }
                    }
                    // console.log(res)
                    // this.hasOrderedFoodEmpnos = res.data
                }).catch(() => {
                    this.$message.error("获取已订餐人员失败,请联系管理员")
                })

            },

        },
        created(){
            this.getAllFood()
            this.judgeTime()
            if (sessionStorage.getItem("orderFoodForm")!= null){
                this.orderFoodForm = JSON.parse(sessionStorage.getItem("orderFoodForm"))
                this.foodTable = JSON.parse(sessionStorage.getItem("foodTable"))
                this.emps = JSON.parse(sessionStorage.getItem("emps"))
            }

        }

    }
</script>

<style scoped>
    .apply {
        border: 1px solid deepskyblue;
        width: 70%;
        padding: 20px;
        margin: auto;
    }

</style>