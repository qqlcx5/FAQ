<template>
  <header class="g-hd">
    <h1><icon name="robot" scale="20"></icon>海迈智能客服机器人管理系统</h1>

    <ul class="login-user">
      <li v-if="user">
        <icon name="user2"></icon>{{user.username}}
      </li>
      <li @click="cancel"
        style="color:rgba(255,255,255,.5)">
        <icon name="cancel"
          style="fill:rgba(255,255,255,.5)"></icon>注销
      </li>
    </ul>
  </header>
</template>
<script>
import {
  api_post, api_get,
} from '../api'
export default {
  computed: {
    user() {
      return this.$store.state.userInfo
    },
  },
  methods: {
    cancel() {
      api_post('logout');
      this.$store.commit('LOGOUT', { $route: this.$route, $router: this.$router });
    }
  },
}
</script>
<style lang="scss">
.g-hd {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 60px;
  line-height: 60px;
  padding: 0 22px;
  color: #fff;
  background: url("../assets/img/header.webp") no-repeat center/ cover;
  z-index: 1;
  h1 {
    display: flex;
    align-items: center;
  }
  svg {
    width: 30px;
    height: 30px;
    margin-right: 6px;
    fill: #fff;
    stroke: #fff;
  }
  .login-user {
    display: flex;
    margin-left: auto;
    font-size: 13px;
    li {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 10px;
      cursor: pointer;
      svg {
        width: 15px;
        height: 15px;
        margin-right: 6px;
      }
    }
  }
}
</style>

