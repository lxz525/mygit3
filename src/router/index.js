import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import EmployeeHome from '../views/EmployeeHome.vue'
import ManagerHome from '../views/ManagerHome.vue'
import AdminHome from '../views/AdminHome.vue'
import Index from '../views/general/Index.vue'
import IndividualReservation from '../views/general/IndividualReservation.vue'
import OvertimeReservation from '../views/general/OvertimeReservation.vue'
import OrderSure from '../views/general/OrderSure.vue'
import AllOrderRecords from "../views/admin/AllOrderRecords";
import DeptList from "../views/admin/DeptList";
import EmpList from "../views/admin/EmpList";
import FoodList from "../views/admin/FoodList";
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Login
  },
  {
    path: '/employeeHome',
    component: EmployeeHome,
    redirect: '/employeeHome/index',
    children:[
      {
        path: '/employeeHome/index',
        component: Index,
      },
      {
        path: '/employeeHome/individualReservation',
        component: IndividualReservation,
      },
      {
        path: '/employeeHome/overtimeReservation',
        component: OvertimeReservation,
      }
    ]
  },
  {
    path: '/managerHome',
    component: ManagerHome,
    redirect: '/managerHome/index',
    children:[
        {
      path: '/managerHome/index',
      component: Index,
    },
    {
      path: '/managerHome/individualReservation',
      component: IndividualReservation,
    },
    {
      path: '/managerHome/overtimeReservation',
      component: OvertimeReservation,
    },
    {
      path: '/managerHome/orderSure',
      component: OrderSure,
    }
    ]
  },
  {
    path: '/adminHome',
    component: AdminHome,
    redirect: '/adminHome/index',
    children:[
      {
        path: '/adminHome/index',
        component: Index,
      },
      {
        path: '/adminHome/orderSure',
        component: OrderSure,
      },
      {
        path: '/adminHome/allOrderRecords',
        component: AllOrderRecords,
      },
      {
        path: '/adminHome/foodList',
        component: FoodList,
      },
      {
        path: '/adminHome/empList',
        component: EmpList,
      },
      {
        path: '/adminHome/deptList',
        component: DeptList,
      }
    ]
  },

]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // ?????? session ???????????? uname
  let path = to.fullPath
  sessionStorage.setItem("toPath",to.path)
  console.log(to.path)
  // if (path == "/") {
  //   next()
  //   return //????????????
  // }
  if (path == "/" || sessionStorage.getItem("uname") != null) {
    // ???????????????
    next()
    return;
  }
  // ?????????
  next("/")
})
export default router
