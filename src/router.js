/*
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-11 17:39:36
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-20 14:43:52
 */
import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/Home";
import { concat } from "./routes/src/routes";

Vue.use(Router);

// 重复路由点击报错问题
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    ...concat
  ]
});
