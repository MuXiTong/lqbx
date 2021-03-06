import Vue from 'vue'
import Router from 'vue-router'

import App from '@/App'

const login = resolve => require(['@/pages/login/login'], resolve)
const footer = resolve => require(['@/components/footer'], resolve)
const home = resolve => require(['@/pages/home/home'], resolve)
const user = resolve => require(['@/pages/user/user'], resolve)
const czrecord = resolve => require(['@/pages/lanbaoCenter/cz/czrecord'], resolve)
const zhrecord = resolve => require(['@/pages/lanbaoCenter/cz/zhrecord'], resolve)
const nbManagement = resolve => require(['@/pages/lanbaoCenter/nb/nbManagement'], resolve)

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
                    path: '/zhrecord', //签约记录
                    name: 'zhrecord', //签约记录
                    component: zhrecord
                },
                {
                    path: '/nbManagement', //年保管理
                    name: 'nbManagement', //年保管理
                    component: nbManagement
                },
                {
                    path: '*', //其他页面，强制跳转到登录页面
                    redirect: '/login'
                },
            ]
        }
    ]
})
