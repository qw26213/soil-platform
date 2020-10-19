import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Layout from '@/layout/index'

export const constantRoutes = [{
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
}, {
    path: '/login',
    component: () => import('@/views/login/index'),
    children: [{
        path: '/login',
        component: () => import('@/views/login/components/login'),
        hidden: true
    }, {
        path: '/register',
        component: () => import('@/views/login/components/register'),
        hidden: true
    }, {
        path: '/forgetpsw',
        component: () => import('@/views/login/components/password'),
        hidden: true,
        children: [{
            path: '/forgetpsw',
            component: () => import('@/views/login/components/validate'),
            hidden: true
        }, {
            path: '/submitpsw',
            component: () => import('@/views/login/components/submitpsw'),
            hidden: true
        }]
    }]
}]

export const asyncRoutes = [{
        path: '/',
        component: Layout,
        redirect: '/collect',
        hidden: true
    }, {
        path: '/collect',
        component: Layout,
        redirect: '/collect/create',
        meta: {
            title: '采集管理',
            icon: 'collect'
        },
        children: [{
            path: 'create',
            component: () => import('@/views/collect/create'),
            name: 'collect',
            meta: {
                title: '采集规划'
            }
        }, {
            path: 'batch',
            component: () => import('@/views/collect/batch'),
            name: 'batch',
            meta: {
                title: '批次管理'
            }
        }, {
            path: 'batchdetail',
            component: () => import('@/views/collect/batchdetail'),
            name: 'batchdetail',
            hidden: true,
            meta: {
                title: '批次管理详情'
            }
        }, {
            path: 'task',
            component: () => import('@/views/collect/task'),
            name: 'task',
            meta: {
                title: '任务管理'
            }
        }, {
            path: 'people',
            component: () => import('@/views/collect/people'),
            name: 'people',
            meta: {
                title: '志愿者管理'
            }
        }, {
            path: 'peopledetail',
            component: () => import('@/views/collect/peopledetail'),
            name: 'peopledetail',
            hidden: true,
            meta: {
                title: '志愿者详情'
            }
        }, {
            path: 'display',
            component: () => import('@/views/collect/display'),
            name: 'display',
            meta: {
                title: '结果展示'
            }
        }]
    }, {
        path: '/store',
        component: Layout,
        redirect: '/store/code',
        name: 'store',
        meta: {
            title: '仓库管理',
            icon: 'store'
        },
        children: [{
            path: 'code',
            component: () => import('@/views/store/code'),
            name: 'code',
            meta: {
                title: '赋码管理'
            }
        }, {
            path: 'codedetail',
            component: () => import('@/views/store/codedetail'),
            name: 'codedetail',
            hidden: true,
            meta: {
                title: '赋码详情'
            }
        }, {
            path: 'data',
            component: () => import('@/views/store/data'),
            name: 'warehosueData',
            meta: {
                title: '入库管理'
            }
        }, {
            path: 'query',
            component: () => import('@/views/store/query'),
            name: 'query',
            meta: {
                title: '查询管理'
            }
        }, {
            path: 'shelfdetail',
            component: () => import('@/views/store/shelfdetail'),
            name: 'shelfdetail',
            hidden: true,
            meta: {
                title: '货架详情'
            }
        }]
    }, {
        path: '/detect',
        component: Layout,
        redirect: '/detect/data',
        name: 'detect',
        meta: {
            title: '检测管理',
            icon: 'excel'
        },
        children: [{
            path: 'data',
            component: () => import('@/views/detect/data.vue'),
            name: 'detectData',
            meta: {
                title: '送检管理'
            }
        }, {
            path: 'input',
            component: () => import('@/views/detect/input.vue'),
            name: 'input',
            meta: {
                title: '结果录入'
            }
        }, {
            path: 'result',
            component: () => import('@/views/detect/result.vue'),
            name: 'result',
            meta: {
                title: '结果查询'
            }
        }]
    }, {
        path: '/system',
        component: Layout,
        redirect: '/system/param',
        name: 'system',
        meta: {
            title: '系统管理',
            icon: 'maintain'
        },
        children: [{
            path: 'param',
            component: () => import('@/views/system/param'),
            name: 'param',
            meta: {
                title: '参数配置'
            }
        }, {
            path: 'create',
            component: () => import('@/views/system/create'),
            name: 'create',
            meta: {
                title: '系统创建'
            }
        }, {
            path: 'role',
            component: () => import('@/views/system/role'),
            name: 'role',
            meta: {
                title: '角色管理'
            }
        }, {
            path: 'user',
            component: () => import('@/views/system/user'),
            name: 'user',
            meta: {
                title: '用户管理'
            }
        }, {
            path: 'func',
            component: () => import('@/views/system/func'),
            name: 'func',
            meta: {
                title: '权限管理'
            }
        }]
    }, {
        path: '*',
        edirect: '/404',
        hidden: true
    }
]

const createRouter = () => new VueRouter({
    // mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router