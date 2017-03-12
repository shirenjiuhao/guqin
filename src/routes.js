import Login from './pages/Login.vue'
import NotFound from './pages/404.vue'
import Home from './pages/Home.vue'
import Main from './pages/Main.vue'
import Course from './pages/nav1/Course.vue'//课程信息
import Class from './pages/nav1/Class.vue'//学堂信息
import Teacher from './pages/nav1/Teacher.vue'//教师信息
import Ware from './pages/nav1/Ware.vue'//商品信息
import Page4 from './pages/nav2/Page4.vue'
import Page5 from './pages/nav2/Page5.vue'
import Page6 from './pages/nav3/Page6.vue'
import echarts from './pages/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '基本信息',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/course', component: Course, name: '课程信息' },
            { path: '/class', component: Class, name: '学堂信息' },
            { path: '/teacher', component: Teacher, name: '老师信息' }/*,
            { path: '/ware', component: Ware, name: '商品信息' },*/
        ]
    },
    {
        path: '/',
        component: Home,
        name: '课程',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/page4', component: Page4, name: '课程管理' },
            { path: '/page5', component: Page5, name: '报名信息' }
        ]
    },
   /* {
        path: '/',
        component: Home,
        name: '商城',
        iconCls: 'fa fa-address-card',
        //leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '商城管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },*/
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;