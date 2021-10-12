import Vue from 'vue'
import Router from 'vue-router'

import App from '@/App'

const login = resolve => require(['@/pages/login/login'], resolve)
const footer = resolve => require(['@/components/footer'], resolve)
const home = resolve => require(['@/pages/home/home'], resolve)
const user = resolve => require(['@/pages/user/user'], resolve)
const czrecord = resolve => require(['@/pages/lanbaoCenter/cz/czrecord'], resolve)
const zhrecord = resolve => require(['@/pages/lanbaoCenter/cz/zhrecord'], resolve)
const yjrecord = resolve => require(['@/pages/lanbaoCenter/cz/yjrecord'], resolve)
const czzjrecord = resolve => require(['@/pages/lanbaoCenter/cz/czzjrecord'], resolve)
const nbManagement = resolve => require(['@/pages/lanbaoCenter/nb/nbManagement'], resolve)
const recharge = resolve => require(['@/pages/lanbaoCenter/cz/rechargeMoney'], resolve)
const signContract = resolve => require(['@/pages/lanbaoCenter/cz/signContract'], resolve)
const register = resolve => require(['@/pages/lanbaoCenter/cz/register'], resolve)

Vue.use(Router)

export default new Router({
//   mode: 'history',
  routes: [
        {
            path: '/',
            component: App, //顶层路由
            children: [//二级路由
                {
                    path: '/login', //登录
                    meta: { auth: false },
                    component: login
                },
                {
                    path: '/', //如果之前登录过则跳到这里.跳到home页
                    meta: { auth: false },
                    component: footer,
                    children:[
                        {
                            path: 'home', //首页
                            meta: { index:0 },
                            component: home,
                        },
                        {
                            path: 'user', //我的
                            meta: { index:1 },
                            component: user
                        }
                    ]
                },
                {
                    path: '/czrecord', //签约记录
                    name: 'czrecord', //签约记录
                    component: czrecord
                },
                {
                    path: '/zhrecord', //账户记录
                    name: 'zhrecord', //账户记录
                    component: zhrecord
                },
                {
                    path: '/yjrecord', //预警记录
                    name: 'yjrecord', //预警记录
                    component: yjrecord
                },
                {
                    path: '/czzjrecord', //充值足迹
                    name: 'czzjrecord', //充值足迹
                    component: czzjrecord
                },
                {
                    path: '/nbManagement', //年保管理
                    name: 'nbManagement', //年保管理
                    component: nbManagement
                },
                {
                    path: '/recharge', //快速充值
                    name: 'recharge', //快速充值
                    meta: { isHomeCome: true },
                    component: recharge
                },
                {
                    path: '/signContract', //保险签约
                    name: 'signContract', //保险签约
                    meta: { isHomeCome: true },
                    component: signContract
                },
                {
                    path: '/register', //保险注册
                    name: 'register', //保险注册
                    meta: { isHomeCome: true },
                    component: register
                },
                {
                    path: '*', //其他页面，强制跳转到登录页面
                    redirect: '/login'
                },
            ]
        }
    ]
})
