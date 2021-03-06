export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard' },
      {
        path: '/dashboard',
        name: '机构首页',
        component: './Dashboard/Analysis',
      },
      // 机构信息
      {
        path: '/merchant',
        name: '机构信息',
        component: './Merchant/Edit',
      },
      // 学生列表
      {
        path: '/student_list',
        name: '学生列表',
        component: './Student/List',
      },
      // 学生信息
      {
        path: '/student_edit/:id',
        name: '学生信息',
        component: './Student/Edit',
        hideInMenu: true,
      },
      // Teacherlist
      {
        path: '/month_list',
        name: '月卡管理',
        component: './Month/List',
      },
      // TeacherEdit
      {
        path: '/month_edit/:id',
        name: '查看月卡',
        component: './Month/Edit',
        hideInMenu: true,
      },
      // Teacherlist
      {
        path: '/once_list',
        name: '次卡管理',
        component: './Once/List',
      },
      // TeacherEdit
      {
        path: '/once_edit/:id',
        name: '查看次卡',
        component: './Once/Edit',
        hideInMenu: true,
      },
      // TeacherEdit
      {
        path: '/balence',
        name: '财务中心',
        routes:[
          {
            path:'/balence/list',
            name:'收入',
            component:'./Balence/List'
          }
        ]
      },
      {
        component: '404',
      },
    ],
  },
];
