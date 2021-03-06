import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  // {
  //   path: '',
  //   component: Layout,
  //   redirect: 'dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: () => import('@/views/dashboard/index'),
  //       name: 'Dashboard',
  //       meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
  //     }
  //   ]
  // },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/controlboard/index'),
        name: 'Dashboard',
        meta: { title: '控制台', icon: 'desk', noCache: true }
      },
      {
        path: 'grabList',
        name: 'grabList',
        component: () => import('@/views/controlboard/grabList'),
        meta: { title: '抢单列表', noCache: true },
        hidden: true
      },
      {
        path: 'messageList',
        name: 'messageList',
        component: () => import('@/views/controlboard/messageList'),
        meta: { title: '消息列表', noCache: true },
        hidden: true
      },
      {
        path: 'checkoutSuccess',
        component: () => import('@/views/controlboard/checkoutSuccess'),
        hidden: true
      },
      // 抢单成功页面
      {
        path: 'SuccessfulSingle',
        name: 'SuccessfulSingle',
        component: () => import('@/views/controlboard/SuccessfulSingle'),
        meta: { title: '抢单成功', noCache: true },
        hidden: true
      }
    ]
  }

  // {
  //   path: '/documentation',
  //   component: Layout,
  //   redirect: '/documentation/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'documentation', icon: 'documentation', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/index',
  //   alwaysShow: true, // will always show the root menu
  //   meta: {
  //     title: 'permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'pagePermission',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'directivePermission'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     }
  //   ]
  // },

  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/svg-icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },

  /** When your routing table is too long, you can split it into small modules**/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'example',
  //     icon: 'example'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'createArticle', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'editArticle', noCache: true },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'articleList', icon: 'list' }
  //     }
  //   ]
  // },

  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: 'tab', icon: 'tab' }
  //     }
  //   ]
  // },

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'errorPages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/errorPage/401'),
  //       name: 'Page401',
  //       meta: { title: 'page401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/errorPage/404'),
  //       name: 'Page404',
  //       meta: { title: 'page404', noCache: true }
  //     }
  //   ]
  // },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/errorLog/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'errorLog', icon: 'bug' }
  //     }
  //   ]
  // },

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/exportExcel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'exportExcel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/selectExcel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'selectExcel' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/uploadExcel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'uploadExcel' }
  //     }
  //   ]
  // },

  // 订单管理
  {
    path: '/orderManagement',
    component: Layout,
    redirect: '/orderManagement/examineGood',
    alwaysShow: true,
    name: 'orderManagement',
    meta: {
      title: '订单管理',
      icon: 'good'
    },
    children: [
      {
        path: 'examineGood',
        component: () => import('@/views/orderManagement/examineGood'),
        name: 'examineGood',
        meta: { title: '验货订单' }
      },
      {
        path: 'pay',
        hidden: true,
        name: 'pay',
        component: () => import('@/views/orderManagement/pay'),
        meta: { title: '验货订单' }
      },
      {
        path: 'orderDetails',
        hidden: true,
        name: 'orderDetails',
        component: () => import('@/views/orderManagement/orderDetails'),
        meta: { title: '订单详情' }
      },
      {
        path: 'reporteManager',
        name: 'reporteManager',
        component: () => import('@/views/orderManagement/reporteManager'),
        redirect: '/orderManagement/reporteManager/index',
        meta: { title: '报告管理' },
        children: [
          {
            path: 'index',
            hidden: true,
            component: () => import('@/views/orderManagement/reporteManagerMune'),
            name: 'index',
            meta: {
            }
          },
          {
            path: 'uploadReport',
            hidden: true,
            component: () => import('@/views/orderManagement/reporteManagerMune/uploadReport'),
            name: 'uploadReport',
            meta: {
              title: '上传报告'
            }
          },
          {
            path: 'writeReporte',
            hidden: true,
            component: () => import('@/views/report/templates/base'),
            name: 'writeReporte',
            meta: {
              title: '写报告'
            }
          },
          {
            path: 'previewReport',
            hidden: true,
            component: () => import('@/views/orderManagement/reporteManagerMune/previewReport'),
            name: 'previewReport',
            meta: {
              title: '报告预览'
            }
          }
        ]
      }
    ]
  },
  // 账户管理
  {
    path: '/accountManagement',
    component: Layout,
    redirect: '/accountManagement/wallet/walletAccount',
    name: 'accountManagement',
    meta: {
      title: '账户信息',
      icon: 'account'
    },
    children: [
      {
        path: 'wallet',
        component: () => import('@/views/accountManagement/wallet'),
        name: 'wallet',
        redirect: '/accountManagement/wallet/walletAccount',
        meta: { title: '钱包账户' },
        children: [

          {
            path: 'withdrawCash',
            hidden: true,
            component: () => import('@/views/accountManagement/walletAccountMune/withdrawCash'),
            name: 'withdrawCash',
            meta: {
              title: '提现'
            }
          },
          {
            path: 'addCard',
            component: () => import('@/views/accountManagement/walletAccountMune/addCard'),
            name: 'addCard',
            hidden: true,
            meta: { title: '添加银行卡' }
          },
          {
            path: 'cardManagement',
            component: () => import('@/views/accountManagement/walletAccountMune/cardManagement'),
            name: 'cardManagement',
            hidden: true,
            meta: { title: '银行卡管理' }
          },
          {
            path: 'confirmDrawCash',
            component: () => import('@/views/accountManagement/walletAccountMune/confirmDrawCash'),
            name: 'confirmDrawCash',
            hidden: true,
            meta: { title: '确认提现' }
          },
          {
            path: 'walletAccount',
            hidden: true,
            component: () => import('@/views/accountManagement/walletAccountMune/walletAccount'),
            name: 'walletAccount',
            meta: {
              // title: '钱包账户'
            }
          },
          {
            path: 'walletDetail',
            hidden: true,
            component: () => import('@/views/accountManagement/walletAccountMune/walletDetail'),
            name: 'walletDetail',
            meta: {
              title: '钱包详情'
            }
          },
          {
            path: 'bailDetail',
            hidden: true,
            component: () => import('@/views/accountManagement/walletAccountMune/bailDetail'),
            name: 'bailDetail',
            meta: {
              title: '保证金详情'
            }
          },
          {
            path: 'withdrawRecord',
            hidden: true,
            component: () => import('@/views/accountManagement/walletAccountMune/withdrawRecord'),
            name: 'withdrawRecord',
            meta: {
              title: '提现记录详情'
            }
          }
        ]
      },
      // {
      //   path: 'withdrawCash',
      //   hidden: true,
      //   component: () => import('@/views/accountManagement/withdrawCash'),
      //   name: 'withdrawCash',
      //   meta: {
      //     title: '提现'
      //   }
      // },
      {
        path: 'accountSetting',
        component: () => import('@/views/accountManagement/accountSetting'),
        redirect: '/accountManagement/accountSetting/index',
        name: 'accountSetting',
        meta: { title: '账户设置' },
        children: [
          {
            path: 'index',
            hidden: true,
            component: () => import('@/views/accountManagement/accountSettingMune'),
            name: 'index',
            meta: {
            }
          },
          {
            path: 'accountResetLoginPassword',
            hidden: true,
            component: () => import('@/views/accountManagement/accountSettingMune/accountResetLoginPassword'),
            name: 'accountResetLoginPassword',
            meta: {
              title: '登录密码重置' }
          },
          {
            path: 'resetByPassword',
            hidden: true,
            component: () => import('@/views/accountManagement/accountSettingMune/resetByPassword'),
            name: 'resetByPassword',
            meta: {
              title: '登录密码重置' }
          },
          {
            path: 'resetByEmail',
            hidden: true,
            component: () => import('@/views/accountManagement/accountSettingMune/resetByEmail'),
            name: 'resetByEmail',
            meta: {
              title: '登录密码重置' 
            }
          },
          {
            path: 'resetByPhone',
            hidden: true,
            component: () => import('@/views/accountManagement/accountSettingMune/resetByPhone'),
            name: 'resetByPhone',
            meta: {
              title: '登录密码重置' 
            }
          },
          {
            path: 'resetPaymentPassword',
            hidden: true,
            component: () => import('@/views/accountManagement/accountSettingMune/resetPaymentPassword'),
            name: 'resetPaymentPassword',
            meta: {
              title: '支付密码重置' 
            }
          },
          {
            path: 'payResetByPassword',
            hidden: true,
            component: () => import('@/views/accountManagement/accountSettingMune/payResetByPassword'),
            name: 'payResetByPassword',
            meta: {
              title: '支付密码重置' 
            }
          },
          {
            path: 'payResetByEmail',
            hidden: true,
            component: () => import('@/views/accountManagement/accountSettingMune/payResetByEmail'),
            name: 'payResetByEmail',
            meta: {
              title: '支付密码重置' 
            }
          },
          {
            path: 'payResetByPhone',
            hidden: true,
            component: () => import('@/views/accountManagement/accountSettingMune/payResetByPhone'),
            name: 'payResetByPhone',
            meta: {
              title: '支付密码重置' 
            }
          }    
        ]  
      },
      // {
      //   path: 'companyInformation',
      //   component: () => import('@/views/accountManagement/companyInformation'),
      //   name: 'companyInformation',
      //   meta: { title: '企业信息' }
      // },
      // {
      //   path: 'accountSetting',
      //   component: () => import('@/views/accountManagement/accountSetting'),
      //   name: 'accountSetting',
      //   meta: { title: '账户设置' }
      // },
      {
        path: 'professiondData',
        component: () => import('@/views/accountManagement/professiondData'),
        name: 'professiondData',
        meta: { title: '专业资料' }
      },
      {
        path: 'dataAudite',
        component: () => import('@/views/accountManagement/dataAudite'),
        name: 'dataAudite',
        hidden: true,
        meta: { title: '专业资料' }
      }
    ]
  },
  // 资金管理
  // {
  //   path: '/fundManagement',
  //   component: Layout,
  //   redirect: '/fundManagement/walletAccount',
  //   alwaysShow: true,
  //   name: 'fundManagement',
  //   meta: {
  //     title: '资金管理',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'walletAccount',
  //       component: () => import('@/views/fundManagement/walletAccount'),
  //       name: 'walletAccount',
  //       meta: { title: '钱包账户' }
  //     }
  //   ]
  // },

  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   meta: { title: 'zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'exportZip' }
  //     }
  //   ]
  // },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'theme', icon: 'theme' }
  //     }
  //   ]
  // },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'clipboardDemo', icon: 'clipboard' }
  //     }
  //   ]
  // },

  // {
  //   path: '/i18n',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/i18n-demo/index'),
  //       name: 'I18n',
  //       meta: { title: 'i18n', icon: 'international' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'externalLink', icon: 'link' }
  //     }
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true }
]
