<template>
  <aside class="m-side custom-scroll">
    <div>
      <ul>
        <li v-for="item in nav" :key="item.path"
          :class="['item',{'active': naveActive === item.path}]">
          <span :class="['fa','fa-fw',`fa-${item.meta.icon}`]"></span>
          <router-link :to="item.path">{{item.meta.title}}</router-link>
        </li>
      </ul>
    </div>
    <!-- <router-view /> -->
  </aside>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['nav']),
    naveActive() {
      return this.$route.path;
    }
  }
};
</script>
<style lang="scss">
@import "../sass/_mixin.scss";
.m-side {
  width: 238px;
  height: 100%;
  overflow: auto;
  flex-shrink: 0;
  background: #fff;

  &:hover {
    .el-collapse::-webkit-scrollbar-thumb {
      display: block;
    }

    .reuseLst::-webkit-scrollbar-thumb {
      display: block;
    }
  }

  @media (max-width: 1024px) {
    & {
      width: 190px;
    }
  }

  & > div {
    height: 100%;
    color: #fff;
    background: #384773;

    h3.item {
      background: #2d3767;
      font-size: 16px;
    }

    li.item {
      background: #384773;

      a {
        flex: 1;
        height: 52px;
        line-height: 52px;
        padding-left: 28px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      &.active {
        background: $primary;
      }
    }
  }

  .item {
    display: flex;
    align-items: center;
    height: 52px;
    padding: 0 26px;
    border: 1px solid #003564;
    border-left: none;
    border-right: none;
    color: #fff;
    &:last-of-type {
      border-bottom: 2px solid #003564;
    }
    a {
      text-decoration: none;
      color: inherit;
      flex: 1;
    }
  }

  @media screen and (max-width: 1024px) {
    & {
      width: 220px;
    }
  }
}
</style>
