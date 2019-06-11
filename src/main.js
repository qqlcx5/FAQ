import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

import 'font-awesome/css/font-awesome.min.css';
import './sass/layout.scss';
import './sass/body.scss';

import svgIcon from 'vue-svg-icon/Icon.vue'
Vue.component('icon', svgIcon)

import elAside from '@/components/aside';
import elHeader from '@/components/header';

Vue.component('elAside', elAside);
Vue.component('elHeader', elHeader);

import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Upload,
  Select,
  Option,
  Cascader,
  Popover,
  Dialog,
  Form,
  FormItem,
  Table,
  TableColumn,
  DatePicker,
  Loading,
  Pagination,
  Tree,
  MessageBox,
  Notification,
  Message,
  Badge,
  Tag,
  RadioGroup,
  Radio,
  Row,
  Col,
  tabs,
  tabPane,
  Collapse,
  CollapseItem,
  Dropdown,
  DropdownMenu,
  DropdownItem
} from 'element-ui';
Vue.use(Row);
Vue.use(Col);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Button);
Vue.use(Checkbox);
Vue.use(Input);
Vue.use(Upload);
Vue.use(Select);
Vue.use(Option);
Vue.use(Cascader);
Vue.use(Popover);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(CheckboxGroup);
Vue.use(Loading);
Vue.use(Pagination);
Vue.use(Tree);
Vue.use(Badge);
Vue.use(Tag);
Vue.use(tabs);
Vue.use(tabPane);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Dropdown)
Vue.use(DropdownMenu);
Vue.use(DropdownItem);

Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.prototype.$ELEMENT = {
  size: 'small',
  showClose: true
};

import {
  $msg
} from './js/common';

Vue.prototype.Msg = $msg;

import {
  initMenu
} from './js/menu';
initMenu(router, store);

router.beforeEach((to, from, next) => {
  if (to.name === 'login' || to.name === 'index' || to.name === 'mobileIndex' || to.name === 'faq_im_guest') return next();

  const jsonStringUserInfo = sessionStorage.getItem('userInfo');

  if (!jsonStringUserInfo) {
    next({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    })
  } else {
    store.commit('SETLOGIN', jsonStringUserInfo)
    next()
  }
})



Vue.directive('debound', {
  inserted: (el, binding) => {
    let timer; //全局

    const {
      method,
      data
    } = binding.value;
    el.addEventListener('input', ($event) => {
      let args = {
        val: $event.target.value,
        row: data
      };
      let func = () => {
        method(args)
      }
      clearTimeout(timer);

      timer = setTimeout(func, 1000)
    })

  }
})
import ECharts from 'vue-echarts/components/ECharts';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';
import 'echarts/theme/macarons';

import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/bar';

Vue.component('Chart', ECharts);
Vue.prototype.$ECharts = ECharts;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');