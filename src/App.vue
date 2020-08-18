<!--
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-11 17:32:06
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-13 15:45:52
-->
<template>
  <div id="app">
    <TopBar></TopBar>
    <router-view></router-view>
  </div>
</template>

<script>
import TopBar from "@/components/TopBar";
import mixins_user from "./mixins/user";
import { WEBGL } from 'three/examples/jsm/WebGL.js';

export default {
  mixins: [mixins_user],
  provide() {
    return {
      app: this
    };
  },
  name: "app",
  components: {
    TopBar
  },
  mounted(){
    if (!WEBGL.isWebGLAvailable()) {
      var warning = WEBGL.getWebGLErrorMessage();
      this.$message({
        type: 'warning',
        dangerouslyUseHTMLString: true,
        message: warning
      });
    }
  }
};
</script>

<style lang="scss">
@import './style/reset';
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
