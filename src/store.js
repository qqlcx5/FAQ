import Vue from 'vue';
import Vuex from 'vuex';
import {
  $formatDateTime
} from './js/common';

Vue.use(Vuex);
const firstChat = {
  answer: '您好，我是智能问答机器人，可以回答您一些业务相关问题，请向我提问吧',
  visible: 1,
  isSubmit: false,
  first: true
};

function traversalTree([...tree]) {
  for (let val of tree) {
    if (Array.isArray(val.children) && val.children.length) {
      traversalTree(val.children);
    } else {
      delete val.children;
    }
  }
  return tree;
}

export default new Vuex.Store({
  state: {
    userInfo: {},
    router: [],
    category: [],
    chatLst: [],
    faqLst: [{
        question: '免费版，每天能回答多少问题'
      },
      {
        question: '你们会不会泄露客户资料'
      },
      {
        question: '你们的词库'
      }
    ] //常见问题
  },
  getters: {
    nav(state) {
      return state.router.filter(item => {
        return item.meta && item.meta.title; //有标题的才是菜单
      });
    },
    filterCategory(state) {
      return traversalTree(state.category);
    }
  },
  mutations: {
    INITFAQLST(state, lst) {
      state.faqLst = lst;
    },
    INITROUTER(state, lst) {
      state.router = lst;
    },
    INITCATEGORY(state, lst) {
      state.category = [lst];
    },
    INITCHAT(state) {
      state.chatLst = [{
        ...firstChat,
        time: $formatDateTime(new Date())
      }];
    },
    PUSHCHATITEM(state, item) {
      // item.answer = item.answer.replace(/<[^>]+>/g, '');
      item.time = $formatDateTime(new Date());

      let idx = state.chatLst.length;
      item.index = idx;
      state.chatLst.push(item);
    },
    PUSHCHATITEMSUBMIT(state, obj) {
      state.chatLst.forEach(item => {
        if (item.index === obj.index) {
          item.isSubmit = obj.isSubmit;
        }
      });
    },
    CHANGEPROPERTY(state, obj) {
      //改变状态
      let item = state.chatLst[obj.index];
      item[obj.key] = obj.val;
      state.chatLst.splice(obj.index, item);
    },

    /**
     * @param {JSONStringify} jsonStringUserInfo 
     */
    SETLOGIN(state, jsonStringUserInfo) {
      state.userInfo = JSON.parse(jsonStringUserInfo);
      sessionStorage.setItem('userInfo', jsonStringUserInfo);
    },

    /**
     * @param {obj} {$route,$router} 路由对象
     */
    LOGOUT(state, {
      $route,
      $router
    }) {
      sessionStorage.removeItem('userInfo');
      state.userInfo = '';

      let path = $route.path;
      $router.push({
        path: '/login',
        query: {
          redirect: path
        }
      });
    }
  },
  actions: {}
});