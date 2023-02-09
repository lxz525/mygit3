<template>
    <div>
        <el-container style="height: 100vh; border: 1px solid #eee">
            <el-aside width="220px" style="background-color: rgb(238, 241, 246)">
                <el-menu
                        @select="menuclick"
                        :default-active="menuindex"
                        style="min-height: 100%;overflow-x: hidden"
                        background-color="rgb(48,65,86)"
                        text-color="#fff"
                        class="el-menu-v"
                        router="true"
                >
                    <el-menu-item align="left">
                        <span>欢迎您：{{uname}}</span>
                    </el-menu-item>
                    <el-menu-item index="/employeeHome/index" align="left">
                        <i class="el-icon-s-home"></i>
                        <span slot="title">首页</span>
                    </el-menu-item>

                    <el-menu-item index="/employeeHome/individualReservation" align="left">
                        <i class="el-icon-user-solid"></i>
                        <span>个人订餐</span>
                    </el-menu-item>

                    <el-menu-item index="/employeeHome/overtimeReservation" align="left">
                        <i class="el-icon-user-solid"></i>
                        <span>加班订餐</span>
                    </el-menu-item>

                </el-menu>

            </el-aside>
            <el-container>
                <el-header>
                    <span style="font-size: 30px">订餐管理系统</span>
                    <el-button  type="primary" round style="float: right" @click="out">退出</el-button>
                    <el-tabs v-model="editableTabsValue"  closable @tab-remove="removeTab" @tab-click="tabclick">
                        <el-tab-pane
                                v-for="(item, index) in editableTabs"
                                :key="item.name"
                                :label="item.title"
                                :name="item.name"
                        >
                        </el-tab-pane>
                    </el-tabs>
                </el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "EmployeeHome",
        data() {
            return {
                uname: sessionStorage.getItem("uname"),
                menuindex:'',
                editableTabsValue: '/employeeHome/index',
                editableTabs: [{
                    title: '首页',
                    name: '/employeeHome/index',
                }],
                alltableTabs:[
                    {
                        title: '首页',
                        name: '/employeeHome/index',
                    }, {
                        title: '个人订餐',
                        name: '/employeeHome/individualReservation',
                    }, {
                        title: '加班订餐',
                        name: '/employeeHome/overtimeReservation',
                    }
                ]
            }
        },
        computed: {
            asd () {
                return this.$store.state.closePage;
            }
        },
        watch: {
            // "this.$store.state.closePage": {
            //     hander() {
            //         console.log("2")
            //         this.removeTab(this.editableTabsValue)
            //     },
            //     deep: true
            // }
            asd(newVal,oldVal){
                // console.log("100")
                if (newVal == "关闭") {
                    this.removeTab(this.editableTabsValue)
                }
                // if (newVal == "新增") {
                //     this.addTab(this.editableTabsValue)
                // }
                this.$store.commit("setClosePage", "")
            }
        },
        methods:{
            addTab(targetName) {
                //循环遍历，判断是否已有该标签页
                for (let i = 0; i < this.editableTabs.length; i++) {
                    //如果有，就让标签页的值等于对应值，并返回
                    if (targetName == this.editableTabs[i].name){
                        this.menuindex = targetName
                        this.editableTabsValue = targetName
                        return;
                    }
                }
                for (let i = 0; i < this.alltableTabs.length ; i++) {
                    if (targetName == this.alltableTabs[i].name) {
                        this.editableTabs.push(this.alltableTabs[i]);
                        this.menuindex = targetName
                        this.editableTabsValue = targetName
                    }
                }

            },
            removeTab(targetName) {
                let tabs = this.editableTabs;
                let activeName = this.editableTabsValue;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                                this.menuindex = activeName
                                this.$router.push(this.menuindex)
                            }
                        }
                    });
                }
                this.editableTabsValue = activeName;
                this.editableTabs = tabs.filter(tab => tab.name !== targetName);
                sessionStorage.removeItem("orderFoodForm")
                sessionStorage.removeItem("foodTable")
            },
            menuclick(index){
                // console.log(index);
                // this.$router.push(index)
                this.addTab(index)
            },
            tabclick(targetName){
                this.menuindex = targetName.name
                this.$router.push(this.menuindex)
                // this.menuclick(this.menuindex)
            },
            out() {
                sessionStorage.removeItem("uname")
                this.$router.push("/login")
            }
        },
        created(){
            sessionStorage.removeItem("orderFoodForm")
            sessionStorage.removeItem("foodTable")
            this.$router.push("/EmployeeHome/index")
        }
    }
</script>

<style scoped>

</style>