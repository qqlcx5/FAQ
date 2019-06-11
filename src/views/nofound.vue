<template>
  <div class="container nofound">
    <div class="m-main">
      <!-- <icon name="404"></icon> -->
      <p>该页面不存在(ಥ﹏ಥ)

      </p>
      <router-link class="bakHome"
        to="/">返回首页</router-link>
    </div>
  </div>
</template>

<style lang="scss">
@import "../sass/mixin.scss";
.nofound {
  font-size: 24px;
  color: $placeholder;
  .m-main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    a {
      color: $fontSecond;
    }
    svg {
      width: 350px;
      height: 350px;
      fill: $placeholder;
    }
  }
  .bakHome {
    font-size: 16px;
  }
}
</style>

