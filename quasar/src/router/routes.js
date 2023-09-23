
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/HomePage.vue'), name: "首页" },
      { path: '/index', component: () => import('pages/IndexPage.vue'), name: "登录页" },
      { path: '/forgot', component: () => import('pages/ForgotPage.vue'), name: "密码重置" },
      { path: '/register', component: () => import('pages/RegisterPage.vue'), name: "注册页" },
      { path: '/query', component: () => import('pages/QueryPage.vue'), name: "查询页" },
      { path: '/logger', component: () => import('pages/LoggerPage.vue'), name: "日志页" },
      { path: '/management', component: () => import('pages/ManagementPage.vue'), name: "管理页" },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
