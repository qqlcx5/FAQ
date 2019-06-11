import {
  api_get,
  api_post
} from './';

const postCategory = function (store) {
  return new Promise(() => {
    api_post('getMenuTree').then(resp => {
      store.commit('INITCATEGORY', resp.datas);
    });
  });
};
const dragUpdateCategory = function (store, params) {
  return new Promise(() => {
    api_post('/classNodeDrag', params).then(resp => {
      store.commit('INITCATEGORY', resp.datas);
    });
  });
};

export {
  postCategory,
  dragUpdateCategory
};