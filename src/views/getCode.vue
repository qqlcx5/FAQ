<template>
  <div class="container" ref="getCode">
    <Aside></Aside>
    <Header></Header>
   <elCode></elCode>
  </div>
</template>
<script>

import Aside from "../components/aside";
import Header from "../components/header";
import elCode from "../components/getCode";
export default {
    components: {
    Aside,
    Header,
    elCode
    }
}
</script>

