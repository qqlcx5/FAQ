const lst = [{
    path: '/index',
    name: 'index',
    component: () => import('../views/index'),
    meta: {
      title: '首页',
      icon: 'home'
    }
  },
  {
    path: '/categoryMgt',
    name: 'categoryMgt',
    component: () => import('../views/categoryMgt'),
    meta: {
      title: '类别管理',
      icon: 'bars'
    }
  },
  {
    path: '/interlocutionMgt',
    name: 'interlocutionMgt',
    component: () => import('../views/interlocutionMgt'),
    meta: {
      title: '知识库',
      icon: 'question-circle-o '
    }
  },
  {
    path: '/statisticalAnalysis',
    name: 'statisticalAnalysis',
    component: () => import('../views/statisticalAnalysis'),
    meta: {
      title: '统计分析',
      icon: 'line-chart'
    }
  },
  {
    path: '/userMgt',
    name: 'userMgt',
    component: () => import('../views/userMgt'),
    meta: {
      title: '用户管理',
      icon: 'user'
    }
  }, {
    path: '/imMgt',
    name: 'imMgt',
    component: () => import('../views/faq_im_customer'),
    meta: {
      title: 'IM',
      icon: 'commenting'
    }
  }, {
    path: '/getCode',
    name: 'getCode',
    component: () => import('../views/getCode'),
    meta: {
      title: '获取代码',
      icon: 'code'
    }
  }, {
    path: '/codeMgt',
    name: 'codeMgt',
    component: () => import('../views/codeMgt'),
    meta: {
      title: '代码管理',
      icon: 'code'
    }
  }, {
    path: '/synonym',
    name: 'synonym',
    component: () => import('../views/synonym'),
    meta: {
      title: '同义词',
      icon: 'refresh'
    }
  },
  {
    path: '/professional',
    name: 'professional',
    component: () => import('../views/professional'),
    meta: {
      title: '专业词',
      icon: 'circle'
    }
  },
  {
    path: '/faq_im_guest',
    name: 'faq_im_guest',
    component: () => import('../views/faq_im_guest'),
    meta: {
      title: 'test',
      icon: 'circle'
    }
  },
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login'),
  },
  {
    path: '*',
    name: 'nofound',
    component: () => import('../views/nofound')
  }
];

const mlst = [{
    path: '/mobile/index',
    name: 'mobileIndex',
    component: () => import('../views/mobile/index'),
    meta: {
      title: '移动首页',
      icon: 'home'
    }
  },
  {
    path: '/mobile/client',
    name: 'mobileIMClient',
    component: () => import('../views/mobile/client'),
    meta: {
      title: '人工客服-访客端',
      icon: 'home'
    }
  },
  {
    path: '/mobile/server',
    name: 'mobileIMServer',
    component: () => import('../views/mobile/server'),
    meta: {
      title: '人工客服-客服端',
      icon: 'home'
    }
  }
];

const initMenu = (router, store) => {
  router.addRoutes(lst);
  router.addRoutes(mlst);
  store.commit('INITROUTER', lst);
};

export {
  initMenu
};