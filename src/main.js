/*
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-11 17:32:06
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-11 17:34:45
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
